import { isAfter, isWithinRange, addMinutes } from 'date-fns'
import SchedulerCreator from './ScheduleCreator'

const scheduler = new SchedulerCreator()

const getAvailableShiftSlots = (schedule, date, duration = 0, timeSlotInterval = 5) => {
	const workDay = scheduler.find(schedule.schedule_ranges, date)

	if (!workDay) return []

	let shiftSlots = scheduler.getShiftSlots(workDay.schedule_shifts, timeSlotInterval, date)

	const slots = shiftSlots.filter(slot => {
		// Create slots based on the time this person works.
		const isAvailable = [...schedule.appointments, ...schedule.blockedTimes].every(appointment => {
			const slotStartOverlapsAppt = isWithinRange(
				slot.start_time,
				appointment.startTime,
				appointment.endTime
			)

			const slotEndOverlapsAppt = isWithinRange(
				slot.end_time,
				appointment.startTime,
				appointment.endTime
			)

			const slotWithAddedDurationOverlapsAppointment = isWithinRange(
				appointment.startTime,
				slot.start_time,
				addMinutes(slot.start_time, duration > 0 ? duration : 0)
			)

			const appointmentExceedsSchedule = isAfter(
				addMinutes(slot.start_time, duration > 0 ? duration : 0),
				slot.shiftEnd
			)

			return (
				!slotWithAddedDurationOverlapsAppointment &&
				!slotStartOverlapsAppt &&
				!slotEndOverlapsAppt &&
				!appointmentExceedsSchedule
			)
		})

		return isAvailable
	})

	return slots
}
export default getAvailableShiftSlots
