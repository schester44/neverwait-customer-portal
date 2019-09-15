import React from 'react'
import { generatePath, Switch, Route, Redirect } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Appointments from './UserAppointments'
import NavFooter from './NavFooter'
import { Header, Overview, NavBar } from './Header'

import isRecentAppointment from '../../utils/isRecentAppointment'
import { USER_APPOINTMENTS, APPOINTMENT_OVERVIEW, USER_DASHBOARD } from '../../routes'

const AppointmentOverview = React.lazy(() => import('./AppointmentOverview'))

const DEFAULT_HEIGHT = 80
const SECONDARY_HEIGHT = 60

const slideUp = keyframes`
	from {
		opacity: 0;
		transform: translateY(0px);
	}

	to {
		opacity: 1;
		transform: translateY(-31px);
	}
`

const fadeIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(10px);

	}

	to {
		opacity: 1;
		transform: translateY(0px);
	}
`

const heightStyles = ({ containerHeight }) =>
	containerHeight === SECONDARY_HEIGHT &&
	css`
		.app-header {
			height: ${SECONDARY_HEIGHT}px;

			.back {
				opacity: 0;
				animation: ${fadeIn} 0.5s 0.2s ease forwards;
			}

			.overview {
				animation: ${slideUp} 0.3s 0.1s ease forwards;
			}

			.title {
				transform: translateY(-50px);
				opacity: 0.5;
				transition: all 0.4s ease;
			}
		}
	`

const themeStyles = ({ theme }) => `
	background: ${theme.colors.bodyBg};
	color: ${theme.colors.bodyColor};
`

const Container = styled('div')`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;

	.title {
		transform: translateY(0px);
		transition: all 0.4s ease;
	}

	div.transition-group {
		position: relative;
		width: 100%;
		height: 100vh;
	}

	${({ containerHeight }) =>
		containerHeight === SECONDARY_HEIGHT
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
		${({ containerHeight }) =>
			containerHeight === SECONDARY_HEIGHT
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

		.overview {
			opacity: 0;
		}
	}

	.view {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding-top: 80px;
		flex: 1;
		padding-bottom: 80px;
		overflow: auto;

		.swipe-container {
			width: 100%;
			height: 100%;
		}
	}

	${heightStyles}
	${themeStyles}
`

const UserHomeScreen = ({ profile, locations, history, routeLocation }) => {
	// TODO: Wont scale as routes are added.
	const height = routeLocation.pathname.indexOf('/appointments') > -1 ? DEFAULT_HEIGHT : SECONDARY_HEIGHT

	const [activeInfo, setInfo] = React.useState({ time: undefined, employee: undefined })

	const onSetTime = React.useCallback((time, employee) => setInfo({ time, employee }), [setInfo])

	const isShowingOverview = height !== DEFAULT_HEIGHT

	return (
		<Container containerHeight={height}>
			<Header title="NeverWait">
				{!isShowingOverview ? (
					<NavBar />
				) : (
					<div className="overview">
						<Overview
							info={activeInfo}
							onBack={() => {
								history.push(generatePath(USER_APPOINTMENTS, { type: history.location?.state?.type || 'upcoming' }))
							}}
						/>
					</div>
				)}
			</Header>

			<TransitionGroup className="transition-group">
				<CSSTransition key={routeLocation.pathname} timeout={{ enter: 300, exit: 200 }} classNames="fade">
					<React.Suspense fallback={null}>
						<div className="view">
							<Switch location={routeLocation}>
								<Route
									path={USER_APPOINTMENTS}
									render={props => {
										const type = props.match.params.type
										const appointments = profile.appointments[type]
										return <Appointments history={props.history} type={type} appointments={appointments} />
									}}
								/>

								<Route
									path={APPOINTMENT_OVERVIEW}
									render={props => {
										if (!profile) return <Redirect to={USER_DASHBOARD} />

										if (props.match.params.id === 'recent') {
											const appointment = JSON.parse(localStorage.getItem('last-appt'))
											const isRecent = isRecentAppointment(appointment)

											if (appointment && isRecent) {
												return (
													<AppointmentOverview
														setTime={onSetTime}
														location={props.location}
														history={props.history}
														appointment={appointment}
													/>
												)
											} else {
												return <Redirect to={USER_DASHBOARD} />
											}
										}

										return (
											<AppointmentOverview
												setTime={onSetTime}
												history={props.history}
												profile={profile}
												appointmentId={props.match.params.id}
											/>
										)
									}}
								/>

								<Redirect to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })} />
							</Switch>
						</div>
					</React.Suspense>
				</CSSTransition>
			</TransitionGroup>
			{!isShowingOverview && (
				<NavFooter disableCheckins={profile.appointments.upcoming.length >= 5} locations={locations} />
			)}
		</Container>
	)
}

export default UserHomeScreen
