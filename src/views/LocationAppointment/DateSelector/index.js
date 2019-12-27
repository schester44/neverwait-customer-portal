import React from 'react'
import SchedulerCreator from '../../../helpers/ScheduleCreator'
import { isSameDay } from 'date-fns'

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

const dates = scheduler.datesFrom(new Date(), 7)

const DatePicker = ({ scheduleRanges, value, onSelect }) => {
	const cellsRef = React.useRef()

	return (
		<div className="appearance-none flex w-full h-auto items-center border-b border-gray-200">
			<div
				className="w-full sm:justify-center flex overflow-x-auto overflow-y-hidden whitespace-no-wrap"
				ref={cellsRef}
			>
				{dates.map((date, idx) => {
					return (
						<DateCell
							key={idx}
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
