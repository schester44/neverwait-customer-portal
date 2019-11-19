import React from 'react'

import { Switch, Route, Redirect, useParams, useRouteMatch } from 'react-router-dom'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { locationDataQuery } from '../../graphql/queries'
import { appointmentsSubscription } from '../../graphql/subscriptions'
import Loading from '../../components/Loading'
import format from 'date-fns/format'
import isWithinRange from 'date-fns/is_within_range'
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'
import isAfter from 'date-fns/is_after'
import addDays from 'date-fns/add_days'
import { dateFromMinutes } from './Employee/utils/isWorking'
import { employeeScheduleQuery } from './AppointmentForm/queries'
import { produce } from 'immer'

const Overview = React.lazy(() => import('./Overview/LocationOverview'))
const Form = React.lazy(() => import('./FormContainer'))

const LocationCheckin = ({ profileId }) => {
	const { uuid } = useParams()
	const match = useRouteMatch()

	const startTime = startOfDay(new Date())
	const endTime = endOfDay(new Date())

	const queryOptions = React.useMemo(() => {
		return {
			variables: {
				startTime,
				endTime,
				uuid
			}
		}
	}, [startTime, endTime, uuid])

	// TODO: We really don't care about the Location's appointments until the Review page
	// TODO: the only thing we care about is employee wait time and any employee/location changes (need to subscribe to ScheduleChange events)
	const { data = {}, loading } = useQuery(locationDataQuery, queryOptions)
	const client = useApolloClient()
	const location = data.locationByUUID

	const isClosed = React.useMemo(() => {
		if (!location) return false

		const today = new Date()
		const todaysName = format(today, 'dddd').toLowerCase()

		const closedDate = location.closed_dates.find(range => {
			return isWithinRange(today, startOfDay(range.start_date), endOfDay(range.end_date))
		})

		if (closedDate) return closedDate

		if (!location.working_hours[todaysName] || !location.working_hours[todaysName].open) return true

		return isAfter(new Date(), dateFromMinutes(location.working_hours[todaysName].endTime))
	}, [location])

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

				const isDeleted = appointment?.deleted || appointment.status === 'deleted'

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

	if (loading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	return (
		<>
			<Switch>
				<Route
					exact
					path={match.path}
					render={props => {
						return (
							<Overview
								isClosed={isClosed}
								history={props.history}
								profileId={profileId}
								employees={location.employees}
								location={location}
							/>
						)
					}}
				/>
				<Route path={`${match.path}/sign-in/:employeeId`}>
					<Form location={location} profileId={profileId} />
				</Route>
				/>
			</Switch>
		</>
	)
}

export default LocationCheckin
