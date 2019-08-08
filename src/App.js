import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { withRouter, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
import Loading from './components/Loading'

import { customerInfoQuery } from './graphql/queries'
import getCookie from './utils/getCookie'

const LoginPage = React.lazy(() => import('./views/Auth/LoginPage'))
const HomeScreen = React.lazy(() => import('./views/HomeScreen'))
const LocationCheckin = React.lazy(() => import('./views/LocationCheckin'))

const Container = styled('div')`
	position: relative;
	margin: 0 auto;
	max-width: 1200px;
	min-height: 100%;
`

const App = () => {
	const { data, loading } = useQuery(customerInfoQuery, {
		skip: !getCookie('cusid-access')
	})

	const user = data && data.customerInfo ? data.customerInfo : undefined

	if (loading) return <Loading />

	return (
		<React.Suspense fallback={<Loading />}>
			<Container>
				<Switch>
					<Route
						path="/book/l/:id"
						render={props => {
							return (
								<LocationCheckin
									customerId={user ? user.id : undefined}
									id={props.match.params.id}
									match={props.match}
								/>
							)
						}}
					/>

					<Route
						render={props => {
							if (!user) {
								return <LoginPage />
							}

							return (
								<HomeScreen
									routeLocation={props.location}
									history={props.history}
									locations={data.locations}
									user={user}
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
