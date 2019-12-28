import React from 'react'
import ReactGA from 'react-ga'
import { produce } from 'immer'
import { Redirect, Link, generatePath, useParams, useHistory, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { FaStore } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'
import { format, isAfter, addMinutes, startOfDay, endOfDay, isWithinRange } from 'date-fns'

import pling from '../../components/Pling'
import FormFooter from '../../components/FormFooter'
import Button from '../../components/Button'
import NavFooter from '../../components/NavFooter'
import ProviderSelector from '../../components/ProviderSelector'
import ServiceSelector from '../../components/ServiceSelector'
import LoadingScreen from '../LoadingScreen'

import useEnhancedLocationSubscription from '../../components/useEnhancedLocationSubscription'
import { LOCATION_OVERVIEW } from '../../routes'

import { profileQuery } from '../../graphql/queries'
import { sequentialUpsertMutation } from '../../graphql/mutations'
import Success from '../LocationAppointment/Success'
import Review from './Review'
import { dateFromTimeString } from '../../helpers/date-from'

const renderTitle = ({ step, isFinished }) => {
	if (isFinished) return null

	switch (step) {
		case 1:
			return 'Select Provider'
		case 2:
			return 'Select Services'
		case 3:
			return 'Review'
		default:
			break
	}
}

const LocationCheckin = () => {
	const { uuid } = useParams()
	const history = useHistory()
	const routerLocation = useLocation()

	React.useEffect(() => {
		ReactGA.pageview(routerLocation.pathname + routerLocation.search)
	}, [routerLocation])

	const [state, setState] = React.useState({
		step: 1,
		isReviewing: false,
		createdAppointment: undefined,
		providerServicesById: {},
		selectedServices: [],
		selectedProvider: undefined
	})

	const queryOptions = React.useMemo(() => {
		return {
			uuid,
			sourceType: 'onlinecheckin',
			startTime: startOfDay(new Date()),
			endTime: endOfDay(new Date())
		}
	}, [uuid])

	const { employees, location, loading } = useEnhancedLocationSubscription({
		queryOptions
	})

	const employee = React.useMemo(
		() =>
			!state.selectedProvider
				? undefined
				: employees.find(emp => emp.id === state.selectedProvider.id),
		[state.selectedProvider, employees]
	)

	const { price: selectedServicesPrice } = React.useMemo(() => {
		return state.selectedServices.reduce(
			(acc, id) => {
				acc.price += parseInt(state.providerServicesById[id].price)
				acc.duration += parseInt(state.providerServicesById[id].duration)

				return acc
			},
			{ duration: 0, price: 0 }
		)
	}, [state.selectedServices, state.providerServicesById])

	const [createAppointment, { loading: createLoading }] = useMutation(sequentialUpsertMutation, {
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

	const closedDate = React.useMemo(() => {
		if (!location) return

		return location.closed_dates.find(date =>
			isWithinRange(new Date(), startOfDay(date.start_date), endOfDay(date.end_date))
		)
	}, [location])

	const isClosedToday = !!closedDate

	if (loading) return <LoadingScreen />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	const handleProviderSelection = selectedProvider => {
		if (!selectedProvider.isSchedulable) {
			if (state.selectedProvider && selectedProvider.id !== state.selectedProvider) {
				setState(prev => ({ ...prev, selectedProvider: undefined }))
			}

			return
		}

		const providerServicesById = selectedProvider.services.reduce((acc, service) => {
			const source = service.sources.find(
				source => source.type === 'onlinecheckin' || source.type === 'default'
			)

			if (!source) return acc

			acc[service.id] = service

			// Get the correct price / duration of the services
			acc[service.id].price = source.price
			acc[service.id].duration = source.duration

			return acc
		}, {})

		setState(prev => ({
			...prev,
			step: 2,
			selectedProvider,
			providerServicesById,
			selectedServices: prev.selectedServices.filter(id => !!providerServicesById[id])
		}))
	}

	const handleServiceSelection = service => {
		const selectedServices = state.selectedServices.includes(service.id)
			? state.selectedServices.filter(id => id !== service.id)
			: state.selectedServices.concat(service.id)

		const duration = selectedServices.reduce(
			(acc, id) => acc + parseInt(state.providerServicesById[id].duration, 10),
			0
		)

		if (
			isAfter(
				addMinutes(employee.firstAvailableTime, duration),
				dateFromTimeString(employee.currentShift.end_time)
			)
		) {
			// FIXME: if it exceeds the current shift, does the value fall within nextAvailableShifts.onlineCheckins? if so, then we can still select services since the staff works.

			pling({
				message: `The provider's work day is almost over. This service item cannot be selected.`
			})
			return
		}

		setState(prev => ({
			...prev,
			selectedServices
		}))
	}

	const handleSubmit = async () => {
		if (createLoading) return

		const { data } = await createAppointment({
			variables: {
				input: {
					locationId: location.id,
					userId: state.selectedProvider.id,
					services: state.selectedServices.map(id => parseInt(id))
				}
			}
		})

		setState(prev => ({ ...prev, createdAppointment: data.checkinOnline }))

		ReactGA.event({
			category: 'OnlineCheckin',
			action: 'Created',
			value: Number(data.checkinOnline.id)
		})
	}

	const isWaitTimeLongEnough = employee?.waitTime > 20

	return (
		<div>
			{!state.createdAppointment && (
				<div className="bg-gray-900 px-4 mb-2 px-4 pb-12">
					<div className="flex justify-between items-center pt-2 pb-4">
						<FiArrowLeft
							className="text-3xl text-gray-100"
							onClick={() => {
								if (state.step === 1) {
									history.goBack()
								} else {
									setState(prev => ({ ...prev, step: prev.step - 1 }))
								}
							}}
						/>

						<p className="text-lg font-bold text-center text-gray-100">Online Check-in</p>

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
						<p className="text-sm text-indigo-200 mt-2 leading-snug">
							Step {isWaitTimeLongEnough ? state.step : 1} of 3
						</p>
					)}

					<h1 className="jaf-domus leading-none text-white font-black mb-4 text-3xl">
						{renderTitle({
							step: isWaitTimeLongEnough ? state.step : 1,
							isFinished: !!state.createdAppointment
						})}
					</h1>
				</div>
			)}

			{!state.createdAppointment && (
				<div
					className="view -mt-12 bg-white pt-2 overflow-x-hidden"
					style={{ borderTopLeftRadius: 35 }}
				>
					{isClosedToday && (
						<>
							<p className="text-lg text-center mt-12">
								This location is closed today. ({closedDate.description})
							</p>
							<NavFooter />
						</>
					)}

					{(state.step === 1 || !isWaitTimeLongEnough) && !isClosedToday && (
						<ProviderSelector
							providers={employees}
							selected={state.selectedProvider}
							onSelect={handleProviderSelection}
						/>
					)}
					{isWaitTimeLongEnough && state.step === 2 && (
						<ServiceSelector
							selected={state.selectedServices}
							services={state.selectedProvider?.services}
							onSelect={handleServiceSelection}
						/>
					)}

					{isWaitTimeLongEnough && state.step === 3 && !state.createdAppointment && (
						<Review
							selectedServicesPrice={selectedServicesPrice}
							services={state.selectedServices.map(id => state.providerServicesById[id])}
							provider={employee}
							location={location}
						/>
					)}
				</div>
			)}

			{state.createdAppointment && (
				<Success
					totalPrice={selectedServicesPrice}
					type="checkin"
					appointment={state.createdAppointment}
				/>
			)}

			{!state.createdAppointment && employee && !isWaitTimeLongEnough && (
				<FormFooter>
					<div className="py-12">
						<p className="text-center text-xl font-bold">
							No need to check in with {state.selectedProvider.firstName} right now. You can just
							show up!
						</p>

						<p className="text-sm text-gray-600 text-center my-8">
							Act fast! There's no line at the moment but we can't guarantee that there won't be one
							by the time you get to {location.name}.
						</p>

						<Button
							onClick={() => {
								setState(prev => ({
									...prev,
									step: 1,
									selectedProvider: undefined,
									providerServicesById: undefined,
									selectedServices: []
								}))
							}}
						>
							Close
						</Button>
					</div>
				</FormFooter>
			)}

			{!state.createdAppointment && isWaitTimeLongEnough && state.selectedServices.length > 0 && (
				<FormFooter
					action={
						<Button
							disabled={createLoading}
							onClick={() => {
								if (state.step === 3) {
									handleSubmit()
								} else {
									setState(prev => ({ ...prev, step: 3 }))
								}
							}}
							style={{ marginLeft: state.step === 3 ? 0 : 10, width: '100%' }}
						>
							{state.step === 3 ? (createLoading ? 'Loading...' : 'Confirm') : 'Next'}
						</Button>
					}
				>
					{state.step !== 3 && (
						<div>
							<p className="font-bold leading-tight">${selectedServicesPrice}</p>

							<p className="text-sm text-gray-600 leading-tight">
								today at {format(addMinutes(new Date(), employee.waitTime + 3), 'h:mma')}
							</p>
						</div>
					)}
				</FormFooter>
			)}
		</div>
	)
}

export default LocationCheckin
