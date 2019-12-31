import React from 'react'
import clsx from 'clsx'
import { format, isWithinRange } from 'date-fns'

import ScheduleCreator from '../../../helpers/ScheduleCreator'

const scheduler = new ScheduleCreator()

const DateCell = React.forwardRef(
	({ date, scheduleRanges, closedDates, isSelected, onClick }, ref) => {
		const canSchedule = React.useMemo(() => {
			const schedule = scheduler.get(scheduleRanges, date)

			const isClosedOnDate = closedDates.some(event =>
				isWithinRange(date, event.start_date, event.end_date)
			)

			if (isClosedOnDate) return false

			return schedule && schedule.schedule_shifts.some(shift => !!shift.acceptingAppointments)
		}, [scheduleRanges, closedDates, date])

		const handleClick = e => {
			if (!canSchedule) return
			onClick(e)
		}

		return (
			<div
				style={{ minWidth: 60 }}
				className={clsx(
					'mb-1 mx-1 h-full rounded border w-28 h-28 p-2 flex justify-between items-center flex-col select-none',
					{
						'cursor-pointer': canSchedule,
						'cursor-not-allowed opacity-25': !canSchedule,
						'border-indigo-500 bg-gray-100': isSelected,
						'border-gray-100': !isSelected
					}
				)}
				data-date={date}
				ref={ref}
				onClick={handleClick}
			>
				<p
					className={clsx('text-sm text-center', {
						'text-indigo-500': isSelected,
						'text-gray-700': !isSelected
					})}
				>
					{format(date, 'ddd')}
				</p>
				<p
					className={clsx('font-black text-center', {
						'text-indigo-500': isSelected,
						'text-gray-700': !isSelected
					})}
				>
					{format(date, 'DD')}
				</p>
			</div>
		)
	}
)

export default DateCell
