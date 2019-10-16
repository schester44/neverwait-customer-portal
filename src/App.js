import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Redirect, Switch, Route, generatePath } from 'react-router-dom'
import styled from 'styled-components'
import ReactGA from 'react-ga'

import Loading from './components/Loading'
import AddToHomeScreen from './components/AddToHomeScreen'

import { profileQuery } from './graphql/queries'
import getCookie from './utils/getCookie'
import {
	LOCATION_WAITLIST,
	AUTH_REGISTER,
	AUTH_LOGIN,
	AUTH_FORGOT_PASSWORD,
	USER_APPOINTMENTS,
	APPOINTMENT_OVERVIEW,
	USER_PREFERENCES,
	LOCATION_SEARCH
} from './routes'

const LoginPage = React.lazy(() => import('./views/Auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./views/Auth/RegisterPage'))
const ForgotPasswordPage = React.lazy(() => import('./views/Auth/ForgotPasswordPage'))

const HomeScreen = React.lazy(() => import('./views/HomeScreen'))
const LocationCheckin = React.lazy(() => import('./views/LocationCheckin'))
const UserSettings = React.lazy(() => import('./views/Settings'))

const Explore = React.lazy(() => import('./views/Explore'))

const Container = styled('div')`
	position: relative;
	margin: 0 auto;
	max-width: 1200px;
`

const App = () => {
	const { data, loading } = useQuery(profileQuery, {
		skip: !getCookie('cusid-access') && !getCookie('cusid-refresh')
	})

	const profile = data && data.profile ? data.profile : undefined

	React.useEffect(() => {
		if (!profile) return

		ReactGA.set({ userId: profile.id })
	}, [profile])

	if (loading) return <Loading />

	return (
		<React.Suspense fallback={<Loading />}>
			<Container>
				<AddToHomeScreen />

				{profile ? (
					<Switch>
						<Route path={LOCATION_WAITLIST}>
							<LocationCheckin profileId={profile.id} />
						</Route>

						<Route path={USER_PREFERENCES}>
							<UserSettings profile={profile} />
						</Route>

						<Route path={['/profile/appointments', APPOINTMENT_OVERVIEW]}>
							<HomeScreen locations={profile.locations} profile={profile} />
						</Route>

						<Route path={LOCATION_SEARCH}>
							<Explore locations={profile.locations} profile={profile} />
						</Route>

						<Redirect to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })} />
					</Switch>
				) : (
					<Switch>
						<Route path={LOCATION_WAITLIST}>
							<LocationCheckin />
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
			</Container>
		</React.Suspense>
	)
}

export default App
