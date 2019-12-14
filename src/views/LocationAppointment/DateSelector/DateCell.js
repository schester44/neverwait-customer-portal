import React from 'react'
import styled, { css } from 'styled-components'
import ScheduleCreator from '../../../helpers/ScheduleCreator'

import { format } from 'date-fns'

const selectedStyles = ({ isSelected, theme }) =>
	isSelected &&
	css`
		cursor: default;

		.day {
			background: ${theme.colors.brand};
			color: white;
			font-size: 14px;
		}
	`

const disabledStyles = ({ isDisabled }) =>
	isDisabled &&
	css`
		opacity: 0.3;
		pointer-events: none;
		color: #6a6a6a !important;
		cursor: not-allowed;
	`

const desktopStyles = ({ isDesktop }) =>
	isDesktop &&
	css`
		width: 60px;
	`

const Container = styled('div')(
	props => css`
		height: 100%;
		width: 60px;
		min-width: 60px;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		user-select: none;
		cursor: pointer;

		.day {
			width: 32px;
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 100%;
			font-weight: 700;
			background: rgba(247, 249, 248, 1);
		}

		${selectedStyles};
		${disabledStyles};
		${desktopStyles};
	`
)

const scheduler = new ScheduleCreator()

const DateCell = React.forwardRef(
	({ date, isDesktop, scheduleRanges, isSelected, onClick }, ref) => {
		const canSchedule = React.useMemo(() => {
			const schedule = scheduler.get(scheduleRanges, date)

			return schedule && schedule.schedule_shifts.some(shift => !!shift.acceptingAppointments)
		}, [scheduleRanges, date])

		const handleClick = e => {
			if (!canSchedule) return
			onClick(e)
		}

		return (
			<Container
				data-date={date}
				ref={ref}
				isDisabled={!canSchedule}
				isDesktop={isDesktop}
				isSelected={isSelected}
				onClick={handleClick}
			>
				<div className="small-sub-text">{format(date, 'ddd')}</div>
				<div className="day">{format(date, 'DD')}</div>
			</Container>
		)
	}
)

export default DateCell
