import React from 'react'
import omit from 'lodash/omit'
import ReactGA from 'react-ga'
import styled, { css, keyframes } from 'styled-components'
import { useHistory, useParams, Redirect } from 'react-router-dom'
import { addMinutes, isAfter } from 'date-fns'
import { produce } from 'immer'
import { useMutation } from '@apollo/react-hooks'

import determineStartTime from '../../helpers/determineStartTime'
import getFirstAvailableTime from '../../helpers/getFirstAvailableTime'

import Review from './Review'

import { sequentialUpsertMutation } from '../../graphql/mutations'
import ServiceSelector from '../../components/ServiceSelector'
import Header from './Header'
import { profileQuery } from '../../graphql/queries'

import SourceTypeSelection from './SourceTypeSelection'

import NoWaitModal from './Overview/NoWaitModal'
import { scheduleRangeFromDate } from '../../helpers/scheduleRangesByDate'

const AuthView = React.lazy(() => import('../CustomerAuthView'))
const Finished = React.lazy(() => import('./FinishedView'))

const expandAnimation = keyframes`
	from { 
		transform: translateY(-50px);
	} to {
		transform: translateY(0px);
	}
`

const confirmedStyles = ({ confirmed }) =>
	confirmed &&
	css`
		padding-top: 75px;
	`

const Wrapper = styled('div')`
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding-top: 90px;
	transform: translateY(-50px);
	animation: ${expandAnimation} 0.2s ease forwards;

	.button {
		width: 100%;
	}
	${confirmedStyles};
`

const getAppointmentDuration = (serviceIds, services) => {
	return serviceIds.reduce((acc, id) => acc + parseInt(services[id].sources?.[0]?.duration || 0, 10), 0)
}

const sourceTypes = {
	appointment: 1,
	checkin: 2
}

