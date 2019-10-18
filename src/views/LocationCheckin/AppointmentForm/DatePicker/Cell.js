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
	flex: 1;
	padding: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border-right: 1px solid rgba(240, 240, 240, 1);
	width: ${({ width }) => width}%;
	user-select: none;
	cursor: pointer;

	.sub {
		font-size: 14px;
		font-weight: 700;
		text-transform: uppsercase;
		color: #6a6a6a;
	}

	.day {
		padding: 0.5em;
		border-radius: 100%;
		font-weight: 700;
	}

	${selectedStyles};
	${disabledStyles};
`

const scheduler = new ScheduleCreator()

const DateCell = ({ date, scheduleRanges, width, isSelected, onClick }) => {
	const daySchedule = React.useMemo(() => scheduler.get(scheduleRanges, date), [scheduleRanges, date])
	const disabled = !daySchedule

	const handleClick = e => {
		if (disabled) return
		onClick(e)
	}

	return (
		<Container disabled={disabled} isSelected={isSelected} width={width} onClick={handleClick}>
			<div className="sub">{format(date, 'ddd')}</div>
			<div className="day">{format(date, 'DD')}</div>
			<div className="sub">{format(date, 'MMM')}</div>
		</Container>
	)
}

export default DateCell
