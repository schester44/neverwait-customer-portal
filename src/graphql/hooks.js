import React from 'react'
import { isBefore, differenceInMinutes, addMinutes, isAfter } from 'date-fns'
import isWorking from '../views/LocationCheckin/Employee/utils/isWorking'

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

export const useWaitTime = employees => {
	const [state, setState] = React.useState({
		waitTime: {},
		status: {},
		nextAvailableTime: {},
		employeesWorkingCount: 0
	})

	React.useEffect(() => {
		const update = () => {
			setState(() => {
				const waitTime = {}
				const status = {}

				let nextAvailableTime = {
					id: undefined,
					time: Infinity
				}

				let employeesWorkingCount = 0

				for (let i = 0; i < employees.length; i++) {
					const employee = employees[i]
					const waitTimeMinutes = waitTimeInMinutes(employee.appointments, employee.blockedTimes)
					const details = isWorking(employee, addMinutes(new Date(), waitTimeMinutes || 0))

					if (waitTimeMinutes < nextAvailableTime.time) {
						nextAvailableTime.id = employee.id
						nextAvailableTime.time = waitTimeMinutes
					}

					if (details.working && details.canSchedule) {
						employeesWorkingCount++
					}

					waitTime[employee.id] = waitTimeMinutes
					status[employee.id] = details
				}

				return { waitTime, status, employeesWorkingCount, nextAvailableTime }
			})
		}

		const timer = window.setInterval(update, 60000)

		update()

		return () => {
			window.clearInterval(timer)
		}
	}, [employees])

	return state
}
