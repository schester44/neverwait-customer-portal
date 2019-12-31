import React from 'react'
import SchedulerCreator from '../../../helpers/ScheduleCreator'
import { isSameDay, startOfDay } from 'date-fns'
import memoize from 'memoize-one'
import DateCell from './DateCell'

const isMobileCheck = () => {
	const ua = navigator.userAgent
	const isAndroid = () => Boolean(ua.match(/Android/i))
	const isIos = () => Boolean(ua.match(/iPhone|iPad|iPod/i))
	const isOpera = () => Boolean(ua.match(/Opera Mini/i))
	const isWindows = () => Boolean(ua.match(/IEMobile/i))

	return Boolean(isAndroid() || isIos() || isOpera() || isWindows())
}

const isMobile = isMobileCheck()
const scheduler = new SchedulerCreator()

const createDates = memoize(scheduler.datesFrom)

const DatePicker = ({ maxDays, scheduleRanges, closedDates = [], value, onSelect }) => {
	const cellsRef = React.useRef()

	const dates = createDates(startOfDay(new Date()), maxDays || 7)

	return (
		<div className="appearance-none flex w-full h-auto items-center border-b border-gray-200">
			<div
				className="w-full flex overflow-x-auto overflow-y-hidden whitespace-no-wrap"
				ref={cellsRef}
			>
				{dates.map((date, idx) => {
					return (
						<DateCell
							key={idx}
							closedDates={closedDates}
							scheduleRanges={scheduleRanges}
							width={50}
							isDesktop={!isMobile}
							isSelected={isSameDay(date, value)}
							date={date}
							onClick={() => onSelect(date)}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default DatePicker
