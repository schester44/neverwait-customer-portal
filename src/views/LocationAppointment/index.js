import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { produce } from 'immer'
import { startOfDay, endOfDay, addDays, format } from 'date-fns'
import { FaStore } from 'react-icons/fa'
import { Redirect, Link, useParams, generatePath } from 'react-router-dom'
import { useQuery, useMutation, useApolloClient, useLazyQuery } from '@apollo/react-hooks'

import { locationDataQuery, employeeScheduleQuery, profileQuery } from '../../graphql/queries'
import { createProfileAppointmentMutation } from '../../graphql/mutations'
import { appointmentsSubscription } from '../../graphql/subscriptions'

import SchedulerCreator from '../LocationCheckin/utils/ScheduleCreator'
import getAvailableShiftSlots from '../LocationCheckin/utils/getAvailableShiftSlots'
import timeFragments from '../../helpers/timeFragments'
import { LOCATION_OVERVIEW } from '../../routes'

import Loading from '../../components/Loading'
import NavHeader from '../../components/NavHeader'
import ProviderSelector from './ProviderSelector'
import ServiceSelector from './ServiceSelector'
import DateSelector from './DateSelector'
import TimeSelector from './TimeSelector'
import FormFooter from '../../components/FormFooter'
import Button from '../../components/Button'
import SuccessView from './Success'
import { FiLoader } from 'react-icons/fi'

const spin = keyframes`
	from {
		transform: rotate(0);
	}to {
		transform: rotate(360deg);
	}
`

const Container = styled('div')(
	props => css`
		padding-bottom: 120px;

		.loader {
			animation: ${spin} 1s ease infinite;
		}

		.view {
			padding: 14px;

			.form-item {
				margin-bottom: 24px;
			}

			.form-label {
				color: ${props.theme.colors.n450};
				font-size: 16px;
				padding-bottom: 8px;
				font-weight: 600;
			}

			.time-picker {
				margin-top: 8px;
			}
		}
	`
)

const scheduler = new SchedulerCreator()

