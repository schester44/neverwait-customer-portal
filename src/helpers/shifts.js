import { isWithinRange, isAfter } from 'date-fns'
import { dateFromTimeString } from './date-from'

export const firstShiftAfterTime = ({ schedule, time = new Date() }) => {
	return schedule.schedule_shifts.find(shift => isAfter(dateFromTimeString(shift.start_time), time))
}

export const shiftFromTime = ({ schedule, time = new Date() }) => {
	return schedule.schedule_shifts.find(shift => {
		return isWithinRange(
			time,
			dateFromTimeString(shift.start_time, time),
			dateFromTimeString(shift.end_time, time)
		)
	})
}
