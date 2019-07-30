import React from 'react'
import styled from 'styled-components'
import { withRouter, Link } from 'react-router-dom'
import { addMinutes } from 'date-fns'
import { useMutation, useApolloClient } from 'react-apollo-hooks'
import { searchCustomers } from '../../graphql/queries'

import ServiceSelector from '../../components/ServiceSelector'
import Input from '../../components/Input'
import Button from '../../components/Button'
import determineStartTime from './utils/determineStartTime'
import getLastAppointment from './utils/getLastAppointment'
import Overview from './Overview'

import { sequentialUpsertMutation, findOrCreateCustomerMutation } from '../../graphql/mutations'

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

const Content = styled('div')`
	position: relative;
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	padding-top: 25px;

	h1 {
		font-weight: 100;
		font-size: 16px;
		line-height: 1;
	}
`

const Header = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	a {
		text-decoration: none !important;
	}

	h1 {
		padding-top: 20px;
		font-family: marguerite;
		font-size: 32px;
		color: rgba(242, 209, 116, 1);
	}
`

const ActiveCustomer = styled('div')`
	width: 100%;
	text-align: center;
	font-size: 18px;
	color: white;
	padding-top: 25px;
	padding-bottom: 20px;
`

const RootContainer = ({ locationId, employee, history }) => {
	const client = useApolloClient()

	const [createdAppt, setCreatedAppointment] = React.useState(undefined)

	const [estimates, setEstimates] = React.useState({
		lastAppointment: undefined,
		startTime: undefined,
		endTime: undefined
	})

	const [customer, setCustomer] = React.useState({
		firstName: '',
		lastName: '',
		contactNumber: ''
	})

	const [appointment, setAppointment] = React.useState({
		locationId,
		userId: employee.id,
		services: []
	})

	const [step, setStep] = React.useState(1)

	const [state, setState] = React.useState({
		loading: false,
		selectedService: undefined,
		activeCustomer: undefined,
		services: employee.services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {})
	})

	const [createAppointment] = useMutation(sequentialUpsertMutation)
	const [getCustomer] = useMutation(findOrCreateCustomerMutation)

	const setLoading = loading => setState(prev => ({ ...prev, loading }))
	const setActiveCustomer = activeCustomer => setState(prev => ({ ...prev, activeCustomer }))

	// Update the estimated wait time when new appointments are made before this one is able to book.
	React.useEffect(() => {
		if (estimates.startTime) {
			const lastAppointment = getLastAppointment(employee.appointments)
			const startTime = determineStartTime(lastAppointment)

			setEstimates(prev => ({
				...prev,
				startTime,
				endTime: addMinutes(startTime, prev.duration)
			}))
		}
	}, [employee.appointments, estimates.startTime])

	React.useEffect(() => {
		if (!customer.contactNumber || customer.contactNumber.length < 10) {
			if (state.activeCustomer) {
				setActiveCustomer(undefined)
			}

			if (state.selectedService) {
				setState(prevState => ({ ...prevState, selectedService: undefined }))
			}

			return
		}

		client
			.query({
				query: searchCustomers,
				variables: {
					input: {
						term: customer.contactNumber
					}
				}
			})
			.then(({ data: { searchCustomers } }) => {
				if (searchCustomers && searchCustomers.length > 0) {
					let activeCustomer = searchCustomers[searchCustomers.length - 1]
					setActiveCustomer(activeCustomer)

					// Set the selected service to the last service this person has booked
					if (activeCustomer.appointments.past.length > 0) {
						const service = activeCustomer.appointments.past[0].services[0]

						if (service) {
							setState(prevState => ({ ...prevState, selectedService: service.id }))
							setAppointment(prev => ({ ...prev, services: [service.id] }))
						}
					}
				}
			})
	}, [customer.contactNumber])

	const btnDisabled = customer.contactNumber.length < 10 || !state.selectedService || state.loading

	const handleSubmit = async () => {
		// Add up all service durations. We'll use this to calculate the endTime (startTime + duration = endTime)
		const duration = appointment.services.reduce((acc, id) => acc + state.services[id].duration, 0)

		const lastAppointment = getLastAppointment(employee.appointments)
		const startTime = determineStartTime(lastAppointment)
		const endTime = addMinutes(startTime, duration)

		setEstimates({ lastAppointment, startTime, endTime })

		if (step === 1) {
			return setStep(2)
		}

		setLoading(true)

		try {
			let customerId = (state.activeCustomer || {}).id

			if (!customerId) {
				const { data } = await getCustomer({
					variables: {
						input: { ...customer, acceptsMarketing: 1, appointmentNotifications: 'sms' }
					}
				})

				customerId = data.findOrCreateCustomer.customer.id
			}

			const { data: appointmentData } = await createAppointment({
				variables: {
					input: {
						...appointment,
						startTime,
						endTime,
						customerId
					}
				}
			})

			setLoading(false)
			setCreatedAppointment(appointmentData.upsertAppointment.appointment)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	return (
		<Wrapper>
			<Header>
				<Link to="/">
					<h1>Lorenzo's</h1>
				</Link>
			</Header>

			{step === 1 && (
				<Content>
					<h1>1. ENTER YOUR INFO</h1>
					<div className="form-input">
						<Input
							placeholder="Phone Number"
							type="number"
							pattern="\d*"
							name="contactNumber"
							value={customer.contactNumber}
							onChange={({ target: { value } }) => {
								setCustomer(prev => ({ ...prev, contactNumber: value }))
							}}
						/>
					</div>

					{!state.activeCustomer && (
						<div className="form-input" style={{ display: 'flex' }}>
							<Input
								placeholder="First Name"
								type="text"
								name="firstName"
								style={{ marginRight: 10 }}
								value={customer.firstName}
								onChange={({ target: { value } }) => {
									setCustomer(prev => ({ ...prev, firstName: value }))
								}}
							/>

							<Input
								placeholder="Last Name"
								type="text"
								name="lastName"
								value={customer.lastName}
								onChange={({ target: { value } }) => {
									setCustomer(prev => ({ ...prev, lastName: value }))
								}}
							/>
						</div>
					)}
					{state.activeCustomer && <ActiveCustomer>Welcome back, {state.activeCustomer.firstName}!</ActiveCustomer>}
					<h1 style={{ marginTop: 35 }}>2. SELECT A SERVICE</h1>

					<ServiceSelector
						services={employee.services}
						selectedService={state.selectedService}
						onSelect={({ id }) => {
							setState(prev => ({ ...prev, selectedService: id }))
							setAppointment(prev => ({ ...prev, services: [id] }))
						}}
					/>
				</Content>
			)}

			{(step === 2 && !createdAppt) && <Overview estimates={estimates} />}
			{(step === 3 || createdAppt) && <Finished appointment={createdAppt} />}

			{!createdAppt && (
				<div className="button">
					<Button onClick={handleSubmit} disabled={btnDisabled}>
						{state.overviewVisible
							? 'Confirm'
							: btnDisabled
							? state.isSubmitting
								? 'Submitting'
								: customer.contactNumber.length < 10
								? 'Enter valid phone number'
								: !state.selectedService
								? 'Select a service'
								: 'Form incomplete'
							: 'Check In'}
					</Button>
				</div>
			)}
		</Wrapper>
	)
}

export default withRouter(RootContainer)
