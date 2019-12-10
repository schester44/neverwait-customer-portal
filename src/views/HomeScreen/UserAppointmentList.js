import React from 'react'
import styled from 'styled-components'
import { generatePath, Link, useParams, useHistory, useLocation } from 'react-router-dom'
import Swipe from 'react-easy-swipe'

import { USER_APPOINTMENTS, APPOINTMENT_OVERVIEW } from '../../routes'
import Appointment from './Appointment'

const Container = styled('div')`
	padding: 20px 10px;
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

const Placeholder = styled('div')`
	width: 100%;
	height: 90%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	line-height: 1.5;

	h3 {
		text-align: center;
		font-size: 1em;
	}
`

const placeholder = type => (
	<Placeholder>
		<h3>You have no {type} appointments.</h3>
		{type === 'upcoming' ? <h4>Lets get you cleaned up!</h4> : <h4>Nothing to see here.</h4>}
	</Placeholder>
)

const UserAppointmentList = ({ profileAppointments }) => {
	const { type } = useParams()
	const history = useHistory()
	const location = useLocation()

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
										state: { type, from: location.pathname }
									}}
									key={index}
								>
									<Appointment
										isPrimary={type === 'upcoming' && index === 0}
										key={index}
										appointment={appointment}
									/>
								</Link>
							)
					  })}
			</Container>
		</Swipe>
	)
}

export default UserAppointmentList
