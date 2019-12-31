import React from 'react'
import clsx from 'clsx'
import { format, isToday, isAfter } from 'date-fns'

const Appointment = ({ appointment }) => {
	const isApptToday = isToday(appointment.startTime) && isAfter(appointment.endTime, new Date())

	return (
		<div
			className="bg-gray-200 w-full px-4 py-4 flex items-center justify-between rounded-lg overflow-hidden mb-2"
			style={{ minHeight: 80 }}
		>
			<div>
				<p className="text-gray-900 text-lg font-black">
					{format(appointment.startTime, 'dddd, MMM Do')}
				</p>

				<p className="font-bold text-sm text-gray-900 mt-1 leading-tight">
					{appointment.location.name}
				</p>
				<p className="font-bold text-sm text-gray-900 mt-1 leading-tight">
					{appointment.location.address}
				</p>

				<p className="font-bold text-sm text-gray-900 mt-1 leading-tight">${appointment.price}</p>
			</div>

			<p
				className={clsx('text-2xl pl-1 font-black', {
					'text-gray-900': !isApptToday,
					'text-indigo-500': isApptToday
				})}
			>
				{format(appointment.startTime, 'h:mma')}
			</p>
		</div>
	)
}

export default Appointment
