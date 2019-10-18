import React from 'react'
import styled from 'styled-components'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { isSameDay } from 'date-fns'

import DateCell from './Cell'

const Wrapper = styled('div')`
	width: 100%;
	display: flex;
	border-bottom: 1px solid rgba(240, 240, 240, 1);
	height: 80px;
`

const Button = styled('div')`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 50px;
	min-width: ${({ itemCount }) => (itemCount === 5 ? '14.2%' : '11.1%')};
	height: 100%;

	&:not(:last-of-type) {
		border-right: 1px solid rgba(240, 240, 240, 1);
	}
`

const DatePicker = ({ dates, schedule, maxVisibleDates, selectedDate, onNavigate, onSelect }) => {
	return (
		<Wrapper>
			<Button onClick={() => onNavigate('PREV')}>
				<FiChevronLeft />
			</Button>
			{dates.map((selectableDate, idx) => {
				return (
					<DateCell
						key={idx}
						scheduleRanges={schedule.schedule_ranges}
						width={100 / (maxVisibleDates + 2)}
						isSelected={isSameDay(selectableDate, selectedDate)}
						date={selectableDate}
						onClick={() => onSelect(selectableDate)}
					/>
				)
			})}
			<Button onClick={() => onNavigate('NEXT')}>
				<FiChevronRight />
			</Button>
		</Wrapper>
	)
}

export default DatePicker
