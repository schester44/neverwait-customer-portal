import React from 'react'
import styled from 'styled-components'
import { startOfDay, addMinutes, format } from 'date-fns'

const todayStyles = ({ isToday }) =>
	isToday &&
	`
    color: rgba(237, 209, 129, 1.0);
`

const Container = styled('div')`
	margin-bottom: 8px;
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
