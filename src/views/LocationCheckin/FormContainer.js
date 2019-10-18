import React from 'react'
import omit from 'lodash/omit'
import ReactGA from 'react-ga'
import styled, { keyframes } from 'styled-components'
import { useHistory, useParams, Redirect } from 'react-router-dom'
import { addMinutes, isAfter } from 'date-fns'
import { useMutation } from '@apollo/react-hooks'
import determineStartTime from './utils/determineStartTime'
import getLastAppointment from './utils/getLastAppointment'
import Review from './Review'

import { sequentialUpsertMutation } from '../../graphql/mutations'
import ServiceSelector from '../../components/ServiceSelector'
import Header from './Header'
import { profileQuery } from '../../graphql/queries'
import { dateFromTimeString } from './Employee/utils/isWorking'
import pling from '../../components/Pling'
import SourceTypeSelection from './SourceTypeSelection'
import AppointmentForm from './AppointmentForm'
const AuthView = React.lazy(() => import('../CustomerAuthView'))
const Finished = React.lazy(() => import('./FinishedView'))

const expandAnimation = keyframes`
	from { 
		transform: translateY(-50px);
	} to {
		transform: translateY(0px);
	}
`

const Wrapper = styled('div')`
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 0px 10px;
	padding-top: 160px;
	transform: translateY(-50px);
	animation: ${expandAnimation} 0.2s ease forwards;

	.button {
		width: 100%;
	}
`

const getAppointmentDuration = (appointment, services) => {
	return appointment.services.reduce((acc, id) => acc + services[id].sources?.[0]?.duration, 0)
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

	const [createdAppt, setCreatedAppointment] = React.useState(undefined)

	const [employee] = React.useState(location.employees.find(({ id }) => Number(id) === Number(employeeId)))

	const [estimates, setEstimates] = React.useState({
		lastAppointment: undefined,
		startTime: undefined,
		endTime: undefined
	})

	const [customer, setCustomer] = React.useState({ id: profileId })

	const [appointment, setAppointment] = React.useState({
		locationId: location.id,
		userId: employee.id,
		services: []
	})

	const [step, setStep] = React.useState(1)

	const [state, setState] = React.useState({
		selectedServices: {},
		sourceType: undefined,
		price: 0,
		services: employee.services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {})
	})

	const [createAppointment, { loading }] = useMutation(sequentialUpsertMutation, {
		update: (cache, { data: { checkinOnline } }) => {
			const data = cache.readQuery({
				query: profileQuery
			})

			let profile = data.profile
			profile.appointments.upcoming = [checkinOnline, ...profile.appointments.upcoming]

			cache.writeQuery({
				query: profileQuery,
				data: {
					...data,
					profile
				}
			})
		}
	})

	const setSelectedService = service => {
		const isAdding = !state.selectedServices[service.id]

		const servicePrice = service.sources && service.sources[0] ? service.sources[0].price : 0

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

		const duration = services.reduce((acc, id) => {
			const service = state.services[id]

			// This shouldnt happen
			if (!service.sources || service.sources.length === 0) return acc

			// assume the first service is the correct service
			return acc + service.sources[0].duration
		}, 0)

		const lastAppointment = getLastAppointment(employee.appointments, duration)
		const startTime = determineStartTime(lastAppointment)

		setEstimates(prev => ({
			...prev,
			startTime,
			duration,
			endTime: addMinutes(startTime, duration || 0)
		}))

		setAppointment(prev => ({ ...prev, services }))
	}

	// Update the estimated wait time when new appointments are made before this one is able to book.
	React.useEffect(() => {
		setEstimates(prev => {
			if (!prev.startTime) return prev

			const lastAppointment = getLastAppointment(employee.appointments, prev.duration)
			const startTime = determineStartTime(lastAppointment)

			return {
				...prev,
				startTime,
				endTime: addMinutes(startTime, prev.duration)
			}
		})
	}, [employee.appointments])

	const getEstimates = async () => {
		const duration = getAppointmentDuration(appointment, state.services)
		const lastAppointment = getLastAppointment(employee.appointments, duration)
		const startTime = determineStartTime(lastAppointment)

		const endTime = addMinutes(startTime, duration)

		setEstimates({ lastAppointment, startTime, endTime })
	}

	const handleCreate = async () => {
		if (loading) return

		setSubmitting(true)

		const { data } = await createAppointment({
			variables: {
				input: appointment
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
		setStep(3)
		setCreatedAppointment(appointment)

		ReactGA.event({
			category: 'OnlineAppointment',
			action: 'Created',
			value: Number(appointment.id)
		})

		localStorage.setItem('last-appt', JSON.stringify(appointment))
	}

	if (!employee) return <Redirect to="/" />

	return (
		<Wrapper>
			{(step !== 2 || state.sourceType) && (
				<Header
					isAppointment={state.sourceType === sourceTypes.appointment}
					stepModifier={state.sourceType === sourceTypes.checkin ? 1 : 0}
					onBack={() => {
						if (step === 1) {
							return history.goBack()
						}

						if (step === 3) {
							return history.push('/')
						}

						if (step === 2) {
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
						if (history.location.state?.status) {
							// check service durations against employee end time
							const shiftEndTime = dateFromTimeString(history.location.state?.status?.currentShift.end_time, new Date())

							console.log(shiftEndTime)

							// if (isAfter(estimates.endTime, shiftEndTime)) {
							// 	pling({ message: `Selected service duration exceeds ${employee.firstName}'s work hours.` })
							// 	return false
							// }
						}
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
						onSelectCheckin={() => setState(prev => ({ ...prev, sourceType: sourceTypes.checkin }))}
						onSelectAppointment={() => setState(prev => ({ ...prev, sourceType: sourceTypes.appointment }))}
					/>
				)}

				{step === 2 && !createdAppt && customer.id && state.sourceType == sourceTypes.checkin && (
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

				{step === 2 && !createdAppt && customer.id && state.sourceType === sourceTypes.appointment && (
					<AppointmentForm
						services={appointment.services}
						location={location}
						employee={employee}
						onAppointmentCreated={handleAppointmentCreated}
					/>
				)}

				{step === 2 && !createdAppt && !customer.id && (
					// Should be headed to the review page but they need to login first.
					<AuthView
						loading={loading}
						onLogin={customer => {
							getEstimates()
							setCustomer(customer)
						}}
					/>
				)}
				{createdAppt && (
					<Finished
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
