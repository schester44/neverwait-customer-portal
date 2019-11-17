import { isBefore, isAfter } from 'date-fns'
import { dateFromTimeString } from './date-from'

const getSourcesNextShifts = ({ schedule, firstAvailableTime }) => {
	let sourceShifts = {}

	const sources = ['acceptingCheckins', 'acceptingWalkins', 'acceptingAppointments']

	schedule.schedule_shifts.forEach(shift => {
		// We only want shifts in the future.
		if (isBefore(dateFromTimeString(shift.start_time), new Date())) return

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i]
			// for acceptingCheckins, if there's a "first available time" then we want the _NEXT_ shift AFTER the first available time.
			if (shift[source] && !sourceShifts[source]) {
				if (
					source !== 'acceptingCheckins' ||
					!firstAvailableTime ||
					(firstAvailableTime &&
						source === 'acceptingCheckins' &&
						isAfter(dateFromTimeString(shift.start_time), firstAvailableTime))
				) {
					sourceShifts[source] = shift
				}
			}
		}
	})

	return sourceShifts
}

export default getSourcesNextShifts
