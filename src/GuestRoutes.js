import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'

import {
	LOCATION_CHECKIN,
	LOCATION_APPOINTMENT,
	LOCATION_OVERVIEW,
	AUTH_REGISTER,
	AUTH_LOGIN,
	AUTH_FORGOT_PASSWORD,
	EMPLOYEE_OVERVIEW
} from './routes'

const LoginPage = React.lazy(() => import('./views/Auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./views/Auth/RegisterPage'))
const ForgotPasswordPage = React.lazy(() => import('./views/Auth/ForgotPasswordPage'))
const LocationOverview = React.lazy(() => import('./views/LocationOverview'))
const EmployeeOverview = React.lazy(() => import('./views/EmployeeOverview'))

const GuestRoutes = () => {
	return (
		<Switch>
			<Route path={LOCATION_CHECKIN}>
				<LoginPage action={LOCATION_CHECKIN} isAttemptingAction={true} />
			</Route>

			<Route path={LOCATION_APPOINTMENT}>
				<LoginPage action={LOCATION_APPOINTMENT} isAttemptingAction={true} />
			</Route>

			<Route path={LOCATION_OVERVIEW}>
				<LocationOverview />
			</Route>

			<Route path={EMPLOYEE_OVERVIEW}>
				<EmployeeOverview />
			</Route>

			<Route path={AUTH_REGISTER}>
				<RegisterPage />
			</Route>

			<Route path={AUTH_LOGIN}>
				<LoginPage />
			</Route>

			<Route path={AUTH_FORGOT_PASSWORD}>
				<ForgotPasswordPage />
			</Route>

			<Redirect to={AUTH_LOGIN} />
		</Switch>
	)
}

export default GuestRoutes