const RootContainer = ({ profileId, location }) => {
	const history = useHistory()
	const { employeeId } = useParams()

	// submitting is needed to prevent race conditions from graphql in the Review view
	const [submitting, setSubmitting] = React.useState(false)
	const [isNoWaitModalVisible, setNoWaitModalVisibility] = React.useState(false)

	const [createdAppt, setCreatedAppointment] = React.useState(undefined)

	const [employee] = React.useState(location.employees.find(({ id }) => Number(id) === Number(employeeId)))

	const [estimates, setEstimates] = React.useState({
		lastAppointment: undefined,
		startTime: undefined,
		endTime: undefined
	})

	const [customer, setCustomer] = React.useState({ id: profileId })

	const [appointment, setAppointment] = React.useState({
		duration: 0,
		locationId: location.id,
		userId: employee.id,
		services: []
	})

	const [{ step, ...state }, setState] = React.useState({
		step: 1,
		selectedServices: {},
		sourceType: undefined,
		price: 0,
		services: employee.services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {})
	})

	const setStep = step => setState(prev => ({ ...prev, step }))

	const [createAppointment, { loading }] = useMutation(sequentialUpsertMutation, {
		update: (proxy, { data: { checkinOnline } }) => {
			const cache = proxy.readQuery({
				query: profileQuery,
				variables: { skip: false }
			})

			proxy.writeQuery({
				query: profileQuery,
				variables: { skip: false },
				data: produce(cache, draftState => {
					draftState.profile.appointments.upcoming.unshift(checkinOnline)
				})
			})
		}
	})

	const setSelectedService = service => {
		const isAdding = !state.selectedServices[service.id]

		const servicePrice = parseFloat(service.sources && service.sources[0] ? service.sources[0].price : 0)

		setState(prev => ({
			...prev,
			price: isAdding ? prev.price + servicePrice : prev.price - servicePrice,
			selectedServices: isAdding
				? {
						...prev.selectedServices,
						[service.id]: service
				  }
				: omit(prev.selectedServices, [service.id])
		}))

		const services = isAdding
			? appointment.services.concat([service.id])
			: appointment.services.filter(id => id !== service.id)

		const duration = getAppointmentDuration(services, state.services)

		setAppointment(prev => ({ ...prev, services, duration }))
	}

	// Update the estimated wait time when new appointments are made before this one is able to book.
	// Update the estimated time any time the duration changes (such as when selecting a service)
	React.useEffect(() => {
		const schedule = scheduleRangeFromDate({
			scheduleRanges: employee.schedule_ranges,
			date: new Date()
		})

		const firstAvailableTime = getFirstAvailableTime({
			appointments: employee.appointments,
			duration: appointment.duration,
			schedule
		})

		const startTime = determineStartTime({ firstAvailableTime })

		setEstimates(prev => ({
			...prev,
			startTime,
			endTime: addMinutes(startTime, appointment.duration || 0)
		}))
	}, [employee.appointments, employee.schedule_ranges, appointment.duration])

	const handleCreate = async () => {
		if (loading) return

		setSubmitting(true)

		const { data } = await createAppointment({
			variables: {
				input: {
					...appointment,
					services: appointment.services.map(id => parseInt(id))
				}
			}
		})

		setStep(3)
		setCreatedAppointment(data.checkinOnline)

		ReactGA.event({
			category: 'OnlineCheckin',
			action: 'Created',
			value: Number(data.checkinOnline.id)
		})

		localStorage.setItem('last-appt', JSON.stringify(data.checkinOnline))
	}

	const handleAppointmentCreated = appointment => {
		setStep(4)
		setCreatedAppointment(appointment)

		ReactGA.event({
			category: 'OnlineAppointment',
			action: 'Created',
			value: Number(appointment.id)
		})

		localStorage.setItem('last-appt', JSON.stringify(appointment))
	}

	if (!employee) return <Redirect to="/" />

	if (isNoWaitModalVisible) {
		return <NoWaitModal location={location} onClose={() => setNoWaitModalVisibility(false)} />
	}

	return (
		<Wrapper confirmed={step === 4}>
			{(step !== 2 || state.sourceType) && (
				<Header
					isAppointment={state.sourceType === sourceTypes.appointment}
					stepModifier={state.sourceType === sourceTypes.checkin ? 1 : 0}
					showBack={step !== 4}
					onBack={() => {
						if (step === 1 || step === 4) {
							return history.goBack()
						}

						if (step === 3) {
							setState(prev => ({ ...prev, sourceType: undefined }))
						}

						setStep(step - 1)
					}}
					loggedIn={!!customer.id}
					step={step}
				/>
			)}
			{step === 1 && (
				<ServiceSelector
					services={employee.services}
					onNext={() => {
						setStep(2)
					}}
					selectedServiceIds={appointment.services}
					selectedServices={state.selectedServices}
					price={state.price}
					onSelect={service => {
						setSelectedService(service)
					}}
				/>
			)}

			<React.Suspense fallback={null}>
				{step === 2 && !createdAppt && customer.id && !state.sourceType && (
					<SourceTypeSelection
						employee={employee}
						estimates={estimates}
						onBack={() => setState(prev => ({ ...prev, step: prev.step - 1 }))}
						onSelectCheckin={() => {
							if (isAfter(addMinutes(new Date(), 20), estimates.startTime)) {
								setNoWaitModalVisibility(true)
							} else {
								setState(prev => ({ ...prev, step: 3, sourceType: sourceTypes.checkin }))
							}
						}}
						onSelectAppointment={() => setState(prev => ({ ...prev, step: 3, sourceType: sourceTypes.appointment }))}
					/>
				)}

				{step === 3 && !createdAppt && customer.id && state.sourceType === sourceTypes.checkin && (
					<Review
						submitting={submitting}
						loading={loading}
						price={state.price}
						selectedServices={state.selectedServices}
						selectedServiceIds={appointment.services}
						locationData={location}
						estimates={estimates}
						handleConfirm={handleCreate}
					/>
				)}

				{/* {step === 3 && !createdAppt && customer.id && state.sourceType === sourceTypes.appointment && (
					<AppointmentForm
						duration={estimates.duration}
						services={appointment.services}
						location={location}
						employee={employee}
						onAppointmentCreated={handleAppointmentCreated}
					/>
				)} */}

				{step === 2 && !createdAppt && !customer.id && (
					// Should be headed to the review page but they need to login first.
					<AuthView loading={loading} onLogin={customer => setCustomer(customer)} />
				)}
				{createdAppt && (
					<Finished
						isAppointment={state.sourceType === sourceTypes.appointment}
						appointment={createdAppt}
						locationData={location}
						selectedServiceIds={appointment.services}
						selectedServices={state.selectedServices}
					/>
				)}
			</React.Suspense>
		</Wrapper>
	)
}

export default RootContainer
