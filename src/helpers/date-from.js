import { addMinutes, setHours, setMinutes, setSeconds, startOfDay } from 'date-fns'

export const dateFromMinutes = (minutes, date = new Date()) => addMinutes(startOfDay(date), minutes)

export const dateFromTimeString = (time, date = new Date()) => {
	const [hours, minutes] = time.split(':')

	return setHours(setMinutes(setSeconds(date, 0), parseInt(minutes, 10)), parseInt(hours, 10))
}
