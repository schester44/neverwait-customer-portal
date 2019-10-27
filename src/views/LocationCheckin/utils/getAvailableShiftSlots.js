import isWithinRange from 'date-fns/is_within_range'
import addMinutes from 'date-fns/add_minutes'

import SchedulerCreator from './ScheduleCreator'

const scheduler = new SchedulerCreator()

const getShiftSlots = (schedule, date, duration = 0) => {
	const workDay = scheduler.find(schedule.schedule_ranges, date)

	if (!workDay) return []

	// Create slots based on the time this person works.
	const slots = scheduler.getShiftSlots(workDay.schedule_shifts, 5, date).map(slot => {
		slot.isAvailable = schedule.appointments.every(appointment => {
			return (
				!isWithinRange(slot.start_time, appointment.startTime, appointment.endTime) &&
				!isWithinRange(slot.end_time, appointment.startTime, appointment.endTime) &&
				!isWithinRange(addMinutes(slot.start_time, duration - 1), appointment.startTime, appointment.endTime)
			)
		})

		return slot
	})

	return slots
}

export default getShiftSlots
