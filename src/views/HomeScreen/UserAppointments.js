import React from 'react'
import { generatePath, Switch, Route, Redirect, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Appointments from './UserAppointmentList'

import NavFooter from '../../components/NavFooter'
import NavBar from './NavBar'

import { USER_APPOINTMENTS, APPOINTMENT_OVERVIEW } from '../../routes'

const AppointmentOverview = React.lazy(() => import('../AppointmentOverview'))

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

	.transition-group {
		flex: 1;
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

	.swipe-container {
		-webkit-overflow-scrolling: touch;
	}

	${overviewStyles};
`

const UserHomeScreen = ({ profile }) => {
	const location = useLocation()

	const isShowingOverview = location.pathname.indexOf('/appointments') === -1
	const isShowingPast = location.pathname.indexOf('/past') !== -1

	return (
		<Container isShowingPast={isShowingPast} isShowingOverview={isShowingOverview}>
			{!isShowingOverview && (
				<div className="bg-white border-b border-gray-200">
					<h1 className="jaf-domus text-center mt-2">NEVERWAIT</h1>
					<NavBar />
				</div>
			)}

			<TransitionGroup className="transition-group">
				<CSSTransition
					key={location.pathname}
					timeout={{ enter: 300, exit: 200 }}
					classNames="fade"
				>
					<React.Suspense fallback={null}>
						<Switch location={location}>
							<Route path={USER_APPOINTMENTS}>
								<Appointments profileAppointments={profile.appointments || {}} />
							</Route>

							<Route path={APPOINTMENT_OVERVIEW}>
								<AppointmentOverview profile={profile} />
							</Route>

							<Redirect to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })} />
						</Switch>
					</React.Suspense>
				</CSSTransition>
			</TransitionGroup>

			<NavFooter highlightCheckin={true} />
		</Container>
	)
}

export default UserHomeScreen
