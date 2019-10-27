import differenceInMinutes  from 'date-fns/difference_in_minutes'

export default function isRecentAppointment(appointment) {
	if (!appointment) return false

	return differenceInMinutes(appointment.startTime, new Date()) > 0
}