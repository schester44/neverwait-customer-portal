import { isWithinRange } from 'date-fns'
import { dateFromTimeString } from './date-from'

const isWorkingAtTime = ({ schedule, time, sourceType = 'acceptingCheckins' }) => {
	if (!schedule) return false

	return schedule.schedule_shifts.some(shift => {
		return (
			!!shift[sourceType] &&
			isWithinRange(
				time,
				dateFromTimeString(shift.start_time, time),
				dateFromTimeString(shift.end_time, time)
			)
		)
	})
}

export const acceptingSources = ({ schedule, time }) => {
	const accepts = {
		acceptingCheckins: false,
		acceptingWalkins: false,
		acceptingAppointments: false,
	}

	if (!schedule) return accepts

	schedule.schedule_shifts.forEach(shift => {
		if (
			isWithinRange(
				time,
				dateFromTimeString(shift.start_time, time),
				dateFromTimeString(shift.end_time, time)
			)
		) {
			if (shift.acceptingCheckins) {
				accepts.acceptingCheckins = true
			}

			if (shift.acceptingWalkins) {
				accepts.acceptingWalkins = true
			}

			if (shift.acceptingAppointments) {
				accepts.acceptingAppointments = true
			}
		}
	})

	return accepts
}

export default isWorkingAtTime
