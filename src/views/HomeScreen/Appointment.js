import React from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { format, isToday, isAfter } from 'date-fns'

const Appointment = ({ appointment }) => {
	const isApptToday = isToday(appointment.startTime) && isAfter(appointment.endTime, new Date())

	return (
		<div className="w-full px-1" style={{ minHeight: 80 }}>
			<div className="flex items-center justify-between overflow-hidden border-b w-full pb-4">
				<div className="flex items-center">
					{appointment.location.photos[0] && (
						<div className="w-12 h-12 overflow-hidden rounded-lg mr-3">
							<img
								className="w-full h-full object-cover"
								src={appointment.location.photos[0].url}
								title={appointment.location.name}
							/>
						</div>
					)}
					<div>
						<p className="text-gray-900 text-lg font-black leading-none">
							<span className={`${isApptToday ? 'text-indigo-500' : ''}`}>
								{format(appointment.startTime, 'h:mma')}
							</span>{' '}
							&#8226; {format(appointment.startTime, 'ddd, MMM Do')}
						</p>

						<p className="font-bold text-sm text-gray-900 mt-1 leading-none">
							{appointment.location.name}
						</p>

						<p className="font-bold text-sm text-gray-900 mt-1 leading-none">
							${appointment.price}
						</p>
					</div>
				</div>

				<div className="text-3xl text-gray-600">
					<FiChevronRight />
				</div>
			</div>
		</div>
	)
}

export default Appointment
