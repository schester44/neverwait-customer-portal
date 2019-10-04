import React from 'react'
import styled from 'styled-components'
import { generatePath, Link, useParams, useHistory } from 'react-router-dom'
import Swipe from 'react-easy-swipe'
import format from 'date-fns/format'

import { USER_APPOINTMENTS, APPOINTMENT_OVERVIEW } from '../../routes'

const Container = styled('div')`
	padding: 16px 10px;
	height: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-content: flex-start;

	a {
		display: block;
		width: 100%;

		@media (min-width: 640px) and (max-width: 768px) {
			width: calc(50% - 10px);
			margin: 10px 5px;
		}

		@media (min-width: 768px) {
			width: calc(33% - 10px);
			margin: 10px 5px;
		}
	}
`

const appointmentThemeStyles = ({ theme }) => `
	background: ${theme.colors.headerBg};
	color: ${theme.colors.headerColor};
	border-radius: ${theme.borderRadius.medium};
	box-shadow: 0px 4px 3px ${theme.colors.shadow};

	.time {
		h4 {
			color: ${theme.colors.s500}
		}
	}
`

const Appointment = styled('div')`
	width: 100%;

	margin-bottom: 10px;
	padding: 15px;
	font-size: 14px;

	.time {
		display: flex;
		align-items: center;
		justify-content: space-between;

		h4 {
			margin-right: 8px;
			font-size: 18px;
		}
	}

	.location {
		margin-top: 8px;
	}

	.details {
		margin-top: 8px;

		ul {
			list-style: none;
			display: flex;
			align-items: center;
			justify-content: space-between;

			li {
				display: inline;
			}
		}
	}
	${appointmentThemeStyles};
`

const Placeholder = styled('div')`
	width: 100%;
	height: 90%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const placeholder = type => (
	<Placeholder>
		<h4>You have no {type} appointments.</h4>
	</Placeholder>
)

const UserAppointments = ({ profileAppointments }) => {
	const { type } = useParams()
	const history = useHistory()

	const appointments = profileAppointments[type]

	const onSwipeRight = () => {
		if (type !== 'upcoming') {
			history.push(generatePath(USER_APPOINTMENTS, { type: 'upcoming' }))
		}
	}

	const onSwipeLeft = () => {
		if (type !== 'past') {
			history.push(generatePath(USER_APPOINTMENTS, { type: 'past' }))
		}
	}

	return (
		<Swipe className="swipe-container" onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
			<Container padBottom={appointments.length > 3}>
				{appointments.length === 0
					? placeholder(type)
					: appointments.map((appointment, index) => {
							return (
								<Link
									to={{
										pathname: generatePath(APPOINTMENT_OVERVIEW, { id: appointment.id }),
										state: {
											type
										}
									}}
									key={index}
								>
									<Appointment key={index}>
										<div className="time">
											<h4>{format(appointment.startTime, 'h:mma')}</h4>
											<h4>{format(appointment.startTime, 'MMM Do')}</h4>
										</div>
										<div className="location">
											<h4>{appointment.location.name}</h4>
											<h5>{appointment.location.address}</h5>
										</div>
										<div className="details">
											<ul>
												<li>
													${appointment.price}{' '}
													{appointment.services.length > 0 && <span> - {appointment.services[0].name}</span>}
												</li>
											</ul>
										</div>
									</Appointment>
								</Link>
							)
					  })}
			</Container>
		</Swipe>
	)
}

export default UserAppointments
