import React from 'react'
import omit from 'lodash/omit'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { addMinutes } from 'date-fns'
import { useMutation } from '@apollo/react-hooks'
import determineStartTime from './utils/determineStartTime'
import getLastAppointment from './utils/getLastAppointment'
import Review from './Review'

import { sequentialUpsertMutation } from '../../graphql/mutations'
import ServiceSelector from '../../components/ServiceSelector'
import Header from './Header'
import { profileQuery } from '../../graphql/queries'

const AuthView = React.lazy(() => import('../CustomerAuthView'))
const Finished = React.lazy(() => import('./FinishedView'))

const Wrapper = styled('div')`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 0px 10px;

	.button {
		width: 100%;
	}
`

const getAppointmentDuration = (appointment, services) => {
	return appointment.services.reduce((acc, id) => acc + services[id].sources?.[0]?.duration, 0)
}

const RootContainer = ({ profileId, locationId, locationData, employee, history }) => {
	const [createdAppt, setCreatedAppointment] = React.useState(undefined)

	const [estimates, setEstimates] = React.useState({
		lastAppointment: undefined,
		startTime: undefined,
		endTime: undefined
	})

	const [customer, setCustomer] = React.useState({ id: profileId })

	const [appointment, setAppointment] = React.useState({
		locationId,
		userId: employee.id,
		services: []
	})

	const [step, setStep] = React.useState(1)

	const [state, setState] = React.useState({
		loading: false,
		selectedServices: {},
		price: 0,
		services: employee.services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {})
	})

	const [createAppointment, { createAppointmentLoaded }] = useMutation(sequentialUpsertMutation, {
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
		if (createAppointmentLoaded) return

		const { data } = await createAppointment({
			variables: {
				input: appointment
			}
		})

		setStep(3)

		ReactGA.event({
			category: 'OnlineCheckin',
			action: 'Created',
			value: data.checkinOnline.id
		})

		localStorage.setItem('last-appt', JSON.stringify(data.checkinOnline))

		setCreatedAppointment(data.checkinOnline)
	}

	return (
		<Wrapper>
			<Header
				onBack={() => {
					if (step === 1) {
						return history.goBack()
					}

					if (step === 3) {
						return history.push('/')
					}

					setStep(step - 1)
				}}
				loggedIn={!!customer.id}
				step={step}
			/>
			{step === 1 && (
				<ServiceSelector
					services={employee.services}
					onNext={() => setStep(2)}
					selectedServiceIds={appointment.services}
					selectedServices={state.selectedServices}
					price={state.price}
					onSelect={service => {
						setSelectedService(service)
					}}
				/>
			)}

			<React.Suspense fallback={null}>
				{step === 2 && !createdAppt && customer.id && (
					<Review
						price={state.price}
						selectedServices={state.selectedServices}
						selectedServiceIds={appointment.services}
						locationData={locationData}
						estimates={estimates}
						handleConfirm={handleCreate}
					/>
				)}
				{step === 2 && !createdAppt && !customer.id && (
					<AuthView
						onLogin={customer => {
							getEstimates()
							setCustomer(customer)
						}}
					/>
				)}
				{((step === 3 && createdAppt) || createdAppt) && (
					<Finished
						price={state.price}
						estimates={estimates}
						appointment={createdAppt}
						locationData={locationData}
						selectedServiceIds={appointment.services}
						selectedServices={state.selectedServices}
					/>
				)}
			</React.Suspense>
		</Wrapper>
	)
}

export default withRouter(RootContainer)
