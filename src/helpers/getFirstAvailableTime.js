import { isAfter, isBefore, differenceInMinutes, addMinutes } from 'date-fns'

import isWorkingAtTime from './isWorking'

const getFirstAvailableTime = ({
	appointments,
	duration,
	schedule,
	sourceType = 'acceptingCheckins'
}) => {
	const now = new Date()
	// sort by startTime so appointments are in the order of which they occur
	const sortedAppointments = appointments
		.filter(({ status, endTime }) => status === 'confirmed' && isAfter(endTime, now))
		.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

	const isWorkingRightNow = isWorkingAtTime({
		schedule,
		time: now,
		sourceType
	})

	if (sortedAppointments.length === 0 && isWorkingRightNow) {
		return new Date()
	}

	for (let i = 0; i < sortedAppointments.length; i++) {
		const current = sortedAppointments[i]
		const previous = sortedAppointments[i - 1]

		// If its the first appointment and there is at least 20 minutes between now and the first appointments start time then theres enough time for an appointment so lets break early.
		if (i === 0) {
			if (isBefore(addMinutes(now, duration), current.startTime) && isWorkingRightNow) {
				return new Date()
			}

			// When there is only 1 appointment
			if (sortedAppointments.length === 1) {
				// If the employee works at the end of this appointment then the end of the only appointment is the next shift available time.
				if (
					isWorkingAtTime({
						schedule,
						time: addMinutes(sortedAppointments[0].endTime, 2),
						sourceType
					})
				) {
					return sortedAppointments[0].endTime
				}

				// if he isn't working at the end of that appointment, then add the duration and see if he is working then...
				if (
					isWorkingAtTime({
						schedule,
						time: addMinutes(sortedAppointments[0].endTime, duration + 2),
						sourceType
					})
				) {
					return addMinutes(sortedAppointments[0].endTime, duration + 2)
				}
			}
		}

		const difference = differenceInMinutes(
			current.startTime,
			// there wont be a previous if we're on the first loop
			previous ? previous.endTime : now
		)

		// If theres more than 20 minutes of dead time between the two appointments then our last appointment is the previous appointment
		// if (difference > duration) {
		if (
			// We need the i !== 0 check or else it will return `new Date` when there is only 1 appointment that goes past the employees shift end. first index logic is handled up above anyways
			difference > duration &&
			// make sure they're working and that the appointment doesn't exceed their shift
			isWorkingAtTime({
				schedule,
				time: addMinutes(previous?.endTime || new Date(), duration + 2),
				sourceType
			})
		) {
			return previous?.endTime || new Date()
		}

		if (
			i === sortedAppointments.length - 1 &&
			isWorkingAtTime({
				schedule,
				time: addMinutes(sortedAppointments[i].endTime, duration + 2),
				sourceType
			})
		) {
			return sortedAppointments[i].endTime
		}
	}
}

export default getFirstAvailableTime
