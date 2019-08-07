import React from 'react'
import { NavLink, Switch, Route, Redirect } from 'react-router-dom'
import styled from 'styled-components'

import Appointments from './UserAppointments'
import NavFooter from './NavFooter'

const Container = styled('div')`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;
	background: rgba(242, 242, 242, 1);
	color: rgba(26, 30, 32, 1);

	@media (min-width: 900px) {
		.header {
			max-width: 898px;
			margin-left: calc(50% - 449px);
		}
	}

	.view {
		height: 100vh;
		flex: 1;
		padding-top: 100px;
		padding-bottom: 50px;
	}

	.header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100px;
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: 0px 3px 10px rgba(26, 30, 32, 0.05);

		background: white;
		color: rgba(26, 30, 32, 1);
		padding-top: 10px;
		text-align: center;

		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 25px;

		h1 {
			font-size: 18px;
			line-height: 1.5;
		}

		h4 {
			opacity: 0.4;
		}
	}
`

const Menu = styled('div')`
	list-style: none;
	display: flex;
	justify-content: space-around;

	a {
		text-decoration: none;
		color: inherit;

		&.active > div {
			opacity: 1;
			border-bottom: 3px solid rgba(237, 209, 129, 1);
		}
	}
`

Menu.Item = styled('div')`
	height: 100%;
	padding: 10px 20px;
	cursor: pointer;
	opacity: 0.8;
	border-bottom: 3px solid transparent;
`

const UserHomeScreen = ({ user, locations }) => {
	return (
		<Container>
			<div className="header">
				<div className="name">
					<h1>NeverWait</h1>
				</div>

				<Menu>
					<NavLink to="/appointments/upcoming">
						<Menu.Item>Upcoming</Menu.Item>
					</NavLink>

					<NavLink to="/appointments/past">
						<Menu.Item>Past</Menu.Item>
					</NavLink>
				</Menu>
			</div>

			<div className="view">
				<React.Suspense fallback={null}>
					<Switch>
						<Route
							path="/appointments/:type"
							render={props => {
								const appointments = user.appointments[props.match.params.type]
								return <Appointments type={props.match.params.type} appointments={appointments} />
							}}
						/>

						<Redirect to="/appointments/upcoming" />
					</Switch>
				</React.Suspense>
			</div>
			<NavFooter locations={locations} />
		</Container>
	)
}

export default UserHomeScreen
