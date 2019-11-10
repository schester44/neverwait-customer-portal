import React from 'react'
import { generatePath, Switch, Route, Redirect, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Appointments from './UserAppointmentList'
import NavFooter from './NavFooter'
import { Header, NavBar } from './Header'

import { USER_APPOINTMENTS, APPOINTMENT_OVERVIEW } from '../../routes'

const AppointmentOverview = React.lazy(() => import('./AppointmentOverview'))

const DEFAULT_HEIGHT = 95

const themeStyles = ({ theme }) => `
	background: ${theme.colors.bodyBg};
	color: ${theme.colors.bodyColor};
`

const overviewStyles = ({ isShowingOverview }) =>
	isShowingOverview &&
	css`
		.view {
			padding-top: 0;
			padding-bottom: 0;
		}

		.fade-enter {
			transform: translateY(0);
		}

		.fade-enter.fade-enter-active {
			transform: translateY(0px);
			transition: none;
		}

		.fade-exit {
			opacity: 0;
		}

		.fade-exit.fade-exit-active {
			opacity: 0;
		}
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
		height: calc(100vh - 95px);
	}

	.fade-enter {
		transform: translateX(${({ isShowingPast }) => (isShowingPast ? '100vw' : '-100vw')});
	}

	.fade-enter.fade-enter-active {
		transform: translateX(0px);
		transition: all 0.3s ease;
	}

	.fade-exit {
		opacity: 1;
		transform: translateX(0);
	}

	.fade-exit.fade-exit-active {
		transition: all 0.3s ease;
		opacity: 0;
		transform: translateX(${({ isShowingPast }) => (isShowingPast ? '-100vw' : '100vw')});
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
		flex: 1;
		padding-bottom: 73px;

		.swipe-container {
			width: 100%;
			height: 100%;
			overflow: auto;
		}
	}

	${themeStyles};
	${overviewStyles};
`

const UserHomeScreen = ({ profile }) => {
	const location = useLocation()

	const isShowingOverview = location.pathname.indexOf('/appointments') === -1
	const isShowingPast = location.pathname.indexOf('/past') !== -1

	return (
		<Container isShowingPast={isShowingPast} isShowingOverview={isShowingOverview}>
			{!isShowingOverview && (
				<Header title="NEVERWAIT">
					<NavBar />
				</Header>
			)}

			<TransitionGroup className="transition-group">
				<CSSTransition key={location.pathname} timeout={{ enter: 300, exit: 200 }} classNames="fade">
					<React.Suspense fallback={null}>
						<div className="view">
							<Switch location={location}>
								<Route path={USER_APPOINTMENTS}>
									<Appointments profileAppointments={profile.appointments || {}} />
								</Route>

								<Route path={APPOINTMENT_OVERVIEW}>
									<AppointmentOverview profile={profile} />
								</Route>

								<Redirect to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })} />
							</Switch>
						</div>
					</React.Suspense>
				</CSSTransition>
			</TransitionGroup>

			<NavFooter highlightCheckin={true} animate={location?.state?.returningFromOverview} />
		</Container>
	)
}

export default UserHomeScreen
