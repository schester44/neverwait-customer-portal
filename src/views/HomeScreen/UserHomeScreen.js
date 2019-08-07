import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Appointments from './UserAppointments'
import NavFooter from './NavFooter'
import { Header, Overview, NavBar } from './Header'

import isRecentAppointment from '../../utils/isRecentAppointment'

const AppointmentOverview = React.lazy(() => import('./AppointmentOverview'))

const DEFAULT_HEIGHT = 80
const SECONDARY_HEIGHT = 70

const slideUp = keyframes`
	from {
		transform: translateY(0px);

		h1 {
			opacity: 1;
		}
	}

	to {
		transform: translateY(-31px);

		h1 {
			opacity: 0;
		}
	}
`

const heightStyles = ({ height }) =>
	height === SECONDARY_HEIGHT &&
	css`
		.app-header {
			height: ${SECONDARY_HEIGHT}px;
			border-radius: 0;

			.overview {
				animation: ${slideUp} 0.3s ease forwards;
			}

			.title {
				transform: translateY(-40px);
				opacity: 0.5;
				transition: all 0.4s ease;
			}
		}
	`

const Container = styled('div')`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;
	background: rgba(242, 242, 242, 1);
	color: rgba(26, 30, 32, 1);

	.title {
		transform: translateY(0px);
		transition: all 0.4s ease;
	}

	div.transition-group {
		position: relative;
	}

	${({ height }) =>
		height === SECONDARY_HEIGHT
			? css`
					.fade-enter {
						opacity: 0;
					}

					.fade-enter.fade-enter-active {
						opacity: 1;
					}
			  `
			: css`
					.fade-enter {
						transform: translateX(-100vw);
					}

					.fade-enter.fade-enter-active {
						transform: translateX(0px);
						transition: all 0.3s ease;
					}
			  `}

	.fade-exit {
		opacity: 1;
		transform: translateX(0px);
	}

	.fade-exit.fade-exit-active {
		${({ height }) =>
			height === SECONDARY_HEIGHT
				? css`
						opacity: 0;
				  `
				: css`
						transform: translateX(100vw);
				  `}
		transition: all 0.3s ease;
	}

	.app-header {
		transition: all 0.3s ease;
		height: ${DEFAULT_HEIGHT}px;
	}

	.view {
		position: absolute;
		top: 80px;
		left: 0;
		width: 100%;
		flex: 1;
		padding-bottom: 50px;
	}

	${heightStyles}
`

const UserHomeScreen = ({ user, locations, routeLocation, match }) => {
	const height = routeLocation.pathname.indexOf('/appointments') > -1 ? DEFAULT_HEIGHT : SECONDARY_HEIGHT

	const [time, setTime] = React.useState(undefined)

	return (
		<Container height={height}>
			<Header title="NeverWait">
				{height === DEFAULT_HEIGHT ? (
					<NavBar />
				) : (
					<div className="overview">
						<Overview start={time} />
					</div>
				)}
			</Header>

			<TransitionGroup className="transition-group">
				<CSSTransition key={routeLocation.pathname} timeout={{ enter: 300, exit: 200 }} classNames="fade">
					<React.Suspense fallback={null}>
						<div className="view">
							<Switch location={routeLocation}>
								<Route
									path="/appointments/:type"
									render={props => {
										const type = props.match.params.type
										const appointments = user.appointments[type]
										return <Appointments type={type} appointments={appointments} />
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
												return (
													<AppointmentOverview setTime={setTime} history={props.history} appointment={appointment} />
												)
											} else {
												return <Redirect to="/" />
											}
										}

										return (
											<AppointmentOverview
												setTime={setTime}
												history={props.history}
												user={user}
												appointmentId={props.match.params.id}
											/>
										)
									}}
								/>

								<Redirect to="/appointments/upcoming" />
							</Switch>
						</div>
					</React.Suspense>
				</CSSTransition>
			</TransitionGroup>
			<NavFooter locations={locations} />
		</Container>
	)
}

export default UserHomeScreen
