import React from 'react'
import styled, { css } from 'styled-components'
import { format } from 'date-fns'
import ScheduleCreator from '../../utils/ScheduleCreator'

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

const disabledStyles = ({ disabled }) =>
	disabled &&
	css`
		opacity: 0.3;
		pointer-events: none;
		color: #6a6a6a !important;
		cursor: default;
	`

const Container = styled('div')`
	height: 80px;
	width: 80px;
	padding: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border-right: 1px solid rgba(240, 240, 240, 1);
	user-select: none;
	cursor: pointer;

	.day {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		font-weight: 700;
	}

	${selectedStyles};
	${disabledStyles};
`

const scheduler = new ScheduleCreator()

const DateCell = ({ date, scheduleRanges, isSelected, onClick }) => {
	const daySchedule = React.useMemo(() => scheduler.get(scheduleRanges, date), [scheduleRanges, date])
	const disabled = !daySchedule

	const handleClick = e => {
		if (disabled) return
		onClick(e)
	}

	return (
		<Container disabled={disabled} isSelected={isSelected} onClick={handleClick}>
			<div className="small-sub-text">{format(date, 'ddd')}</div>
			<div className="day">{format(date, 'DD')}</div>
			<div className="small-sub-text">{format(date, 'MMM')}</div>
		</Container>
	)
}

export default DateCell
