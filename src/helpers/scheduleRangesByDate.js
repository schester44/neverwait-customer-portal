import { format, isWithinRange, isSameDay, isAfter } from 'date-fns'

export const scheduleRangeFromDate = ({ scheduleRanges, date = new Date() }) => {
	return scheduleRanges.find(range => range.day_of_week === format(date, 'dddd').toLowerCase())
}

const scheduleRangesByDate = (scheduleRanges, date) => {
	return scheduleRanges.find(range => {
		const start = range.start_date

		const isSameDayOfWeek = range.day_of_week === format(date, 'dddd').toLowerCase()

		if (range.end_date) {
			const end = range.end_date

			if (isSameDayOfWeek && (isWithinRange(date, start, end) || isSameDay(start, date) || isSameDay(end, date))) {
				return true
			}
		} else {
			if (isSameDayOfWeek && (isSameDay(date, start) || isAfter(date, start))) {
				return true
			}
		}

		return false
	})
}

export default scheduleRangesByDate
