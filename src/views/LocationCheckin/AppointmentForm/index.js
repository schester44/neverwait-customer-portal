import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useWindowSize } from '@withvoid/melting-pot'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { addDays, format, subDays, isBefore, startOfDay, isAfter } from 'date-fns'

import DatePicker from './DatePicker/Picker'
import SchedulerCreator from '../utils/ScheduleCreator'
import TimePicker from './TimePicker'
import FormFooter from '../../../components/FormFooter'
import Button from '../../../components/Button'
import LoadingIcon from '../../../components/LoadingIcon'

import { createProfileAppointmentMutation } from '../../../graphql/mutations'
import { employeeScheduleQuery } from './queries'
import getAvailableShiftSlots from '../utils/getAvailableShiftSlots'
import { FiArrowUp } from 'react-icons/fi'

const scheduler = new SchedulerCreator()

const bounce = keyframes`
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
		100% {
			transform: translateY(0);
		}
`

const isMobileCheck = () => {
	const ua = navigator.userAgent
	const isAndroid = () => Boolean(ua.match(/Android/i))
	const isIos = () => Boolean(ua.match(/iPhone|iPad|iPod/i))
	const isOpera = () => Boolean(ua.match(/Opera Mini/i))
	const isWindows = () => Boolean(ua.match(/IEMobile/i))

	return Boolean(isAndroid() || isIos() || isOpera() || isWindows())
}

const isMobile = isMobileCheck()

const Container = styled('div')`
	height: 100%;
	display: flex;
	flex-direction: ${isMobile ? 'column' : 'row'};
	width: 100%;

	.time-picker-placeholder {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-bottom: 100px;
		animation: ${bounce} 3s linear infinite;
	}

	.time-picker-container {
		flex: 1;
		overflow: auto;
		padding-bottom: 100px;
	}
`

const AppointmentForm = ({ duration, services, location, employee, onAppointmentCreated }) => {
	const dimensions = useWindowSize()
	const maxVisibleDates = dimensions.width > 768 ? 7 : 5
	const [createProfileAppointment, { loading: createLoading }] = useMutation(createProfileAppointmentMutation)

	const [state, setState] = React.useState({
		selectedDate: undefined,
		selectedTime: undefined,
		visibleDates: scheduler.datesFrom(new Date(), 30),
		shiftSlots: [],
		schedule: {
			appointments: [],
			schedule_ranges: []
		}
	})

	const setShiftSlots = React.useCallback(
		(schedule, date) => {
			const shiftSlots = getAvailableShiftSlots(schedule, date, duration)
			const isWorkingOnSelectedDay = shiftSlots.length > 0

			setState(prev => ({
				...prev,
				schedule,
				shiftSlots,
				isWorkingOnSelectedDay,
				selectedDate: isWorkingOnSelectedDay ? new Date() : undefined
			}))
		},
		[duration]
	)

	const [fetchSchedule, { called, loading: fetchLoading }] = useLazyQuery(employeeScheduleQuery, {
		onCompleted: data => {
			setShiftSlots(data.employeeSchedule, new Date())
		}
	})

	React.useEffect(() => {
		fetchSchedule({
			variables: {
				locationId: location.id,
				employeeId: employee.id,
				input: {
					start_date: new Date(),
					end_date: addDays(new Date(), 30)
				}
			}
		})
	}, [])

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
			const shiftSlots = getAvailableShiftSlots(prev.schedule, selectedDate, duration)

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
				isMobile={isMobile}
				dates={state.visibleDates}
				schedule={state.schedule}
				selectedDate={state.selectedDate}
				maxVisibleDates={maxVisibleDates}
				onSelect={handleDateSelect}
			/>

			{called && !fetchLoading && state.schedule.schedule_ranges.length > 0 && !state.selectedDate && (
				<div className="time-picker-placeholder">
					<FiArrowUp size={32} />
					<h2>Select a date</h2>
				</div>
			)}

			{called && !fetchLoading && state.shiftSlots.length > 0 && state.selectedDate && (
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
						<p className="small-sub-text">{format(state.selectedTime, 'h:mma')} appt.</p>

						<p className="small-sub-text">{format(state.selectedTime, 'dddd, MMMM Do')}</p>
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
