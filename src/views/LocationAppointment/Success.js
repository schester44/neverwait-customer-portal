import React from 'react'
import { Link, generatePath, useHistory } from 'react-router-dom'
import { format } from 'date-fns'
import { FaStore } from 'react-icons/fa'
import { FiArrowLeft, FiPhone, FiX } from 'react-icons/fi'
import { MobileView } from 'react-device-detect'

import { USER_APPOINTMENTS, LOCATION_OVERVIEW } from '../../routes'

import Button from '../../components/Button'
import FormFooter from '../../components/FormFooter'

const Success = ({ type = 'appointment', appointment, totalPrice }) => {
	const history = useHistory()

	const title = type === 'appointment' ? 'Appointment Created!' : 'Check-in Confirmed!'

	return (
		<div className="flex justify-between items-center flex-col">
			<div className="relative flex flex-col bg-gray-900 w-full h-64">
				<div className="flex justify-between items-center pt-1 pb-2 px-2">
					<FiX
						className="text-3xl text-white"
						onClick={() => {
							history.push('/profile/appointments')
						}}
					/>

					<p className="text-center text-sm font-bold text-white">{title}</p>
					<Link
						className="text-3xl text-white"
						to={{
							state: {
								from: history.location.pathname,
							},
							pathname: generatePath(LOCATION_OVERVIEW, {
								uuid: appointment.location.uuid,
							}),
						}}
					>
						<FaStore />
					</Link>
				</div>
				<div className="flex flex-1 flex-col items-center justify-center text-white text-4xl font-black pb-12 leading-snug">
					{format(appointment.startTime, 'MMM Do, YYYY')}
					<br />
					at {format(appointment.startTime, 'h:mma')}
				</div>

				<div
					className="absolute border-8 border-white ml-10 bg-gray-500 w-20 h-20 text-3xl text-white flex justify-center items-center bottom-0 -mb-8"
					style={{ borderRadius: '25px' }}
				>
					{appointment.employee.photo ? (
						<img
							src={appointment.employee.photo}
							alt="Provider"
							className="w-full h-full object-fill"
						/>
					) : (
						appointment.employee.firstName.charAt(0)
					)}
				</div>

				{appointment.location.contactNumber && (
					<MobileView>
						<a href={`tel:${appointment.location.contactNumber}`}>
							<div className="absolute rounded-full border-8 border-white ml-32 bg-green-500 text-white flex justify-center items-center text-lg bottom-0 -mb-6 w-12 h-12">
								<FiPhone />
							</div>
						</a>
					</MobileView>
				)}
			</div>

			<div className="px-2 pt-10">
				{type === 'appointment' ? (
					<p className="text-center mb-4">
						You have successfully booked an appointment with {appointment.employee.firstName} for{' '}
						{format(appointment.startTime, 'dddd MMMM Do, YYYY')} at{' '}
						{format(appointment.startTime, 'h:mma')}.
					</p>
				) : (
					<p className="text-center mb-4">
						You have successfully checked in with {appointment.employee.firstName} for today at{' '}
						{format(appointment.startTime, 'h:mma')}.
					</p>
				)}

				<h3 className="text-xl mb-2 font-bold">Service Details</h3>

				{appointment.services.map((service, idx) => {
					return (
						<div className="pl-1 flex justify-between mb-2 pb-2 border-b border-gray-200" key={idx}>
							<span>{service.name}</span>
							<span>${service.price}</span>
						</div>
					)
				})}
				<p className="pl-1 text-sm font-black flex justify-between">
					<span>Total</span>
					<span>${totalPrice}</span>
				</p>
			</div>

			<FormFooter>
				<Link className="w-full block" to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })}>
					<Button className="w-full">Finish</Button>
				</Link>
			</FormFooter>
		</div>
	)
}

export default Success
