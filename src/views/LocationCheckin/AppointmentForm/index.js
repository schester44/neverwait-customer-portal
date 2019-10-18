import React from 'react'
import styled from 'styled-components'
import { useWindowSize } from '@withvoid/melting-pot'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { parse, isWithinRange, addDays, format, subDays, isBefore, startOfDay, isAfter } from 'date-fns'

import DatePicker from './DatePicker/Picker'
import SchedulerCreator from '../utils/ScheduleCreator'
import TimePicker from './TimePicker'
import FormFooter from '../../../components/FormFooter'
import Button from '../../../components/Button'

import { createProfileAppointmentMutation } from '../../../graphql/mutations'
import { employeeScheduleQuery } from './queries'

const scheduler = new SchedulerCreator()

const getShiftSlots = (schedule, date) => {
	const workDay = scheduler.find(schedule.schedule_ranges, date)

	// Create slots based on the time this person works.
	return workDay
		? scheduler.getShiftSlots(workDay.schedule_shifts, 30, date).map(slot => {
				slot.isAvailable = schedule.appointments.every(appointment => {
					return (
						!isWithinRange(appointment.startTime, slot.start_time, slot.end_time) &&
						!isWithinRange(appointment.endTime, slot.start_time, slot.end_time)
					)
				})

				return slot
		  })
		: []
}

const Container = styled('div')`
	height: 100%;
	display: flex;
	flex-direction: column;

	.time-picker-container {
		flex: 1;
		overflow: auto;
		padding-bottom: 100px;
	}
`

const AppointmentForm = ({ services, location, employee, onAppointmentCreated }) => {
	const dimensions = useWindowSize()
	const maxVisibleDates = dimensions.width > 768 ? 7 : 5
	const [createProfileAppointment, { loading: createLoading }] = useMutation(createProfileAppointmentMutation)

	const [state, setState] = React.useState({
		selectedDate: undefined,
		selectedTime: undefined,
		visibleDates: scheduler.datesFrom(new Date(), maxVisibleDates),
		firstVisibleDate: new Date(),
		shiftSlots: [],
		schedule: {
			appointments: [],
			schedule_ranges: []
		}
	})

	const setDateShifts = React.useCallback((schedule, date) => {
		const shiftSlots = getShiftSlots(schedule, date)

		setState(prev => ({
			...prev,
			schedule,
			shiftSlots,
			isWorkingOnSelectedDay: shiftSlots.length > 0
		}))
	}, [])

	const [fetchSchedule, { loading }] = useLazyQuery(employeeScheduleQuery, {
		onCompleted: data => {
			setDateShifts(data.employeeSchedule, new Date())
		}
	})

	React.useEffect(() => {
		fetchSchedule({
			variables: {
				locationId: location.id,
				employeeId: employee.id,
				input: {
					start_date: new Date(),
					end_date: addDays(new Date(), 7)
				}
			}
		})
	}, [])

	const handleNavigation = direction => {
		let firstVisibleDate

		if (direction === 'PREV') {
			firstVisibleDate = subDays(state.firstVisibleDate, maxVisibleDates)

			if (isBefore(startOfDay(firstVisibleDate), startOfDay(new Date()))) return
		} else {
			firstVisibleDate = addDays(state.firstVisibleDate, maxVisibleDates)
		}

		// Appointment is more than 30 days into the future
		if (isAfter(firstVisibleDate, addDays(new Date(), 30))) return

		fetchSchedule({
			variables: {
				locationId: location.id,
				employeeId: employee.id,
				input: {
					start_date: firstVisibleDate,
					end_date: addDays(firstVisibleDate, 7)
				}
			}
		})

		setState(prev => {
			return {
				...prev,
				firstVisibleDate,
				visibleDates: scheduler.datesFrom(firstVisibleDate, maxVisibleDates),
				selectedDate: undefined,
				selectedTime: undefined,
				shiftSlots: []
			}
		})
	}

	const handleConfirm = async () => {
		const { data } = await createProfileAppointment({
			variables: {
				input: {
					locationId: location.id,
					userId: employee.id,
					services,
					startTime: state.selectedTime
				}
			}
		})

		if (data?.createProfileAppointment) {
			onAppointmentCreated(data.createProfileAppointment)
		}
	}

	const handleDateSelect = selectedDate => {
		setState(prev => {
			// Create slots based on the time this person works.
			const shiftSlots = getShiftSlots(prev.schedule, selectedDate)

			return {
				...prev,
				selectedDate,
				shiftSlots,
				isWorkingOnSelectedDay: shiftSlots.length > 0,
				selectedTime: undefined
			}
		})
	}

	const handleTimeSelect = slot => {
		setState(prev => ({ ...prev, selectedTime: slot.start_time }))
	}

	return (
		<Container>
			<DatePicker
				dates={state.visibleDates}
				schedule={state.schedule}
				firstVisibleDate={state.firstVisibleDate}
				selectedDate={state.selectedDate}
				maxVisibleDates={maxVisibleDates}
				onNavigate={handleNavigation}
				onSelect={handleDateSelect}
			/>

			{state.shiftSlots.length > 0 && state.selectedDate && (
				<div className="time-picker-container">
					<TimePicker
						slots={state.shiftSlots}
						schedule={state.schedule}
						onSelect={handleTimeSelect}
						selectedTime={state.selectedTime}
					/>
				</div>
			)}

			{state.selectedTime > 0 && (
				<FormFooter>
					<div>
						<p>{format(state.selectedTime, 'h:mma')} appt.</p>

						<p>{format(state.selectedTime, 'dddd, MMMM Do')}</p>
					</div>

					<Button disabled={createLoading} onClick={handleConfirm} style={{ width: '50%' }}>
						Book Now
					</Button>
				</FormFooter>
			)}
		</Container>
	)
}

export default AppointmentForm
