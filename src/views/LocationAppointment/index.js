import React from 'react'
import { produce } from 'immer'
import { startOfDay, endOfDay, addDays } from 'date-fns'
import { Redirect, Link, useParams, generatePath, useHistory } from 'react-router-dom'
import { useQuery, useMutation, useApolloClient, useLazyQuery } from '@apollo/react-hooks'
import { format } from 'date-fns'

import { FaStore } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

import { locationDataQuery, employeeScheduleQuery, profileQuery } from '../../graphql/queries'
import { createProfileAppointmentMutation } from '../../graphql/mutations'
import { appointmentsSubscription } from '../../graphql/subscriptions'

import SchedulerCreator from '../../helpers/ScheduleCreator'
import getAvailableShiftSlots from '../../helpers/getAvailableShiftSlots'
import { LOCATION_OVERVIEW } from '../../routes'

import ProviderSelector from '../../components/ProviderSelector'
import ServiceSelector from '../../components/ServiceSelector'
import Loading from '../LoadingScreen'
import FormFooter from '../../components/FormFooter'
import Button from '../../components/Button'

import DateSelector from './DateSelector'
import TimeSelector from './TimeSelector'

const Review = React.lazy(() => import('./Review'))
const Success = React.lazy(() => import('./Success'))

const renderTitle = ({ step }) => {
	switch (step) {
		case 1:
			return 'Select Provider'
		case 2:
			return 'Select Services'
		case 3:
			return 'Select Date & Time'
		case 4:
			return 'Review'
		default:
			break
	}
}

const scheduler = new SchedulerCreator()

