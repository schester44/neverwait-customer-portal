import { isAfter, isWithinRange, addMinutes, subMinutes } from 'date-fns'
import SchedulerCreator from './ScheduleCreator'

const scheduler = new SchedulerCreator()

const getAvailableShiftSlots = (schedule, date, duration = 0, timeSlotInterval = 5) => {
	const workDay = scheduler.find(schedule.schedule_ranges, date)

	if (!workDay) return []

	let shiftSlots = scheduler.getShiftSlots(workDay.schedule_shifts, timeSlotInterval, date)

	console.log(shiftSlots, schedule.appointments)
	const slots = shiftSlots.filter((slot) => {
		// Create slots based on the time this person works.
		const isAvailable = [...schedule.appointments, ...schedule.blockedTimes].every(
			(appointment) => {
				const slotStartOverlapsAppt = isWithinRange(
					slot.start_time,
					appointment.startTime,
					// Subtracting 1 minute allows us to schedule an appointment at the same time that an appointment is ending. Example: an appointment runs from 8 to 8:30 -- this allows us to show an available slot for 8:30
					subMinutes(appointment.endTime, 1)
				)

				const slotEndOverlapsAppt = isWithinRange(
					slot.end_time,
					appointment.startTime,
					subMinutes(appointment.endTime, 1)
				)

				// Once the duration is added to the slot time, is that new time during another appointment?
				const slotWithAddedDurationOverlapsAppointment = isWithinRange(
					appointment.startTime,
					slot.start_time,
					// Subtracting 1 minute allows us to schedule an appointment at the same time that an appointment is ending. Example: an appointment runs from 8 to 8:30 -- this allows us to show an available slot for 8:30
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
			}
		)

		return isAvailable
	})

	return slots
}
export default getAvailableShiftSlots
