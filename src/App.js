import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { generatePath, Redirect, withRouter, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import Loading from './components/Loading'
import AddToHomeScreen from './components/AddToHomeScreen'

import { profileQuery } from './graphql/queries'
import getCookie from './utils/getCookie'
import { __DEPRECATED_LOCATION_WAITLIST, LOCATION_WAITLIST, AUTH_REGISTER } from './routes'
import ReactGA from 'react-ga'

const LoginPage = React.lazy(() => import('./views/Auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./views/Auth/RegisterPage'))
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

	return (
		<React.Suspense fallback={<Loading />}>
			<Container>
				<AddToHomeScreen />
				<Switch>
					<Route
						path={AUTH_REGISTER}
						render={props => {
							if (profile) return <Redirect to="/" />

							return <RegisterPage history={props.history} />
						}}
					/>

					<Route
						path={LOCATION_WAITLIST}
						render={props => {
							ReactGA.pageview(props.location.pathname)
							return <LocationCheckin profileId={profile?.id} uuid={props.match.params.uuid} match={props.match} />
						}}
					/>

					<Route
						path={__DEPRECATED_LOCATION_WAITLIST}
						render={props => {
							const path = generatePath(LOCATION_WAITLIST, props.match.params)
							ReactGA.pageview(path)

							return <Redirect to={path} />
						}}
					/>

					<Route
						render={props => {
							if (!profile) {
								ReactGA.pageview('/login-screen')

								return <LoginPage />
							}

							ReactGA.pageview('/home-screen')

							return (
								<HomeScreen
									routeLocation={props.location}
									history={props.history}
									locations={data.locations}
									profile={profile}
								/>
							)
						}}
					/>
				</Switch>
			</Container>
		</React.Suspense>
	)
}

export default withRouter(App)
