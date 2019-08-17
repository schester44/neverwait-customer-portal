import isAfter from 'date-fns/is_after'
import isBefore from 'date-fns/is_before'
import addMinutes from 'date-fns/add_minutes'
import differenceInMinutes from 'date-fns/difference_in_minutes'

export default (appointments, selectedServicesDuration) => {
	console.log(selectedServicesDuration)
	const now = new Date()
	// sort by startTime so appointments are in the order of which they occur
	const sortedAppointments = appointments
		.filter(({ status, endTime }) => status !== 'completed' && status !== 'deleted' && isAfter(endTime, now))
		.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

	let index = undefined

	for (let i = 0; i < sortedAppointments.length; i++) {
		const current = sortedAppointments[i]

		// If its the first appointment and there is at least 20 minutes between now and the first appointments start time then theres enough time for an appointment so lets break early.
		if (i === 0 && isBefore(addMinutes(now, selectedServicesDuration), current.startTime)) {
			break
		}

		const difference = differenceInMinutes(
			current.startTime,
			sortedAppointments[i - 1] ? sortedAppointments[i - 1].endTime : now
		)

		console.log(difference)

		// If theres more than 20 minutes of dead time between the two appointments then our last appointment is the previous appointment
		if (difference > selectedServicesDuration) {
			index = i - 1
			break
		} else {
			// else we should continue until we find a difference of at least 20 minutes
			index = i
		}
	}

	console.log(index, sortedAppointments)

	return !isNaN(index) ? sortedAppointments[index] : undefined
}
