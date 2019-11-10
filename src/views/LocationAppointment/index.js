import React from 'react'
import styled, { css } from 'styled-components'
import { produce } from 'immer'
import { startOfDay, endOfDay, addDays } from 'date-fns'

import { Redirect, useParams, useRouteMatch } from 'react-router-dom'
import { useQuery, useApolloClient, useLazyQuery } from '@apollo/react-hooks'

import SchedulerCreator from '../LocationCheckin/utils/ScheduleCreator'

import getAvailableShiftSlots from '../LocationCheckin/utils/getAvailableShiftSlots'

import timeFragments from '../../helpers/timeFragments'
import { locationDataQuery, employeeScheduleQuery } from '../../graphql/queries'
import { appointmentsSubscription } from '../../graphql/subscriptions'
import Loading from '../../components/Loading'
import NavHeader from '../../components/NavHeader'
import ProviderSelector from './ProviderSelector'
import ServiceSelector from './ServiceSelector'
import DateSelector from './DateSelector'
import TimeSelector from './TimeSelector'

const Container = styled('div')(
	props => css`
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

const LocationAppointment = ({ profileId }) => {
	const { uuid } = useParams()
	const match = useRouteMatch()

	const startTime = startOfDay(new Date())
	const endTime = endOfDay(new Date())

	const [state, setState] = React.useState({
		providerServicesById: {},
		selectedServices: [],
		selectedProvider: undefined,
		selectedDate: undefined,
		selectedTime: undefined,
		visibleDates: scheduler.datesFrom(new Date(), 30),
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
			if (!state.selectedProvider) return

			const shiftSlots = getAvailableShiftSlots(
				{
					appointments: state.selectedProvider.appointments,
					schedule_ranges: state.selectedProvider.schedule_ranges
				},
				date,
				selectedServicesDuration
			)
			const isWorkingOnSelectedDay = shiftSlots.length > 0

			setState(prev => ({
				...prev,
				schedule,
				shiftSlots,
				isWorkingOnSelectedDay,
				selectedDate: isWorkingOnSelectedDay ? new Date() : undefined
			}))
		},
		[selectedServicesDuration, state.selectedProvider]
	)

	const [fetchSchedule, { called, data: employeeSchedule, loading: fetchLoading }] = useLazyQuery(
		employeeScheduleQuery,
		{
			onCompleted: data => {
				setShiftSlots(data.employeeSchedule, new Date())
			}
		}
	)

	const queryOptions = React.useMemo(() => {
		return {
			variables: {
				startTime,
				endTime,
				uuid
			}
		}
	}, [startTime, endTime, uuid])

	const { data = {}, loading } = useQuery(locationDataQuery, queryOptions)
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
				if (!data || !data.AppointmentsChange) return

				const locationData = client.readQuery({ query: locationDataQuery, ...queryOptions })

				const { appointment, employeeId, isNewRecord } = data.AppointmentsChange

				const isDeleted = appointment?.deleted

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
								end_date: endOfDay(addDays(new Date(), 30))
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
								end_date: endOfDay(addDays(new Date(), 30))
							}
						},
						data: produce(employeeSchedule, draftState => {
							if (isDeleted) {
								draftState.employeeSchedule.appointments.slice(
									draftState.employeeSchedule.appointments.findIndex(appt => appt.id === appointment.id),
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
					end_date: endOfDay(addDays(new Date(), 30))
				}
			}
		})
	}, [fetchSchedule, location, state.selectedProvider])

	React.useEffect(() => {
		if (!state.selectedDate) return

		console.log('setting shift slots')

		setState(prev => {
			const schedule = {
				appointments: state.selectedProvider.appointments,
				schedule_ranges: state.selectedProvider.schedule_ranges
			}

			const shiftSlots = getAvailableShiftSlots(schedule, state.selectedDate, selectedServicesDuration)

			return {
				...prev,
				selectedDate: state.selectedDate,
				shiftSlots,
				isWorkingOnSelectedDay: shiftSlots.length > 0,
				selectedTime: undefined
			}
		})
	}, [state.selectedProvider, employeeSchedule, selectedServicesDuration, state.selectedDate])

	if (loading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	const handleEmployeeSelection = selectedProvider => {
		const providerServicesById = selectedProvider.services.reduce((acc, service) => {
			const source = service.sources.find(source => source.type === 'onlineappointment' || source.type === 'default')

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
			selectedServices: prev.selectedServices.filter(id => !!providerServicesById[id])
		}))
	}

	const handleDateSelection = selectedDate => {
		setState(prev => ({ ...prev, selectedDate, selectedTime: undefined }))
	}

	const handleTimeSelection = selectedTime => {
		setState(prev => ({ ...prev, selectedTime }))
	}

	return (
		<Container>
			<NavHeader />
			<div className="view">
				<h1>{location.name}</h1>
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
						<p className="form-label" style={{ opacity: state.selectedServices.length === 0 ? 0.3 : 1 }}>
							Select Date & Time
						</p>

						<DateSelector
							value={state.selectedDate}
							isDisabled={state.selectedServices.length === 0}
							onSelect={handleDateSelection}
							scheduleRanges={state.selectedProvider?.schedule_ranges || []}
							appointments={state.selectedProvider?.appointments || []}
						/>

						{state.selectedDate && (
							<div className="time-picker">
								<TimeSelector slots={state.shiftSlots} value={state.selectedTime} onSelect={handleTimeSelection} />
							</div>
						)}
					</div>
				</div>
			</div>
		</Container>
	)
}

export default LocationAppointment
