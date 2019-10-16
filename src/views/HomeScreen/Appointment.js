import React from 'react'
import styled, { css } from 'styled-components'
import format from 'date-fns/format'

const appointmentThemeStyles = ({ theme }) => css`
	background: ${theme.colors.headerBg};
	color: ${theme.colors.headerColor};
	border-radius: ${theme.borderRadius.small};
	box-shadow: 0px 2px 3px ${theme.colors.shadow};

	.date {
		color: ${theme.colors.brand};
	}
`

const primaryStyles = ({ primary, theme }) =>
	primary &&
	css`
		.date {
			color: white;
			background: ${theme.colors.brand};

			h4 {
				color: ${theme.colors.s500};
			}
		}
	`

const Container = styled('div')`
	width: 100%;
	display: flex;
	overflow: hidden;

	margin-bottom: 10px;
	font-size: 14px;
	min-height: 80px;

	.address,
	.long-day {
		font-size: 10px;
		text-transform: uppercase;
		font-weight: 700;
		opacity: 0.8;
	}

	.time {
		padding: 10px 24px;
		display: flex;
		align-items: center;
		justify-content: center;

		h3 {
			text-align: center;

			.t-dsi {
				padding-bottom: 5px;
				font-size: 22px;
			}
		}
	}

	.date {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 20%;

		.day {
			padding-top: 5px;
			font-size: 24px;
		}
	}

	.location {
		font-weight: 700;
		font-size: 18px;
		margin: 4px 0;
		line-height: 1;
	}

	.details {
		display: flex;
		flex-direction: column;
		justify-content: center;

		padding: 10px;
		flex: 1;
	}

	${appointmentThemeStyles};
	${primaryStyles};
`

const Appointment = ({ appointment, isPrimary = false }) => {
	return (
		<Container primary={isPrimary}>
			<div className="date">
				<h3>{format(appointment.startTime, 'MMM')}</h3>
				<h3 className="day">{format(appointment.startTime, 'D')}</h3>
			</div>
			<div className="details">
				<p className="long-day">
					{format(appointment.startTime, 'dddd')} - ${appointment.price}
				</p>
				<p className="location">{appointment.location.name}</p>
				<p className="address">{appointment.location.address}</p>
			</div>
			<div className="time">
				<h3>
					<div className="t-dsi">{format(appointment.startTime, 'h:mm')}</div>
					{format(appointment.startTime, 'A')}
				</h3>
			</div>
		</Container>
	)
}

export default Appointment
