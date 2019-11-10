import { isAfter, isBefore, differenceInMinutes, addMinutes } from 'date-fns'

import isWorkingAtTime from './isWorking'

const getFirstAvailableTime = ({ appointments, duration, schedule, sourceType = 'acceptingCheckins' }) => {
	const now = new Date()
	// sort by startTime so appointments are in the order of which they occur
	const sortedAppointments = appointments
		.filter(({ status, endTime }) => status !== 'completed' && status !== 'deleted' && isAfter(endTime, now))
		.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

	const isWorkingRightNow = isWorkingAtTime({
		shifts: schedule.schedule_shifts,
		time: now,
		sourceType
	})

	for (let i = 0; i < sortedAppointments.length; i++) {
		const current = sortedAppointments[i]
		const previous = sortedAppointments[i - 1]

		// If its the first appointment and there is at least 20 minutes between now and the first appointments start time then theres enough time for an appointment so lets break early.
		if (i === 0 && isBefore(addMinutes(now, duration), current.startTime) && isWorkingRightNow) {
			return new Date()
		}

		const difference = differenceInMinutes(
			current.startTime,
			// there wont be a previous if we're on the first loop
			previous ? previous.endTime : now
		)

		// If theres more than 20 minutes of dead time between the two appointments then our last appointment is the previous appointment
		// if (difference > duration) {
		if (
			difference > duration &&
			// make sure they're working and that the appointment doesn't exceed their shift
			isWorkingAtTime({
				shifts: schedule.schedule_shifts,
				time: addMinutes(previous.endTime, duration + 2),
				sourceType
			})
		) {
			return previous.endTime
		}
	}
}

export default getFirstAvailableTime
