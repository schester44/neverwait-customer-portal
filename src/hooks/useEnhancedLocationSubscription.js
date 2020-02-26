import React from 'react'
import { produce } from 'immer'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import getFirstAvailableTime from '../helpers/getFirstAvailableTime'
import waitTimeInMinutes from '../helpers/waitTimeInMinutes'
import isScheduledToWork from '../helpers/isScheduledToWork'
import { scheduleRangeFromDate } from '../helpers/scheduleRangesByDate'
import { shiftFromTime } from '../helpers/shifts'
import { isAfter, addMinutes, differenceInMinutes } from 'date-fns'
import { locationDataQuery, employeeScheduleQuery } from '../graphql/queries'
import { appointmentsSubscription } from '../graphql/subscriptions'
import getSourcesNextShifts from '../helpers/getSourcesNextShifts'
import { dateFromTimeString } from '../helpers/date-from'

function updateEmployeeSchedule({
	client,
	employeeId,
	locationId,
	isDeleted,
	blockedTime,
	appointment
}) {
	try {
		const employeeSchedule = client.readQuery({
			query: employeeScheduleQuery,
			variables: {
				locationId,
				employeeId
			}
		})

		client.writeQuery({
			query: employeeScheduleQuery,
			variables: {
				locationId,
				employeeId
			},
			data: produce(employeeSchedule, draftState => {
				if (isDeleted) {
					if (appointment) {
						const index = employeeSchedule.employeeSchedule.appointments.findIndex(
							({ id }) => id === appointment.id
						)

						if (index >= 0) {
							draftState.employeeSchedule.appointments.splice(index, 1)
						}
					}

					if (blockedTime) {
						const index = employeeSchedule.employeeSchedule.blockedTimes.findIndex(
							({ id }) => id === blockedTime.id
						)

						if (index >= 0) {
							draftState.employeeSchedule.blockedTimes.splice(index, 1)
						}
					}
				} else {
					if (appointment) {
						draftState.employeeSchedule.appointments.push(appointment)
					}

					if (blockedTime) {
						draftState.employeeSchedule.blockedTimes.push(blockedTime)
					}
				}
			})
		})
	} catch (error) {
		console.error('useEnhancedLocationSubscription', error)
	}
}

const useEnhancedLocationSubscription = ({
	queryOptions,
	computeEmployeeAvailability = true,
	skip = false,
	employeeScheduleEndDateOffset = 7
}) => {
	const client = useApolloClient()

	const { data, loading } = useQuery(locationDataQuery, { variables: queryOptions, skip })

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
				if (!data.SchedulingChange) return

				const locationData = client.readQuery({ query: locationDataQuery, variables: queryOptions })

				const { payload, action, employeeId, locationId } = data.SchedulingChange
				const { appointment, blockedTime } = payload

				const isDeleted = appointment
					? appointment.status === 'deleted' ||
					  appointment.status === 'canceled' ||
					  appointment.status === 'noshow'
					: action === 'DELETED'

				if (action === 'UPDATED' && !isDeleted) {
					return
				}

				updateEmployeeSchedule({
					employeeId,
					locationId,
					client,
					isDeleted,
					appointment,
					blockedTime
				})

				client.writeQuery({
					query: locationDataQuery,
					variables: queryOptions,
					data: produce(locationData, draftState => {
						const employeeIndex = draftState.locationByUUID.employees.findIndex(
							({ id }) => parseInt(id, 10) === parseInt(employeeId, 10)
						)

						if (employeeIndex < 0) return

						const employee = draftState.locationByUUID.employees[employeeIndex]

						if (appointment) {
							if (isDeleted) {
								draftState.locationByUUID.employees[
									employeeIndex
								].appointments = employee.appointments.filter(({ id }) => id !== appointment.id)
							} else {
								draftState.locationByUUID.employees[employeeIndex].appointments.push(appointment)
							}
						}

						if (blockedTime) {
							if (isDeleted) {
								draftState.locationByUUID.employees[
									employeeIndex
								].blockedTimes = employee.blockedTimes.filter(({ id }) => id !== blockedTime.id)
							} else {
								draftState.locationByUUID.employees[employeeIndex].blockedTimes.push(blockedTime)
							}
						}
					})
				})
			})

		const updateEmployeeWaitTimes = () => {
			setState(() => {
				let hasWorkingEmployees = false

				const enhancedEmployees = !computeEmployeeAvailability
					? employees
					: employees.map(employee => {
							const schedule = scheduleRangeFromDate({
								scheduleRanges: employee.schedule_ranges,
								date: new Date()
							})

							if (!schedule) {
								return { ...employee, isSchedulable: false }
							}

							const currentShift = shiftFromTime({
								schedule,
								time: new Date()
							})

							const firstAvailableTime = getFirstAvailableTime({
								appointments: employee.appointments,
								blockedTimes: employee.blockedTimes,
								// TODO: 20 mins should be configurable
								duration: 20,
								schedule,
								sourceType: 'acceptingCheckins'
							})

							const sourcesNextShifts = getSourcesNextShifts({ schedule, firstAvailableTime })

							if (!firstAvailableTime) {
								return { ...employee, isSchedulable: false, currentShift, sourcesNextShifts }
							}

							// If we're within 30 minutes of the end of the current shift, don't let the user check-in.
							// TODO: What to do if there is a next shift?
							if (
								currentShift &&
								isAfter(addMinutes(new Date(), 30), dateFromTimeString(currentShift.end_time))
							) {
								if (
									!sourcesNextShifts.acceptingCheckins ||
									differenceInMinutes(
										dateFromTimeString(sourcesNextShifts.acceptingCheckins.start_time),
										new Date()
									) >= 60
								) {
									return { ...employee, isSchedulable: false, currentShift, sourcesNextShifts }
								}

								// FIXME: It's possible for the UI to say "No Wait" when there isn't enough time to book an appointment. This is misleading to the customer because it indicates there's no wait even though the barber's shift is done in X minutes. The code above tries to fix it if there isn't a next shift within 60 minutes but falls short in completely preventing it.
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
	}, [client, location, computeEmployeeAvailability, employeeScheduleEndDateOffset, queryOptions])

	return {
		loading,
		location,
		employees: state.employees
	}
}

export default useEnhancedLocationSubscription
