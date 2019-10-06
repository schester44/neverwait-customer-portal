import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Redirect, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import Loading from './components/Loading'
import AddToHomeScreen from './components/AddToHomeScreen'

import { profileQuery } from './graphql/queries'
import getCookie from './utils/getCookie'
import { LOCATION_WAITLIST, AUTH_REGISTER, AUTH_LOGIN, AUTH_FORGOT_PASSWORD, USER_DASHBOARD } from './routes'
import ReactGA from 'react-ga'

const LoginPage = React.lazy(() => import('./views/Auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./views/Auth/RegisterPage'))
const ForgotPasswordPage = React.lazy(() => import('./views/Auth/ForgotPasswordPage'))

const HomeScreen = React.lazy(() => import('./views/HomeScreen'))
const LocationCheckin = React.lazy(() => import('./views/LocationCheckin'))

const Container = styled('div')`
	position: relative;
	margin: 0 auto;
	max-width: 1200px;
	height: 100vh;
	overflow-y: scroll;
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

	console.log(profile)

	return (
		<React.Suspense fallback={<Loading />}>
			<Container>
				<AddToHomeScreen />

				{profile ? (
					<Switch>
						<Route path={LOCATION_WAITLIST}>
							<LocationCheckin profileId={profile?.id} />
						</Route>

						<Route path={USER_DASHBOARD}>
							<HomeScreen locations={data.locations} profile={profile} />
						</Route>
						<Redirect to={USER_DASHBOARD} />
					</Switch>
				) : (
					<Switch>
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
