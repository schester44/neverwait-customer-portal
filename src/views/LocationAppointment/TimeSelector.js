import React from 'react'
import styled, { css } from 'styled-components'
import { format } from 'date-fns'

const Container = styled('div')(
	props => css`
		width: 100%;
		height: 60px;
		background: white;
		border-radius: 8px;
		border: 2px solid rgba(232, 235, 236, 1);

		box-shadow: 0px 3px 5px rgba(232, 235, 236, 0.3);
		display: flex;
		padding: 5px;
		-webkit-overflow-scrolling: touch;
		overflow-x: auto;

		.time-slot {
			font-weight: 600;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10.5px 12px;
			background: rgba(247, 249, 248, 1);
			cursor: pointer;
			margin: 4px;
			border-radius: 4px;
			font-size: 12px;

			&-selected {
				background: ${props.theme.colors.brand};
				color: white;
				box-shadow: 0px 1px 5px rgba(55, 66, 161, 0.2);
			}
		}

		${props.isDisabled &&
			css`
				opacity: 0.3;
				cursor: not-allowed;
				pointer-events: none;
			`}
	`
)

const TimeSelector = ({ isDisabled, slots, value, onSelect }) => {
	return (
		<Container isDisabled={isDisabled}>
			{slots.map((slot, idx) => {
				if (!slot.isAvailable) return null

				const isSelected = slot.start_time === value

				return (
					<div
						onClick={() => onSelect(slot.start_time)}
						key={`slot-${idx}`}
						className={`time-slot ${isSelected ? 'time-slot-selected' : ''}`}
					>
						{format(slot.start_time, 'h:mma')}
					</div>
				)
			})}
		</Container>
	)
}

export default TimeSelector
