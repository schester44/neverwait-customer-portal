import isWithinRange from 'date-fns/is_within_range'
import parse from 'date-fns/parse'
import setHours from 'date-fns/set_hours'
import setMinutes from 'date-fns/set_minutes'

function dateFromTimeString(time, date) {
	const [hours, minutes] = time.split(':')

	return setHours(setMinutes(date || new Date(), parseInt(minutes, 10)), parseInt(hours, 10))
}

const isWorking = (employee, date) => {
	return employee.schedule_ranges.some(range => {
		return range.schedule_shifts.some(shift => {
			return isWithinRange(
				date,
				parse(dateFromTimeString(shift.start_time, date)),
				parse(dateFromTimeString(shift.end_time, date))
			)
		})
	})
}

export default isWorking
