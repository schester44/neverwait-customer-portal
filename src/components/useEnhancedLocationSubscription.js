import React from 'react'
import { produce } from 'immer'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import getFirstAvailableTime from '../helpers/getFirstAvailableTime'
import waitTimeInMinutes from '../helpers/waitTimeInMinutes'
import isScheduledToWork from '../helpers/isScheduledToWork'
import { scheduleRangeFromDate } from '../helpers/scheduleRangesByDate'
import { shiftFromTime } from '../helpers/shifts'
import { startOfDay, endOfDay, addDays } from 'date-fns'
import { locationDataQuery, employeeScheduleQuery } from '../graphql/queries'
import { appointmentsSubscription } from '../graphql/subscriptions'
import getSourcesNextShifts from '../helpers/getSourcesNextShifts'

const useEnhancedLocationSubscription = ({ queryOptions }) => {
	const client = useApolloClient()

	const { data, loading } = useQuery(locationDataQuery, { variables: queryOptions })

	const location = data?.locationByUUID

	const [state, setState] = React.useState({
		hasWorkingEmployees: false,
		employees: []
	})

	React.useEffect(() => {
		if (!location) return

		const employees = location.employees

		// This needs to be in an effect vs using useSubscription because we need the location.id to make a connection.
		const subscription = client
			.subscribe({
				query: appointmentsSubscription,
				variables: { locationId: location.id }
			})
			.subscribe(({ data }) => {
				if (!data || !data.AppointmentsChange) return

				const locationData = client.readQuery({ query: locationDataQuery, variables: queryOptions })

				const { appointment, employeeId, isNewRecord } = data.AppointmentsChange

				const isDeleted = appointment?.deleted

				// let apollo handle updates.
				if (!isNewRecord && !isDeleted) return

				const employees = locationData.locationByUUID.employees.map(employee => {
					if (+employeeId !== +employee.id) return employee

					return {
						...employee,
						appointments: isDeleted
							? employee.appointments.filter(appt => appt.id !== appointment.id)
							: employee.appointments.concat([appointment])
					}
				})

				client.writeQuery({
					query: locationDataQuery,
					variables: queryOptions,
					data: produce(locationData, draftState => {
						draftState.locationByUUID.employees = employees
					})
				})

				try {
					const employeeSchedule = client.readQuery({
						query: employeeScheduleQuery,
						variables: {
							locationId: location.id,
							employeeId,
							input: {
								start_date: startOfDay(new Date()),
								end_date: endOfDay(addDays(new Date(), 30))
							}
						}
					})

					client.writeQuery({
						query: employeeScheduleQuery,
						variables: {
							locationId: location.id,
							employeeId,
							input: {
								start_date: startOfDay(new Date()),
								end_date: endOfDay(addDays(new Date(), 30))
							}
						},
						data: produce(employeeSchedule, draftState => {
							if (isDeleted) {
								draftState.employeeSchedule.appointments.slice(
									draftState.employeeSchedule.appointments.findIndex(
										appt => appt.id === appointment.id
									),
									1
								)
							} else {
								draftState.employeeSchedule.appointments.push(appointment)
							}
						})
					})
				} catch (error) {
					console.error('useEnhancedLocationSubscription', error)
				}
			})

		const updateEmployeeWaitTimes = () => {
			setState(() => {
				let hasWorkingEmployees = false

				const enhancedEmployees = employees.map(employee => {
					const schedule = scheduleRangeFromDate({
						scheduleRanges: employee.schedule_ranges,
						date: new Date()
					})

					const firstAvailableTime = getFirstAvailableTime({
						appointments: employee.appointments,
						// TODO: 20 mins should be configurable
						duration: 20,
						schedule,
						sourceType: 'acceptingCheckins'
					})

					const sourcesNextShifts = getSourcesNextShifts({ schedule, firstAvailableTime })

					const currentShift = shiftFromTime({
						schedule,
						time: new Date()
					})

					if (!firstAvailableTime) {
						return { ...employee, isSchedulable: false, currentShift, sourcesNextShifts }
					}

					const isSchedulable = isScheduledToWork(employee, firstAvailableTime)

					const waitTime = waitTimeInMinutes(firstAvailableTime)

					if (isSchedulable) {
						hasWorkingEmployees = true
					}

					return {
						...employee,
						isSchedulable,
						waitTime,
						firstAvailableTime,
						sourcesNextShifts,
						currentShift
					}
				})

				return {
					hasWorkingEmployees,
					employees: enhancedEmployees
				}
			})
		}

		const timer = window.setInterval(updateEmployeeWaitTimes, 60000)

		updateEmployeeWaitTimes()

		return () => {
			window.clearInterval(timer)
			subscription.unsubscribe()
		}
	}, [client, location, queryOptions])

	return {
		loading,
		location,
		employees: state.employees
	}
}

export default useEnhancedLocationSubscription
