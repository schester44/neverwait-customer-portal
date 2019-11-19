import React from 'react'
import { produce } from 'immer'
import { startOfDay, endOfDay } from 'date-fns'
import addDays from 'date-fns/add_days'

import { Switch, Route, Redirect, useParams, useRouteMatch } from 'react-router-dom'
import { useQuery, useApolloClient } from '@apollo/react-hooks'

import { locationDataQuery, employeeScheduleQuery } from '../../graphql/queries'
import { appointmentsSubscription } from '../../graphql/subscriptions'
import Loading from '../../components/Loading'

const Overview = React.lazy(() => import('./Overview/LocationOverview'))
const Form = React.lazy(() => import('./FormContainer'))

const LocationCheckin = ({ profileId }) => {
	const { uuid } = useParams()
	const match = useRouteMatch()

	const startTime = startOfDay(new Date())
	const endTime = endOfDay(new Date())

	const { data = {}, loading } = useQuery(locationDataQuery, {
		variables: {
			startTime,
			endTime,
			uuid,
			sourceType: 'onlinecheckin'
		}
	})

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
				if (!data || !data.AppointmentsChange?.appointment) return

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

	if (loading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	return (
		<Switch>
			<Route exact path={match.path}>
				<Overview profileId={profileId} employees={location.employees} location={location} />
			</Route>
			<Route path={`${match.path}/sign-in/:employeeId`}>
				<Form location={location} profileId={profileId} />
			</Route>
			/>
		</Switch>
	)
}

export default LocationCheckin
