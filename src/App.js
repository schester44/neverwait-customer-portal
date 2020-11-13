import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Redirect, Switch, Route, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'

import AddToHomeScreen from './components/AddToHomeScreen'
import MaintenanceMode from './views/MaintenanceMode'
import LoadingScreen from './views/LoadingScreen'

import { profileQuery } from './graphql/queries'

import {
	LOCATION_CHECKIN,
	LOCATION_APPOINTMENT,
	LOCATION_OVERVIEW,
	LOCATION_SEARCH,
	AUTH_REGISTER,
	AUTH_LOGIN,
	AUTH_FORGOT_PASSWORD,
	APPOINTMENT_OVERVIEW,
	USER_PREFERENCES
} from './routes'

const LoginPage = React.lazy(() => import('./views/Auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./views/Auth/RegisterPage'))
const ForgotPasswordPage = React.lazy(() => import('./views/Auth/ForgotPasswordPage'))

const UserAppointments = React.lazy(() => import('./views/HomeScreen/UserAppointments'))
const UserSettings = React.lazy(() => import('./views/Settings'))
const Explore = React.lazy(() => import('./views/Explore'))

const LocationOverview = React.lazy(() => import('./views/LocationOverview'))
const LocationCheckin = React.lazy(() => import('./views/LocationCheckin'))
const LocationAppointment = React.lazy(() => import('./views/LocationAppointment'))

const App = () => {
	const location = useLocation()

	React.useEffect(() => {
		ReactGA.pageview(location.pathname)
	}, [location.pathname])

	const { data, loading } = useQuery(profileQuery, {
		skip: !localStorage.getItem('nw-portal-sess')
	})

	const profile = data && data.profile ? data.profile : undefined

	React.useEffect(() => {
		if (!profile) return

		ReactGA.set({ userId: profile.id })
	}, [profile])

	if (loading) return <LoadingScreen />

	if (process.env.REACT_APP_MAINTENANCE_MODE) {
		return (
			<React.Suspense fallback={<LoadingScreen />}>
				<MaintenanceMode />
			</React.Suspense>
		)
	}

	return (
		<React.Suspense fallback={<LoadingScreen />}>
			<div className="container mx-auto h-full md:border-l md:border-r">
				<AddToHomeScreen />

				{profile ? (
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

						<Redirect to="/profile/appointments" />
					</Switch>
				) : (
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
				)}
			</div>
		</React.Suspense>
	)
}

export default App
