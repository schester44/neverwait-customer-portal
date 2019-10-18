import isWithinRange from 'date-fns/is_within_range'
import parse from 'date-fns/parse'
import setHours from 'date-fns/set_hours'
import setMinutes from 'date-fns/set_minutes'
import format from 'date-fns/format'
import isSameDay from 'date-fns/is_same_day'
import isAfter from 'date-fns/is_after'
import addMinutes from 'date-fns/add_minutes'
import { distanceInWordsToNow, setSeconds, startOfDay } from 'date-fns'

export const dateFromMinutes = (minutes, date = new Date()) => addMinutes(startOfDay(date), minutes)

export function dateFromTimeString(time, date) {
	const [hours, minutes] = time.split(':')

	return setSeconds(setHours(setMinutes(date || new Date(), parseInt(minutes, 10)), parseInt(hours, 10)), 0)
}

const getScheduleRangeByDate = (scheduleRanges, date) => {
	return scheduleRanges.find(range => {
		let withinRange

		const start = range.start_date

		if (range.end_date) {
			const end = range.end_date

			if (range.day_of_week === format(date, 'dddd').toLowerCase()) {
				withinRange = isWithinRange(date, start, end) || isSameDay(start, date) || isSameDay(end, date)
			}
		} else {
			if (range.day_of_week === format(date, 'dddd').toLowerCase()) {
				withinRange = isSameDay(date, start) || isAfter(date, start)
			}
		}

		return withinRange
	})
}

const isWorking = (employee, date) => {
	const range = getScheduleRangeByDate(employee.schedule_ranges, date)

	if (!range) return { working: false }

	const scheduled = range.schedule_shifts.some(shift => {
		return isWithinRange(
			new Date(),
			parse(dateFromTimeString(shift.start_time, new Date())),
			parse(dateFromTimeString(shift.end_time, new Date()))
		)
	})

	if (!scheduled) return { working: false }

	// TODO: This assumes the first scheduleshift is always the earliest shift.
	// Check if we're within that first 30 minutes of a shift and return false. give the walkin customers time to schedule.
	if (isAfter(addMinutes(dateFromTimeString(range.schedule_shifts?.[0]?.start_time, new Date()), 30), new Date())) {
		return {
			working: true,
			canSchedule: false,
			reason: `Accepting online checkins in ${distanceInWordsToNow(
				addMinutes(dateFromTimeString(range.schedule_shifts?.[0]?.start_time, new Date()), 30)
			)}`
		}
	}

	// employee is schedulable if the current wait time is inbetween their start/end times
	const currentShift = range.schedule_shifts.find(shift => {
		return isWithinRange(
			date,
			parse(dateFromTimeString(shift.start_time, date)),
			parse(dateFromTimeString(shift.end_time, date))
		)
	})

	return {
		working: true,
		currentShift,
		canSchedule: !!currentShift,
		reasonFatal: true,
		reason: !currentShift ? 'Fully booked' : undefined
	}
}

export default isWorking
