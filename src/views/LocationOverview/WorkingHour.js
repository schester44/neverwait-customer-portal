import React from 'react'
import clsx from 'clsx'

import { format, startOfDay, addMinutes } from 'date-fns'

const WorkingHour = ({ isToday, day, details }) => {
	return (
		<div
			className={clsx('flex py-1 justify-between items-center text-lg', { 'font-bold': isToday })}
		>
			<div className="day capitalize">{day}</div>

			{details.open ? (
				<div className="flex items-center">
					<div>{format(addMinutes(startOfDay(new Date()), details.startTime), 'h:mma')}</div>
					<div className="px-1"> - </div>
					<div>{format(addMinutes(startOfDay(new Date()), details.endTime), 'h:mma')}</div>
				</div>
			) : (
				<div className="time">Closed</div>
			)}
		</div>
	)
}

export default WorkingHour
