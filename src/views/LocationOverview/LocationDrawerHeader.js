import React from 'react'
import { addMinutes, isWithinRange, startOfDay, format, endOfDay } from 'date-fns'
import { FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const LocationDrawerHeader = ({ isDrawerVisible, closedDates, today, onClick }) => {
	const isOpenToday =
		today?.open &&
		isWithinRange(
			new Date(),
			addMinutes(startOfDay(new Date()), today.startTime),
			addMinutes(startOfDay(new Date()), today.endTime)
		)

	const closedDate = closedDates.find(date =>
		isWithinRange(new Date(), startOfDay(date.start_date), endOfDay(date.end_date))
	)

	return (
		<div
			onClick={onClick}
			className="flex justify-between items-center border-t border-gray-200 pr-2"
		>
			<div className="flex items-center px-4 py-4">
				<FiClock size={28} />

				{isOpenToday && !closedDate ? (
					<span className="text-lg pl-2">
						Open Now {format(addMinutes(startOfDay(new Date()), today.startTime), 'h:mma')} -{' '}
						{format(addMinutes(startOfDay(new Date()), today.endTime), 'h:mma')}
					</span>
				) : (
					<span className="text-lg pl-2">Closed Now</span>
				)}
			</div>

			{isDrawerVisible ? <FiChevronUp size={28} /> : <FiChevronDown size={28} />}
		</div>
	)
}

export default LocationDrawerHeader
