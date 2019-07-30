import React from 'react'
import { isBefore, differenceInMinutes, addMinutes, isAfter } from 'date-fns'

export const waitTimeInMinutes = (appointments = [], blockedTimes = []) => {
	let index = undefined
	const now = new Date()

	const sortedAppointments = [...appointments, ...blockedTimes]
		.filter(({ status, endTime }) => status !== 'completed' && status !== 'deleted' && isAfter(endTime, now))
		.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

	for (let i = 0; i < sortedAppointments.length; i++) {
		const current = sortedAppointments[i]

		// if the first event is more than 20 minutes away then break because theres room for an appointment.
		if (i === 0 && isBefore(addMinutes(now, 20), current.startTime)) {
			break
		}

		const difference = differenceInMinutes(
			current.startTime,
			sortedAppointments[i - 1] ? sortedAppointments[i - 1].endTime : now
		)

		// if the difference between the current appointment is more than 20 minutes from the last appointment, then set the last appointment as the last appointment. else set the current appointment as the last appointment.
		if (difference > 20) {
			index = i - 1
			break
		} else {
			index = i
		}
	}

	if (!isNaN(index)) {
		return differenceInMinutes(sortedAppointments[index].endTime, now)
	}

	return 0
}

export const useWaitTime = employee => {
	const [time, setTime] = React.useState(undefined)

	React.useEffect(() => {
		setTime(waitTimeInMinutes(employee.appointments, employee.blockedTimes))

		const timer = window.setInterval(() => {
			setTime(waitTimeInMinutes(employee.appointments, employee.blockedTimes))
		}, 60000)

		return () => {
			window.clearInterval(timer)
		}
	}, [employee.appointments, employee.blockedTimes])

	return time
}
