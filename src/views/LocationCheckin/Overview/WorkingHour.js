import React from 'react'
import styled, { css } from 'styled-components'
import { startOfDay, addMinutes, format } from 'date-fns'

const todayStyles = ({ isToday, theme }) =>
	isToday &&
	css`
		color: ${theme.colors.brandSecondary};
	`

const Container = styled('div')`
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.times {
		display: flex;
	}

	.divider {
		padding: 0 10px;
	}

	.day {
		text-transform: capitalize;
	}

	${todayStyles};
`

const WorkingHour = ({ isToday, day, details }) => {
	return (
		<Container isToday={isToday}>
			<div className="day">{day}</div>

			{details.open ? (
				<div className="times">
					<div className="time">{format(addMinutes(startOfDay(new Date()), details.startTime), 'h:mma')}</div>
					<div className="divider"> - </div>
					<div className="time">{format(addMinutes(startOfDay(new Date()), details.endTime), 'h:mma')}</div>
				</div>
			) : (
				<div className="times">
					<div className="time">Closed</div>
				</div>
			)}
		</Container>
	)
}

export default WorkingHour
