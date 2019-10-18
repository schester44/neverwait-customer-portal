import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'

const Container = styled('div')`
	width: 100%;
	flex: 1;
	overflow: auto;
`
const selectedStyles = ({ selected }) =>
	selected &&
	`
	background: rgba(104, 81, 152, 0.1);
	border-radius: 50px;
`

const disabledStyles = ({ disabled }) =>
	disabled &&
	`
	pointer-events: none;
	opacity: 0.2;
	font-size: 20px;
	min-height: 50px;
`

const Slot = styled('div')`
	width: 100%;
	border-top: 1px solid rgba(240, 240, 240, 1);
	cursor: pointer;
	min-height: 80px;
	font-size: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;
	${selectedStyles};
	${disabledStyles};
`

const TimePicker = ({ selectedTime, slots, onSelect }) => {
	return (
		<Container>
			{slots.map((slot, idx) => {
				return (
					<Slot
						disabled={!slot.isAvailable}
						selected={slot.start_time === selectedTime}
						onClick={() => {
							if (slot.isAvailable) {
								onSelect(slot)
							}
						}}
						key={idx}
					>
						{format(slot.start_time, 'h:mma')}
					</Slot>
				)
			})}
		</Container>
	)
}

export default TimePicker
