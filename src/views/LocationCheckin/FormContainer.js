import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { addMinutes } from 'date-fns'
import { useMutation } from '@apollo/react-hooks'
import omit from 'lodash/omit'
import determineStartTime from './utils/determineStartTime'
import getLastAppointment from './utils/getLastAppointment'
import Review from './Review'

import { sequentialUpsertMutation } from '../../graphql/mutations'
import ServiceSelector from '../../components/ServiceSelector'
import Header from './Header'
import { customerInfoQuery } from '../../graphql/queries'

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

const RootContainer = ({ customerId, locationId, locationData, companyId, employee, history }) => {
	const [createdAppt, setCreatedAppointment] = React.useState(undefined)

	const [estimates, setEstimates] = React.useState({
		lastAppointment: undefined,
		startTime: undefined,
		endTime: undefined
	})

	const [customer, setCustomer] = React.useState({ id: customerId })

	const [appointment, setAppointment] = React.useState({
		locationId,
		userId: employee.id,
		services: []
	})

	const [step, setStep] = React.useState(1)

	const [state, setState] = React.useState({
		loading: false,
		selectedService: undefined,
		services: employee.services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {})
	})

	const [createAppointment] = useMutation(sequentialUpsertMutation, {
		update: (cache, { data: { upsertAppointment } }) => {
			const data = cache.readQuery({
				query: customerInfoQuery
			})

			const appointment = omit(upsertAppointment.appointment, ['employee', 'customer'])

			let customerInfo = data.customerInfo
			customerInfo.appointments.upcoming = [appointment, ...customerInfo.appointments.upcoming]

			cache.writeQuery({
				query: customerInfoQuery,
				data: {
					...data,
					customerInfo
				}
			})
		}
	})

	const setSelectedService = selectedService => {
		setState(prev => ({ ...prev, selectedService }))

		const lastAppointment = getLastAppointment(employee.appointments)
		const startTime = determineStartTime(lastAppointment)

		setEstimates(prev => ({
			...prev,
			startTime,
			endTime: addMinutes(startTime, selectedService.duration || 0),
			duration: selectedService.duration
		}))

		setAppointment(prev => ({ ...prev, services: [selectedService.id] }))
	}

	// Update the estimated wait time when new appointments are made before this one is able to book.
	React.useEffect(() => {
		const lastAppointment = getLastAppointment(employee.appointments)
		const startTime = determineStartTime(lastAppointment)

		setEstimates(prev => {
			if (!prev.startTime) return prev

			return {
				...prev,
				startTime,
				endTime: addMinutes(startTime, prev.duration)
			}
		})
	}, [employee.appointments])

	const getEstimates = async () => {
		// Add up all service durations. We'll use this to calculate the endTime (startTime + duration = endTime)
		const duration = appointment.services.reduce((acc, id) => acc + state.services[id].duration, 0)

		const lastAppointment = getLastAppointment(employee.appointments)
		const startTime = determineStartTime(lastAppointment)

		const endTime = addMinutes(startTime, duration)

		setEstimates({ lastAppointment, startTime, endTime })
	}

	const handleCreate = async () => {
		const { data: appointmentData } = await createAppointment({
			variables: {
				input: {
					...appointment,
					startTime: estimates.startTime,
					endTime: estimates.endTime,
					customerId: customer.id
				}
			}
		})
		setStep(3)

		localStorage.setItem('last-appt', JSON.stringify(appointmentData.upsertAppointment.appointment))

		setCreatedAppointment(appointmentData.upsertAppointment.appointment)
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
					selectedService={state.selectedService ? state.selectedService.id : undefined}
					onSelect={service => {
						setSelectedService(service)
					}}
				/>
			)}

			<React.Suspense fallback={null}>
				{step === 2 && !createdAppt && customer.id && (
					<Review
						selectedService={state.selectedService}
						locationData={locationData}
						estimates={estimates}
						handleConfirm={handleCreate}
					/>
				)}
				{step === 2 && !createdAppt && !customer.id && (
					<AuthView
						companyId={companyId}
						onLogin={customer => {
							getEstimates()
							setCustomer(customer)
						}}
					/>
				)}
				{((step === 3 && createdAppt) || createdAppt) && (
					<Finished appointment={createdAppt} locationData={locationData} selectedService={state.selectedService} />
				)}
			</React.Suspense>
		</Wrapper>
	)
}

export default withRouter(RootContainer)
