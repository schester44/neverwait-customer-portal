import React from 'react'
import { produce } from 'immer'
import { startOfDay, endOfDay, addDays, isEqual } from 'date-fns'
import { Redirect, Link, useParams, generatePath, useHistory } from 'react-router-dom'
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks'
import { format } from 'date-fns'
import memoize from 'memoize-one'
import { FaStore } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

import { employeeScheduleQuery, profileQuery, locationSettingsQuery } from '../../graphql/queries'
import { createProfileAppointmentMutation } from '../../graphql/mutations'

import getAvailableShiftSlots from '../../helpers/getAvailableShiftSlots'
import { LOCATION_OVERVIEW } from '../../routes'

import ProviderSelector from '../../components/ProviderSelector'
import ServiceSelector from '../../components/ServiceSelector'
import Loading from '../LoadingScreen'
import FormFooter from '../../components/FormFooter'
import Button from '../../components/Button'
import useEnhancedLocationSubscription from '../../hooks/useEnhancedLocationSubscription'
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
			return 'Review & Confirm'
		default:
			break
	}
}

const _memoizedGetAvailableShiftSlots = memoize(getAvailableShiftSlots)

const LocationAppointment = () => {
	const history = useHistory()
	const { uuid } = useParams()

	const scrollRef = React.useRef()

	const [state, setState] = React.useState({
		step: 1,
		createdAppointment: undefined,
		providerServicesById: {},
		selectedServices: [],
		selectedProvider: undefined,
		selectedDate: undefined,
		selectedTime: undefined,
		customerNote: '',
		shiftSlots: [],
		schedule: {
			appointments: [],
			schedule_ranges: [],
		},
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

	const {
		data: { locationByUUID: { settings: locationSettings } = {} } = {},
		loading: locationSettingsLoading,
	} = useQuery(locationSettingsQuery, { variables: { uuid } })

	const queryOptions = React.useMemo(() => {
		if (!locationSettings) return

		return {
			startTime: startOfDay(new Date()),
			endTime: endOfDay(
				addDays(new Date(), locationSettings.onlineBooking?.advanceBookingMaxDays || 0)
			),
			uuid,
			sourceType: 'onlineappointment',
		}
	}, [uuid, locationSettings])

	const { employees, location, loading } = useEnhancedLocationSubscription({
		skip: !locationSettings,
		queryOptions,
		employeeScheduleEndDateOffset: locationSettings?.onlineBooking?.advanceBookingMaxDays || 0,
		computeEmployeeAvailability: false,
	})

	const [createProfileAppointment, { loading: createLoading }] = useMutation(
		createProfileAppointmentMutation
	)

	const [fetchSchedule, { data: employeeSchedule, loading: fetchLoading }] = useLazyQuery(
		employeeScheduleQuery,
		{
			onCompleted: (data) => {
				setShiftSlots(data.employeeSchedule, state.selectedDate || new Date())
			},
		}
	)

	const setShiftSlots = React.useCallback(
		(schedule, date) => {
			const shiftSlots = _memoizedGetAvailableShiftSlots(
				schedule,
				date,
				selectedServicesDuration,
				locationSettings.onlineBooking.timeSlotInterval
			)

			const slotStillExists = !state.selectedTime
				? false
				: shiftSlots.find((shift) => isEqual(shift.start_time, state.selectedTime))

			setState((prev) => ({
				...prev,
				schedule,
				shiftSlots,
				// If the slot doesn't exist then its possible the user had selected the time slot but then someone else booked it. so we should clear out that slot since its no longer available.
				selectedTime: slotStillExists ? prev.selectedTime : undefined,
			}))
		},
		[selectedServicesDuration, state.selectedTime, locationSettings]
	)

	const locationId = location?.id

	React.useEffect(() => {
		if (!locationId || !state.selectedProvider) return

		// Grab the providers schedule if the provider changes
		fetchSchedule({
			variables: {
				locationId: locationId,
				employeeId: state.selectedProvider.id,
				input: {
					start_date: startOfDay(new Date()),
					end_date: endOfDay(addDays(new Date(), 7)),
				},
			},
		})
	}, [fetchSchedule, locationId, state.selectedProvider])

	const employee = React.useMemo(
		() =>
			!state.selectedProvider || !employees
				? undefined
				: employees.find((emp) => emp.id === state.selectedProvider.id),
		[state.selectedProvider, employees]
	)

	React.useEffect(() => {
		if (!employeeSchedule || !state.selectedDate) return

		// Anytime our selected provider's schedule changes, re-compute the available slots
		setShiftSlots(employeeSchedule.employeeSchedule, state.selectedDate)
	}, [employeeSchedule, setShiftSlots, state.selectedDate])

	if (loading || locationSettingsLoading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !locationSettingsLoading && !location) return <Redirect to="/" />

	const handleProviderSelection = (selectedProvider) => {
		const providerServicesById = selectedProvider.services.reduce((acc, service) => {
			const source = service.sources.find(
				(source) => source.type === 'onlineappointment' || source.type === 'default'
			)

			if (!source) return acc

			acc[service.id] = service

			acc[service.id].price = source.price
			acc[service.id].duration = source.duration

			return acc
		}, {})

		setState((prev) => ({
			...prev,
			selectedProvider,
			providerServicesById,
			selectedDate: undefined,
			selectedTime: undefined,
			selectedServices: prev.selectedServices.filter((id) => !!providerServicesById[id]),
		}))
	}

	const handleDateSelection = (selectedDate) => {
		setState((prev) => {
			return { ...prev, selectedDate, selectedTime: undefined }
		})
	}

	const handleTimeSelection = (selectedTime) => {
		setState((prev) => ({ ...prev, selectedTime }))
	}

	const handleServiceSelection = (service) => {
		setState((prev) => ({
			...prev,
			selectedServices: prev.selectedServices.includes(service.id)
				? prev.selectedServices.filter((id) => id !== service.id)
				: prev.selectedServices.concat([service.id]),
		}))
	}

	const handleConfirm = async () => {
		const { data } = await createProfileAppointment({
			variables: {
				input: {
					locationId: location.id,
					userId: state.selectedProvider.id,
					services: state.selectedServices.map((id) => parseInt(id)),
					startTime: state.selectedTime,
					customerNote: state.customerNote,
				},
			},
			update: (proxy, { data }) => {
				if (!data?.createProfileAppointment) return

				const cache = proxy.readQuery({ query: profileQuery, variables: { skip: false } })

				proxy.writeQuery({
					query: profileQuery,
					variables: { skip: false },
					data: produce(cache, (draftState) => {
						draftState.profile.appointments.upcoming.push(data.createProfileAppointment)
					}),
				})
			},
		})

		if (data?.createProfileAppointment) {
			setState((prev) => ({ ...prev, createdAppointment: data.createProfileAppointment }))
		}
	}

	return (
		<div className="h-full flex flex-col">
			{!state.createdAppointment && (
				<div className="mb-2 bg-gray-900 p-4">
					<div className="flex justify-between items-center pt-2">
						<FiArrowLeft
							className="text-3xl text-gray-100"
							onClick={() => {
								if (state.step === 1) {
									history.goBack()
								} else {
									scrollRef.current.scrollTop = 0

									setState((prev) => ({
										...prev,
										step: prev.step - 1,
										selectedDate: prev.step - 1 < 3 ? undefined : prev.selectedDate,
										selectedTime: prev.step - 1 < 3 ? undefined : prev.selectedTime,
									}))
								}
							}}
						/>

						<p className="items-center text-gray-100 text-lg font-bold">Appointment</p>

						<Link
							className="text-3xl text-gray-100"
							to={{
								state: {
									from: history.location.pathname,
								},
								pathname: generatePath(LOCATION_OVERVIEW, { uuid }),
							}}
						>
							<FaStore />
						</Link>
					</div>

					{!state.createdAppointment && (
						<p className="text-sm text-indigo-200 mt-2 leading-snug">Step {state.step} of 4</p>
					)}

					<h1 className="jaf-domus leading-none text-white font-black text-3xl">
						{renderTitle({ step: state.step })}
					</h1>
				</div>
			)}

			{!state.createdAppointment && (
				<div
					ref={scrollRef}
					className="bg-white px-2 pt-2 overflow-x-hidden flex-1 overflow-y-auto"
				>
					{state.step === 1 && (
						<div className="pb-24">
							<ProviderSelector
								isAppointmentSelector={true}
								providers={employees}
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
							<Loading />
						) : (
							<div className="pb-24">
								<DateSelector
									maxDays={locationSettings?.onlineBooking?.advanceBookingMaxDays}
									value={state.selectedDate}
									isDisabled={state.selectedServices.length === 0}
									onSelect={handleDateSelection}
									closedDates={location?.closed_dates}
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

					{state.step === 4 && (
						<Review
							selectedServicesPrice={selectedServicesPrice}
							provider={employee}
							selectedTime={state.selectedTime}
							selectedServiceIds={state.selectedServices}
							providerServicesById={state.providerServicesById}
							location={location}
							customerNote={state.customerNote}
							setCustomerNote={(customerNote) => setState((prev) => ({ ...prev, customerNote }))}
						/>
					)}
				</div>
			)}
			{state.createdAppointment && (
				<Success totalPrice={selectedServicesPrice} appointment={state.createdAppointment} />
			)}
			{state.step === 1 && state.selectedProvider && (
				<FormFooter>
					<Button onClick={() => setState((prev) => ({ ...prev, step: 2 }))} className="w-full">
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
								setState((prev) => ({ ...prev, step: 3 }))
								scrollRef.current.scrollTop = 0
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
							onClick={() => {
								setState((prev) => ({ ...prev, step: prev.step + 1 }))
								scrollRef.current.scrollTop = 0
							}}
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
