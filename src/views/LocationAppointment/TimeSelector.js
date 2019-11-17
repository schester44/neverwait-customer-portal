import React from 'react'
import styled, { css } from 'styled-components'
import { format } from 'date-fns'

const Container = styled('div')(
	props => css`
		width: 100%;
		height: 60px;
		background: white;
		border-radius: 8px;
		box-shadow: 1px 1px 2px rgba(32, 32, 32, 0.1), 0px 1px 5px rgba(32, 32, 32, 0.05);
		-webkit-appearance: none;

		display: flex;
		padding: 5px;
		-webkit-overflow-scrolling: touch;
		overflow-x: auto;

		@media (min-width: 768px) {
			flex-wrap: wrap;
			height: auto;
		}

		.time-slot {
			width: 70px;
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
			{slots.length === 0 && (
				<div
					style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}
				>
					<p className="small-sub-text" style={{ textAlign: 'center' }}>
						No time slots available on selected day.
						<br />
						Try selecting another day.
					</p>
				</div>
			)}

			{slots.map((slot, idx) => {
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
