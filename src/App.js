import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Loading from './components/Loading'

import isRecentAppointment from './utils/isRecentAppointment'
import getCookie from './utils/getCookie'
import CustomerAuthView from './views/CustomerAuthView'
import { customerInfoQuery } from './graphql/queries'

const Placeholder = React.lazy(() => import('./views/Placeholder'))
const HomeScreen = React.lazy(() => import('./views/HomeScreen'))
const AppointmentOverview = React.lazy(() => import('./views/RecentAppointmentOverview'))
const LocationCheckin = React.lazy(() => import('./views/LocationCheckin'))

const Container = styled('div')`
	position: relative;
	max-width: 900px;
	margin: 0 auto;
	height: 100%;

	@media (min-width: 768px) {
		border-left: 1px solid rgba(38, 43, 49, 1);
		border-right: 1px solid rgba(38, 43, 49, 1);
	}
`

const App = () => {
	const { data, loading, error, refetch } = useQuery(customerInfoQuery, {
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
						path="/appointment/:id"
						render={props => {
							if (!user) return <Redirect to="/" />

							if (props.match.params.id === 'recent') {
								const appointment = JSON.parse(localStorage.getItem('last-appt'))
								const isRecent = isRecentAppointment(appointment)

								if (appointment && isRecent) {
									return <AppointmentOverview history={props.history} appointment={appointment} />
								} else {
									return <Redirect to="/" />
								}
							}

							return <AppointmentOverview history={props.history} user={user} appointmentId={props.match.params.id} />
						}}
					/>
					<Route
						render={props => {
							if (!user) {
								return (
									<div style={{ padding: 10, fontSize: 14 }}>
										<CustomerAuthView
											onLogin={async () => {
												await refetch({ skip: false })
												window.location.reload()
											}}
										/>
									</div>
								)
							}

							return <HomeScreen locations={data.locations} user={user} />
						}}
					/>
				</Switch>
			</Container>
		</React.Suspense>
	)
}

export default withRouter(App)
