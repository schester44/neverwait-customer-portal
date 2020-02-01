import React from 'react'

import { Switch, Route, Redirect } from 'react-router-dom'

import {
	LOCATION_CHECKIN,
	LOCATION_APPOINTMENT,
	LOCATION_OVERVIEW,
	LOCATION_SEARCH,
	APPOINTMENT_OVERVIEW,
	USER_PREFERENCES,
	EMPLOYEE_OVERVIEW
} from './routes'

const UserAppointments = React.lazy(() => import('./views/HomeScreen/UserAppointments'))
const UserSettings = React.lazy(() => import('./views/Settings'))
const Explore = React.lazy(() => import('./views/Explore'))

const LocationOverview = React.lazy(() => import('./views/LocationOverview'))
const LocationCheckin = React.lazy(() => import('./views/LocationCheckin'))
const LocationAppointment = React.lazy(() => import('./views/LocationAppointment'))

const EmployeeOverview = React.lazy(() => import('./views/EmployeeOverview'))

const AuthenticatedRoutes = ({ profile }) => {
	return (
		<Switch>
			<Route path={LOCATION_CHECKIN}>
				<LocationCheckin profileId={profile.id} />
			</Route>

			<Route path={LOCATION_APPOINTMENT}>
				<LocationAppointment profileId={profile.id} />
			</Route>

			<Route path={USER_PREFERENCES}>
				<UserSettings profile={profile} />
			</Route>

			<Route path={['/profile/appointments', APPOINTMENT_OVERVIEW]}>
				<UserAppointments locations={profile.locations} profile={profile} />
			</Route>

			<Route path={LOCATION_SEARCH}>
				<Explore locations={profile.locations} profile={profile} />
			</Route>

			<Route path={LOCATION_OVERVIEW}>
				<LocationOverview />
			</Route>

			<Route path={EMPLOYEE_OVERVIEW}>
				<EmployeeOverview />
			</Route>

			<Redirect to="/profile/appointments" />
		</Switch>
	)
}

export default AuthenticatedRoutes
