import { isWithinRange } from 'date-fns'
import { dateFromTimeString } from './date-from'

const isWorkingAtTime = ({ schedule, time, sourceType = 'acceptingCheckins' }) => {
	if (!schedule) return false

	return schedule.schedule_shifts.some(shift => {
		return (
			!!shift[sourceType] &&
			isWithinRange(time, dateFromTimeString(shift.start_time, time), dateFromTimeString(shift.end_time, time))
		)
	})
}

export default isWorkingAtTime
