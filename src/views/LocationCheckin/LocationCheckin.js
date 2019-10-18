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
import { dateFromMinutes } from './Employee/utils/isWorking'

const Overview = React.lazy(() => import('./Overview/LocationOverview'))
const Form = React.lazy(() => import('./FormContainer'))
const ClosedPlaceholder = React.lazy(() => import('./ClosedPlaceholder'))

const LocationCheckin = ({ profileId }) => {
	const { uuid } = useParams()
	const match = useRouteMatch()

	const startTime = startOfDay(new Date())
	const endTime = endOfDay(new Date())

	const queryOptions = React.useMemo(() => {
		return {
			variables: {
				startDate: format(startTime, 'YYYY-MM-DD'),
				endDate: format(endTime, 'YYYY-MM-DD'),
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
				const queryData = client.readQuery({ query: locationDataQuery, ...queryOptions })

				if (!data || !data.AppointmentsChange) return

				const { appointment, employeeId, isNewRecord } = data.AppointmentsChange

				const isDeleted = appointment?.deleted

				// let apollo handle updates.
				if (!isNewRecord && !isDeleted) return

				const employees = queryData.locationByUUID.employees.map(employee => {
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
					data: {
						...queryData,
						locationByUUID: {
							...queryData.locationByUUID,
							employees
						}
					}
				})
			})

		return () => subscription.unsubscribe()
	}, [location, client, queryOptions])

	if (loading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	// if (isClosed) {
	// 	return <ClosedPlaceholder showBackButton={!!profileId} location={location} reason={isClosed.description} />
	// }

	return (
		<>
			<Switch>
				<Route
					exact
					path={match.path}
					render={props => {
						const employees = location.employees.filter(employee => {
							if (employee.services.length === 0) return false

							return true
						})
						return (
							<Overview
								isClosed={isClosed}
								history={props.history}
								profileId={profileId}
								employees={employees}
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
			{/* <NavFooter hideCheckin={true} animate={false} /> */}
		</>
	)
}

export default LocationCheckin
