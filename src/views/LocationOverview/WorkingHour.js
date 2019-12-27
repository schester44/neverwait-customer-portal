import React from 'react'
import clsx from 'clsx'

import { format, startOfDay, addMinutes, endOfDay, isWithinRange, addDays } from 'date-fns'

const dayMap = {
	sunday: 0,
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6
}

const WorkingHour = ({ closedDates, isToday, day, details }) => {
	const date = addDays(new Date(), dayMap[day] - new Date().getDay())

	const closedDate = closedDates.find(day => {
		return isWithinRange(date, startOfDay(day.start_date), endOfDay(day.end_date))
	})

	return (
		<div
			className={clsx('flex py-1 justify-between items-center text-lg', { 'font-bold': isToday })}
		>
			<div className="day capitalize">{day}</div>

			{details.open && !closedDate ? (
				<div className="flex items-center">
					<div>{format(addMinutes(startOfDay(new Date()), details.startTime), 'h:mma')}</div>
					<div className="px-1"> - </div>
					<div>{format(addMinutes(startOfDay(new Date()), details.endTime), 'h:mma')}</div>
				</div>
			) : (
				<div className="time">
					Closed {closedDate?.description.length > 0 && <span>({closedDate.description})</span>}
				</div>
			)}
		</div>
	)
}

export default React.memo(WorkingHour)
