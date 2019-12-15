import React from 'react'
import styled, { css } from 'styled-components'

import { format, startOfDay, addMinutes } from 'date-fns'

const todayStyles = ({ isToday }) =>
	isToday &&
	css`
		font-weight: 700;
	`

const Container = styled('div')`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 17px;
	line-height: 32px;

	.times {
		display: flex;
	}

	.divider {
		padding: 0 10px;
	}

	.day {
		display: flex;
		align-items: center;
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
					<div className="time">
						{format(addMinutes(startOfDay(new Date()), details.startTime), 'h:mma')}
					</div>
					<div className="divider"> - </div>
					<div className="time">
						{format(addMinutes(startOfDay(new Date()), details.endTime), 'h:mma')}
					</div>
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
