import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'

const Container = styled('div')`
	width: 100%;
	/* Make an auto-hiding scroller for the 3 people using a IE */
	-ms-overflow-style: -ms-autohiding-scrollbar;
	/* For WebKit implementations, provide inertia scrolling */
	-webkit-overflow-scrolling: touch;
	/* We don't want internal inline elements to wrap */

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 50vh;
	}
`
const selectedStyles = ({ selected }) =>
	selected &&
	`
	background: rgba(104, 81, 152, 0.1);
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
			{slots.length > 0 ? (
				slots.map((slot, idx) => {
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
				})
			) : (
				<div className="placeholder">
					<h3>No available time slots.</h3>
				</div>
			)}
		</Container>
	)
}

export default TimePicker
