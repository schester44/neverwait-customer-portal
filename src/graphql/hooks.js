import React from 'react'

import getFirstAvailableTime from '../helpers/getFirstAvailableTime'
import waitTimeInMinutes from '../helpers/waitTimeInMinutes'
import isScheduledToWork from '../helpers/isScheduledToWork'
import { scheduleRangeFromDate } from '../helpers/scheduleRangesByDate'

export const useEnhancedEmployees = ({ employees = [] }) => {
	const [state, setState] = React.useState({
		loading: true,
		hasWorkingEmployees: false,
		employees: []
	})

	React.useEffect(() => {
		const update = () => {
			setState(() => {
				let hasWorkingEmployees = false

				const enhancedEmployees = employees.map(employee => {
					const schedule = scheduleRangeFromDate({ scheduleRanges: employee.schedule_ranges, date: new Date() })

					const firstAvailableTime = getFirstAvailableTime({
						appointments: employee.appointments,
						// TODO: 20 mins should be configurable
						duration: 20,
						schedule
					})

					if (!firstAvailableTime) return { ...employee, isWorking: false }

					const isWorking = isScheduledToWork(employee, firstAvailableTime)

					if (!isWorking) return { ...employee, isWorking }

					const waitTime = waitTimeInMinutes(firstAvailableTime)

					hasWorkingEmployees = true

					return { ...employee, isWorking: true, waitTime }
				})

				return {
					hasWorkingEmployees,
					loading: false,
					employees: enhancedEmployees
				}
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
