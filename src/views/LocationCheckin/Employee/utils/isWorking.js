import isWithinRange from 'date-fns/is_within_range'
import parse from 'date-fns/parse'
import setHours from 'date-fns/set_hours'
import setMinutes from 'date-fns/set_minutes'
import format from 'date-fns/format'
import isSameDay from 'date-fns/is_same_day'
import isAfter from 'date-fns/is_after'

function dateFromTimeString(time, date) {
	const [hours, minutes] = time.split(':')

	return setHours(setMinutes(date || new Date(), parseInt(minutes, 10)), parseInt(hours, 10))
}

const getScheduleRangeByDate = (scheduleRanges, date) => {
	return scheduleRanges.find(range => {
		let withinRange

		const start = range.start_date

		if (range.end_date) {
			const end = range.end_date

			if (range.day_of_week === format(date, 'dddd').toLowerCase()) {
				withinRange = isWithinRange(date, start, end) || isSameDay(start, date) || isSameDay(end, date)
			}
		} else {
			if (range.day_of_week === format(date, 'dddd').toLowerCase()) {
				withinRange = isSameDay(date, start) || isAfter(date, start)
			}
		}

		return withinRange
	})
}

const isWorking = (employee, date) => {
	const range = getScheduleRangeByDate(employee.schedule_ranges, date)

	if (!range) return false

	return range.schedule_shifts.some(shift => {
		return isWithinRange(
			date,
			parse(dateFromTimeString(shift.start_time, date)),
			parse(dateFromTimeString(shift.end_time, date))
		)
	})
}

export default isWorking
