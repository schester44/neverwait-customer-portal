import React from 'react'
import { generatePath, Link, useParams, useHistory, useLocation } from 'react-router-dom'
import Swipe from 'react-easy-swipe'

import { USER_APPOINTMENTS, APPOINTMENT_OVERVIEW } from '../../routes'
import Appointment from './Appointment'
import useWindowDimensions from '../../hooks/useWindowDimensions'

const Placeholder = ({ type, windowHeight }) => (
	<div style={{ height: windowHeight - 220 }} className="flex flex-col w-full justify-center items-center">
		<p className="text-sm md:text-2xl text-center text-gray-900 font-bold">
			You have no {type} appointments. :(
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

	const { height } = useWindowDimensions()

	return (
		<Swipe
			style={{ maxHeight: height - 90 }}
			className="container pb-24 h-full mx-auto px-2 py-4 overflow-auto scrolling-touch md:flex md:flex-wrap"
			onSwipeLeft={onSwipeLeft}
			onSwipeRight={onSwipeRight}
		>
			{appointments.length === 0 ? (
				<Placeholder type={type} windowHeight={height} />
			) : (
				appointments.map((appointment, index) => {
					return (
						<Link
							className="md: w-1/3 p-2"
							to={{
								pathname: generatePath(APPOINTMENT_OVERVIEW, { id: appointment.id }),
								state: { type, from: location.pathname },
							}}
							key={index}
						>
							<Appointment key={index} appointment={appointment} />
						</Link>
					)
				})
			)}
		</Swipe>
	)
}

export default UserAppointmentList
