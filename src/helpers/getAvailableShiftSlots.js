import { isAfter, isWithinRange, addMinutes } from 'date-fns'
import SchedulerCreator from './ScheduleCreator'

const scheduler = new SchedulerCreator()

const getShiftSlots = (schedule, date, duration = 0) => {
	const workDay = scheduler.find(schedule.schedule_ranges, date)

	if (!workDay) return []

	let shiftSlots = scheduler.getShiftSlots(workDay.schedule_shifts, 5, date)

	const slots = []

	for (let i = 0; i < shiftSlots.length; i++) {
		const slot = shiftSlots[i]

		// Create slots based on the time this person works.
		const isAvailable = schedule.appointments.every(appointment => {
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

			// We subtract 1 so an appt that ends at 10:15 doesn't overlap the 10:15 slot
			const apptWouldOverlapExisting = isWithinRange(
				addMinutes(slot.start_time, duration - 1),
				appointment.startTime,
				appointment.endTime
			)

			const apptWouldOverflowSchedule = isAfter(
				addMinutes(slot.start_time, duration - 1),
				slot.shiftEnd
			)

			return (
				!slotStartOverlapsAppt &&
				!slotEndOverlapsAppt &&
				!apptWouldOverlapExisting &&
				!apptWouldOverflowSchedule
			)
		})

		if (isAvailable) {
			slots.push(slot)
		}
	}

	return slots
}

export default getShiftSlots