const LocationAppointment = () => {
	const history = useHistory()
	const { uuid } = useParams()

	const startTime = startOfDay(new Date())
	const endTime = endOfDay(addDays(new Date(), 7))

	const [state, setState] = React.useState({
		step: 1,
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

	const { data, loading } = useQuery(locationDataQuery, queryOptions)
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
	const location = data?.locationByUUID

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

				const isDeleted = appointment.status === 'deleted' || appointment.status === 'canceled'

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

	const employee = React.useMemo(
		() =>
			!state.selectedProvider || !location
				? undefined
				: location.employees.find(emp => emp.id === state.selectedProvider.id),
		[state.selectedProvider, location]
	)

	if (loading) return <div>Loading...</div>

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	const handleProviderSelection = selectedProvider => {
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
		setState(prev => {
			const shiftSlots = getAvailableShiftSlots(
				employeeSchedule.employeeSchedule,
				selectedDate,
				selectedServicesDuration
			)

			console.log(selectedServicesDuration)

			return { ...prev, shiftSlots, selectedDate, selectedTime: undefined }
		})
	}

	const handleTimeSelection = selectedTime => {
		setState(prev => ({ ...prev, selectedTime }))
	}

	const handleServiceSelection = service => {
		setState(prev => ({
			...prev,
			selectedServices: prev.selectedServices.includes(service.id)
				? prev.selectedServices.filter(id => id !== service.id)
				: prev.selectedServices.concat([service.id])
		}))
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
		<div>
			{!state.createdAppointment && (
				<div className="px-4 mb-2 bg-gray-900 pb-12">
					<div className="flex justify-between items-center pt-2 pb-4">
						<FiArrowLeft
							className="text-3xl text-gray-100"
							onClick={() => {
								if (state.step === 1) {
									history.goBack()
								} else {
									setState(prev => ({
										...prev,
										step: prev.step - 1,
										selectedDate: prev.step - 1 < 3 ? undefined : prev.selectedDate,
										selectedTime: prev.step - 1 < 3 ? undefined : prev.selectedTime
									}))
								}
							}}
						/>

						<p className="items-center text-gray-100 text-lg font-bold">Appointment</p>

						<Link
							className="text-3xl text-gray-100"
							to={{
								state: {
									from: history.location.pathname
								},
								pathname: generatePath(LOCATION_OVERVIEW, { uuid })
							}}
						>
							<FaStore />
						</Link>
					</div>

					{!state.createdAppointment && (
						<p className="text-sm text-indigo-200 mt-2 leading-snug">Step {state.step} of 4</p>
					)}

					<h1 className="jaf-domus leading-none text-white font-black mb-4 text-3xl">
						{renderTitle({ step: state.step })}
					</h1>
				</div>
			)}

			<div
				className="bg-white px-2 pt-2 -mt-12 overflow-x-hidden"
				style={{ borderTopLeftRadius: 50 }}
			>
				{state.step === 1 && (
					<div className="pb-24">
						<ProviderSelector
							isAppointmentSelector={true}
							providers={location.employees}
							selected={state.selectedProvider?.id}
							onSelect={handleProviderSelection}
						/>
					</div>
				)}

				{state.step === 2 && (
					<div className="pb-24">
						<ServiceSelector
							selected={state.selectedServices}
							services={state.selectedProvider?.services}
							onSelect={handleServiceSelection}
						/>
					</div>
				)}

				{fetchLoading && <Loading />}

				{!fetchLoading &&
					state.step === 3 &&
					(!employeeSchedule?.employeeSchedule ? (
						<div>Loading...</div>
					) : (
						<div className="pb-24">
							<DateSelector
								value={state.selectedDate}
								isDisabled={state.selectedServices.length === 0}
								onSelect={handleDateSelection}
								scheduleRanges={employeeSchedule.employeeSchedule.schedule_ranges || []}
								appointments={employeeSchedule.employeeSchedule.appointments || []}
							/>

							{state.selectedDate && (
								<TimeSelector
									slots={state.shiftSlots}
									value={state.selectedTime}
									onSelect={handleTimeSelection}
								/>
							)}
						</div>
					))}

				{state.step === 4 && !state.createdAppointment && (
					<Review
						selectedServicesPrice={selectedServicesPrice}
						provider={employee}
						selectedTime={state.selectedTime}
						selectedServiceIds={state.selectedServices}
						providerServicesById={state.providerServicesById}
						location={location}
					/>
				)}
			</div>

			{state.createdAppointment && (
				<Success totalPrice={selectedServicesPrice} appointment={state.createdAppointment} />
			)}

			{state.step === 1 && state.selectedProvider && (
				<FormFooter>
					<Button onClick={() => setState(prev => ({ ...prev, step: 2 }))} className="w-full">
						Book Now
					</Button>
				</FormFooter>
			)}

			{state.step === 2 && state.selectedServices.length > 0 && (
				<FormFooter
					action={
						<Button
							className="ml-1 w-full"
							disabled={createLoading}
							onClick={() => {
								setState(prev => ({ ...prev, step: 3 }))
							}}
						>
							Next
						</Button>
					}
				>
					<div>
						<p className="text-gray-600 text-sm leading-tight">
							{state.selectedServices.length} selected
						</p>
						<p className="text-gray-900 text-sm font-black leading-tight">
							${selectedServicesPrice}
						</p>
					</div>
				</FormFooter>
			)}

			{state.step === 3 && state.selectedTime && (
				<FormFooter
					action={
						<Button
							onClick={() => setState(prev => ({ ...prev, step: prev.step + 1 }))}
							className="w-full"
						>
							Next
						</Button>
					}
				>
					<div>
						<p className="text-gray-600 text-sm leading-tight">
							{format(state.selectedTime, 'dddd MMM Do')}
						</p>
						<p className="text-gray-900 text-sm leading-tight">
							at <span className="font-black">{format(state.selectedTime, 'h:mma')}</span>
						</p>
					</div>
				</FormFooter>
			)}

			{state.step === 4 && !state.createdAppointment && (
				<FormFooter
					action={
						<Button className="w-full" onClick={handleConfirm}>
							Confirm
						</Button>
					}
				/>
			)}
		</div>
	)
}

export default LocationAppointment
