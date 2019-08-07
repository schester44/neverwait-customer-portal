import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { startOfDay, endOfDay } from 'date-fns'

import { locationDataQuery } from '../../graphql/queries'
import { appointmentsSubscription } from '../../graphql/subscriptions'
import Loading from '../../components/Loading'

const HomeScreen = React.lazy(() => import('./HomeScreen'))
const Form = React.lazy(() => import('./FormContainer'))

const debug = require('debug')('app')

const LocationCheckin = ({ match, id, customerId }) => {
	const queryOptions = {
		variables: { startTime: startOfDay(new Date()), endTime: endOfDay(new Date()), locationId: id }
	}

	const { data = {}, loading } = useQuery(locationDataQuery, queryOptions)

	const location = data.locationByUUID

	useSubscription(appointmentsSubscription, {
		document: appointmentsSubscription,
		skip: !location,
		variables: { locationId: location ? location.id : null },

		onSubscriptionData: ({ client, subscriptionData }) => {
			const queryData = client.readQuery({
				query: locationDataQuery,
				...queryOptions
			})

			if (!subscriptionData.data || !subscriptionData.data.AppointmentsChange) return

			const { appointment, employeeId } = subscriptionData.data.AppointmentsChange

			const employee = queryData.locationByUUID.employees.find(emp => +emp.id === +employeeId)

			if (!employee) {
				debug('appointment changes but no employee with the id', employeeId)
				return false
			}

			const appointmentsById = employee.appointments.reduce((acc, curr) => {
				acc[curr.id] = curr
				return acc
			}, {})

			const appointments = appointmentsById[appointment.id]
				? employee.appointments.map(app => (+app.id === +appointment.id ? appointment : app))
				: [...employee.appointments, appointment]

			const employees = queryData.locationByUUID.employees.map(employee => {
				return +employee.id === +employeeId
					? {
							...employee,
							appointments
					  }
					: employee
			})

			debug('employee data updated')

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
		}
	})

	if (loading) return <Loading />

	// TODO: This redirects when there is a network error.
	if (!loading && !location) return <Redirect to="/" />

	return (
		<div style={{ background: 'white', minHeight: '100vh' }}>
			<Switch>
				<Route
					exact
					path={match.path}
					render={props => {
						const employees = location.employees.filter(emp => emp.services.length > 0)
						return (
							<HomeScreen
								history={props.history}
								customerId={customerId}
								locationName={location.name}
								employees={employees}
								location={location}
							/>
						)
					}}
				/>

				<Route
					path={`${match.path}/sign-in/:employeeId`}
					render={props => {
						const employee = location.employees.find(emp => +emp.id === +props.match.params.employeeId)
						return (
							<Form
								match={props.match}
								locationId={location.id}
								locationData={location}
								companyId={location.company.id}
								customerId={customerId}
								employee={employee}
							/>
						)
					}}
				/>
			</Switch>
		</div>
	)
}

export default LocationCheckin
