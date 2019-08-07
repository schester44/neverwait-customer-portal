import { differenceInMinutes } from 'date-fns'

export default function isRecentAppointment(appointment) {
	if (!appointment) return false

	return differenceInMinutes(appointment.startTime, new Date()) > 0
}