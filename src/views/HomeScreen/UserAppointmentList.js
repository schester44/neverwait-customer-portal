import React from 'react'
import { generatePath, Link, useParams, useHistory, useLocation } from 'react-router-dom'
import Swipe from 'react-easy-swipe'

import { USER_APPOINTMENTS, APPOINTMENT_OVERVIEW } from '../../routes'
import Appointment from './Appointment'

const placeholder = type => (
	<div
		style={{ height: 'calc(100vh - 200px)' }}
		className="flex flex-col justify-center items-center"
	>
		<p className="text-sm text-center text-gray-900 font-bold">You have no {type} appointments.</p>
		<p className="text-sm text-center text-gray-900 font-bold">
			{type === 'upcoming' && 'Lets get you cleaned up!'}
		</p>
	</div>
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
		<Swipe
			style={{ maxHeight: 'calc(100vh - 90px)' }}
			className="container pb-24 h-full mx-auto px-2 py-4 overflow-auto scrolling-touch"
			onSwipeLeft={onSwipeLeft}
			onSwipeRight={onSwipeRight}
		>
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
								<Appointment key={index} appointment={appointment} />
							</Link>
						)
				  })}
		</Swipe>
	)
}

export default UserAppointmentList
