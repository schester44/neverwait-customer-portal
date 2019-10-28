import addDays from 'date-fns/add_days'
import startOfDay from 'date-fns/start_of_day'
import setMinutes from 'date-fns/set_minutes'
import setSeconds from 'date-fns/set_seconds'
import parse from 'date-fns/parse'
import setHours from 'date-fns/set_hours'
import isWithinRange from 'date-fns/is_within_range'
import isAfter from 'date-fns/is_after'
import format from 'date-fns/format'
import isSameDay from 'date-fns/is_same_day'
import isBefore from 'date-fns/is_before'
import addMinutes from 'date-fns/add_minutes'

export function dateFromTimeString(time, date) {
	const [hours, minutes] = time.split(':')

	return setSeconds(setHours(setMinutes(date || new Date(), parseInt(minutes, 10)), parseInt(hours, 10)), 0)
}

export default class SchedulerCreator {
	getShiftSlots(shifts, interval = 30, day = new Date()) {
		const slots = []
		const now = new Date()
		for (let i = 0; i < shifts.length; i++) {
			const shift = shifts[i]
			let start = dateFromTimeString(shift.start_time, day)

			const end = dateFromTimeString(shift.end_time, day)

			while (isBefore(start, end) && isAfter(start, now) && shift.acceptingAppointments) {
				// create a slot
				const end_time = addMinutes(start, interval - 1)

				slots.push({
					start_time: start,
					end_time
				})

				start = addMinutes(end_time, 1)
			}
		}

		return slots
	}

	datesFrom(date, numOfDates) {
		const last = addDays(date, numOfDates)
		let current = date
		let days = []

		while (isBefore(current, last)) {
			days.push(startOfDay(current))

			current = addDays(current, 1)
		}

		return days
	}

	get(scheduleRanges, date) {
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

	find(dates, needle) {
		return dates.find(date => {
			const start = date.start_date
			const end = date.end_date

			const day_of_week = format(needle, 'dddd').toLowerCase()

			if (date.day_of_week !== day_of_week) return false

			if (isSameDay(needle, start)) return true

			if (end && (isSameDay(needle, end) || isWithinRange(needle, start, end))) return true

			if (!end && isAfter(needle, start)) return true

			return false
		})
	}

	filter(dates, needle) {
		return dates.filter(date => {
			return isWithinRange(needle, parse(date.start_date), parse(date.end_date))
		})
	}
}
