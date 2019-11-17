import React from 'react'
import ReactGA from 'react-ga'
import { produce } from 'immer'
import { Redirect, Link, generatePath, useParams } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { useMutation } from '@apollo/react-hooks'
import { FaStore } from 'react-icons/fa'
import { FiLoader } from 'react-icons/fi'
import { format, addMinutes, startOfDay, endOfDay } from 'date-fns'
import timeFragments from '../../helpers/timeFragments'

import NavHeader from '../../components/NavHeader'
import FormFooter from '../../components/FormFooter'
import Button from '../../components/Button'

import Loading from '../../components/Loading'

import ProviderSelector from './ProviderSelector'
import ServiceSelector from '../LocationAppointment/ServiceSelector'
import useEnhancedLocationSubscription from '../../components/useEnhancedLocationSubscription'
import { LOCATION_OVERVIEW } from '../../routes'

import { profileQuery } from '../../graphql/queries'
import { sequentialUpsertMutation } from '../../graphql/mutations'
import Success from './Success'

const spin = keyframes`
	from {
		transform: rotate(0);
	}to {
		transform: rotate(360deg);
	}
`
const Container = styled('div')(
	props => css`
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
		}
	`
)

const LocationCheckin = () => {
	const { uuid } = useParams()

	const [state, setState] = React.useState({
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

	const { duration: selectedServicesDuration, price: selectedServicesPrice } = React.useMemo(() => {
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

	const selectedServicesTime = timeFragments(selectedServicesDuration)

	if (loading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	const handleEmployeeSelection = selectedProvider => {
		const providerServicesById = selectedProvider.services.reduce((acc, service) => {
			const source = service.sources.find(
				source => source.type === 'onlinecheckin' || source.type === 'default'
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
			selectedServices: prev.selectedServices.filter(id => !!providerServicesById[id])
		}))
	}

	const handleConfirm = async () => {
		if (createLoading) return

		const { data } = await createAppointment({
			variables: {
				input: {
					locationId: location.id,
					userId: state.selectedProvider.id,
					services: state.selectedServices
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
		<Container>
			<NavHeader
				actions={[
					<Link to={generatePath(LOCATION_OVERVIEW, { uuid })}>
						<FaStore size="28px" />
					</Link>
				]}
			/>
			<div className="view">
				<h1>Online Check-in</h1>
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
							uuid={uuid}
							providers={employees}
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
				</div>
			</div>

			{state.createdAppointment && (
				<Success appointment={state.createdAppointment} />
			)}

			{!state.createdAppointment && employee && !isWaitTimeLongEnough && (
				<FormFooter>
					<div>
						<p style={{ textAlign: 'center', color: 'rgba(251, 241, 229, 1.0)' }}>
							This providers wait time is short enough to not need to check in online. You can just
							show up!
						</p>

						<p
							style={{
								opacity: 0.7,
								fontSize: 14,
								lineHeight: 1.2,
								marginTop: 16,
								textAlign: 'center'
							}}
						>
							Act fast! There's no line at the moment but we can't guarantee that there won't be one
							by the time you get to {location.name}.
						</p>
					</div>
				</FormFooter>
			)}

			{!state.createdAppointment && state.isReviewing && (
				<FormFooter>
					<div>
						<div>
							<p style={{ textAlign: 'center', lineHeight: 1.2 }}>
								You are checking in with {employee.firstName} at {location.name}. The estimated time
								of your service is today at
							</p>

							<div
								style={{
									marginTop: 8,
									textAlign: 'center',
									marginBottom: 16,
									fontSize: 26,
									fontWeight: 600,
									color: 'rgba(253, 241, 227, 1)'
								}}
							>
								{format(addMinutes(new Date(), employee.waitTime), 'h:mma')}.
							</div>

							<p
								className="small-sub-text"
								style={{
									marginBottom: 16,
									textAlign: 'center',
									color: 'rgba(249,249,249,1)',
									lineHeight: 1.5
								}}
							>
								The above time has not been secured and is only an estimate. Click Confirm to lock
								in your scheduled time.
							</p>
						</div>
						<Button
							disabled={createLoading}
							style={{ width: '100%' }}
							inverted
							onClick={handleConfirm}
						>
							{createLoading ? <FiLoader className="loader" /> : 'Confirm'}
						</Button>

						<div style={{ textAlign: 'center', marginTop: 16 }}>
							<span onClick={() => setState(prev => ({ ...prev, isReviewing: false }))}>
								Cancel
							</span>
						</div>
					</div>
				</FormFooter>
			)}

			{!state.createdAppointment &&
				isWaitTimeLongEnough &&
				state.selectedServices.length > 0 &&
				!state.isReviewing && (
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

							<p
								className="small-sub-text"
								style={{ opacity: 1, marginTop: 5, lineHeight: 1.2, margin: 0, color: 'white' }}
							>
								estimated service time: <br /> today at{' '}
								<span
									style={{
										color: 'rgba(253, 241, 227, 1)'
									}}
								>
									{format(addMinutes(new Date(), employee.waitTime), 'h:mma')}
								</span>
							</p>
						</div>

						<Button
							inverted
							onClick={() => setState(prev => ({ ...prev, isReviewing: true }))}
							style={{ width: '50%' }}
						>
							Review
						</Button>
					</FormFooter>
				)}
		</Container>
	)
}

export default LocationCheckin