const LocationAppointment = () => {
	const { uuid } = useParams()

	const startTime = startOfDay(new Date())
	const endTime = endOfDay(new Date())

	const [state, setState] = React.useState({
		createdAppointment: undefined,
		providerServicesById: {},
		selectedServices: [],
		selectedProvider: undefined,
		selectedDate: undefined,
		selectedTime: undefined,
		visibleDates: scheduler.datesFrom(new Date(), 7),
		shiftSlots: [],
		schedule: {
			appointments: [],
			schedule_ranges: []
		}
	})

	const { duration: selectedServicesDuration, price: selectedServicesPrice } = React.useMemo(() => {
		return state.selectedServices.reduce(
			(acc, id) => {
				acc.price += state.providerServicesById[id].price
				acc.duration += state.providerServicesById[id].duration

				return acc
			},
			{ duration: 0, price: 0 }
		)
	}, [state.selectedServices, state.providerServicesById])

	const selectedServicesTime = timeFragments(selectedServicesDuration)

	const setShiftSlots = React.useCallback(
		(schedule, date) => {
			const shiftSlots = getAvailableShiftSlots(schedule, date, selectedServicesDuration)

			setState(prev => ({
				...prev,
				schedule,
				shiftSlots
			}))
		},
		[selectedServicesDuration]
	)

	const queryOptions = React.useMemo(() => {
		return {
			variables: {
				startTime,
				endTime,
				uuid,
				sourceType: 'onlineappointment'
			}
		}
	}, [startTime, endTime, uuid])

	const { data = {}, loading } = useQuery(locationDataQuery, queryOptions)
	const [createProfileAppointment, { loading: createLoading }] = useMutation(
		createProfileAppointmentMutation
	)

	const [fetchSchedule, { data: employeeSchedule, loading: fetchLoading }] = useLazyQuery(
		employeeScheduleQuery,
		{
			onCompleted: data => {
				setShiftSlots(data.employeeSchedule, new Date())
			}
		}
	)

	const client = useApolloClient()
	const location = data.locationByUUID

	// Effect is needed because this component initializes without a locationId to subscribe to and there is no skip property to prevent from subscribing with an empty location
	React.useEffect(() => {
		if (!location) return

		const subscription = client
			.subscribe({
				query: appointmentsSubscription,
				variables: { locationId: location ? location.id : null }
			})
			.subscribe(({ data }) => {
				if (!data.AppointmentsChange?.appointment) return

				const locationData = client.readQuery({ query: locationDataQuery, ...queryOptions })

				const { appointment, employeeId, isNewRecord } = data.AppointmentsChange

				const isDeleted = appointment.status === 'deleted'

				// let apollo handle updates.
				if (!isNewRecord && !isDeleted) return

				const employees = locationData.locationByUUID.employees.map(employee => {
					if (+employeeId !== +employee.id) return employee

					return {
						...employee,
						appointments: isDeleted
							? employee.appointments.filter(appt => appt.id !== appointment.id)
							: employee.appointments.concat([appointment])
					}
				})

				client.writeQuery({
					query: locationDataQuery,
					...queryOptions,
					data: produce(locationData, draftState => {
						draftState.locationByUUID.employees = employees
					})
				})

				try {
					const employeeSchedule = client.readQuery({
						query: employeeScheduleQuery,
						variables: {
							locationId: location.id,
							employeeId,
							input: {
								start_date: startOfDay(new Date()),
								end_date: endOfDay(addDays(new Date(), 7))
							}
						}
					})

					client.writeQuery({
						query: employeeScheduleQuery,
						variables: {
							locationId: location.id,
							employeeId,
							input: {
								start_date: startOfDay(new Date()),
								end_date: endOfDay(addDays(new Date(), 7))
							}
						},
						data: produce(employeeSchedule, draftState => {
							if (isDeleted) {
								draftState.employeeSchedule.appointments.slice(
									draftState.employeeSchedule.appointments.findIndex(
										appt => appt.id === appointment.id
									),
									1
								)
							} else {
								draftState.employeeSchedule.appointments.push(appointment)
							}
						})
					})
				} catch (error) {
					console.error('locationcehckin error', error)
				}
			})

		return () => {
			subscription.unsubscribe()
		}
	}, [location, client, queryOptions])

	React.useEffect(() => {
		if (!location || !state.selectedProvider) return

		fetchSchedule({
			variables: {
				locationId: location.id,
				employeeId: state.selectedProvider.id,
				input: {
					start_date: startOfDay(new Date()),
					end_date: endOfDay(addDays(new Date(), 7))
				}
			}
		})
	}, [fetchSchedule, location, state.selectedProvider])

	React.useEffect(() => {
		if (!state.selectedDate || !employeeSchedule) return

		setState(prev => {
			const shiftSlots = getAvailableShiftSlots(
				employeeSchedule.employeeSchedule,
				prev.selectedDate,
				selectedServicesDuration
			)

			return {
				...prev,
				shiftSlots
			}
		})
	}, [state.selectedProvider, employeeSchedule, selectedServicesDuration, state.selectedDate])

	if (loading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	const handleEmployeeSelection = selectedProvider => {
		const providerServicesById = selectedProvider.services.reduce((acc, service) => {
			const source = service.sources.find(
				source => source.type === 'onlineappointment' || source.type === 'default'
			)

			if (!source) return acc

			acc[service.id] = service

			acc[service.id].price = source.price
			acc[service.id].duration = source.duration

			return acc
		}, {})

		setState(prev => ({
			...prev,
			selectedProvider,
			providerServicesById,
			selectedDate: undefined,
			selectedTime: undefined,
			selectedServices: prev.selectedServices.filter(id => !!providerServicesById[id])
		}))
	}

	const handleDateSelection = selectedDate => {
		setState(prev => ({ ...prev, selectedDate, selectedTime: undefined }))
	}

	const handleTimeSelection = selectedTime => {
		setState(prev => ({ ...prev, selectedTime }))
	}

	const handleConfirm = async () => {
		const { data } = await createProfileAppointment({
			variables: {
				input: {
					locationId: location.id,
					userId: state.selectedProvider.id,
					services: state.selectedServices.map(id => parseInt(id)),
					startTime: state.selectedTime
				}
			},
			update: (proxy, { data }) => {
				if (!data?.createProfileAppointment) return

				const cache = proxy.readQuery({ query: profileQuery, variables: { skip: false } })

				proxy.writeQuery({
					query: profileQuery,
					variables: { skip: false },
					data: produce(cache, draftState => {
						draftState.profile.appointments.upcoming.push(data.createProfileAppointment)
					})
				})
			}
		})

		if (data?.createProfileAppointment) {
			setState(prev => ({ ...prev, createdAppointment: data.createProfileAppointment }))
		}
	}

	return (
		<Container>
			<NavHeader
				actions={[
					<Link to={generatePath(LOCATION_OVERVIEW, { uuid })}>
						<FaStore size="28px" />
					</Link>
				]}
			/>
			<div className="view">
				<h1>Book Appointment</h1>
				<p className="small-sub-text" style={{ fontSize: 16 }}>
					{location.name}
				</p>
				<p style={{ marginBottom: 24 }} className="small-sub-text">
					{location.address}
				</p>

				<div className="form">
					<div className="form-item">
						<p className="form-label">Select Provider</p>
						<ProviderSelector
							providers={location.employees}
							value={state.selectedProvider}
							onSelect={handleEmployeeSelection}
						/>
					</div>

					<div className="form-item">
						<p className="form-label" style={{ opacity: !state.selectedProvider ? 0.3 : 1 }}>
							Select Services
						</p>
						<ServiceSelector
							selectedServicesTime={selectedServicesTime}
							selectedServicesPrice={selectedServicesPrice}
							servicesById={state.providerServicesById}
							value={state.selectedServices}
							isDisabled={!state.selectedProvider}
							services={state.selectedProvider?.services}
							onSelect={service => {
								setState(prev => ({
									...prev,
									selectedServices: prev.selectedServices.includes(service.id)
										? prev.selectedServices.filter(id => id !== service.id)
										: prev.selectedServices.concat([service.id])
								}))
							}}
						/>
					</div>

					<div className="form-item">
						<p
							className="form-label"
							style={{ opacity: state.selectedServices.length === 0 ? 0.3 : 1 }}
						>
							Select Date & Time
						</p>

						{employeeSchedule?.employeeSchedule && (
							<DateSelector
								value={state.selectedDate}
								isDisabled={state.selectedServices.length === 0}
								onSelect={handleDateSelection}
								scheduleRanges={employeeSchedule.employeeSchedule.schedule_ranges || []}
								appointments={employeeSchedule.employeeSchedule.appointments || []}
							/>
						)}

						{state.selectedDate && (
							<div className="time-picker">
								<TimeSelector
									slots={state.shiftSlots}
									value={state.selectedTime}
									onSelect={handleTimeSelection}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{state.selectedTime &&
				(state.createdAppointment ? (
					<SuccessView appointment={state.createdAppointment} />
				) : (
					<FormFooter>
						<div>
							<p
								style={{
									fontSize: 16,
									fontWeight: 700,
									opacity: 1,
									color: 'rgba(253, 241, 227, 1)'
								}}
							>
								${selectedServicesPrice}
							</p>

							<p className="small-sub-text" style={{ opacity: 1, color: 'white' }}>
								{format(state.selectedTime, 'h:mma')} appointment
							</p>

							<p className="small-sub-text" style={{ opacity: 1, color: 'white' }}>
								{format(state.selectedTime, 'dddd, MMMM Do')}
							</p>
						</div>

						<Button
							inverted
							disabled={createLoading || fetchLoading}
							onClick={handleConfirm}
							style={{ width: '50%' }}
						>
							{createLoading ? <FiLoader className="loader" /> : 'Book Now'}
						</Button>
					</FormFooter>
				))}
		</Container>
	)
}

export default LocationAppointment
