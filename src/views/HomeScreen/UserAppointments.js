import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

const Container = styled('div')`
	padding: 16px 10px;
`

const Appointment = styled('div')`
    width: 100%;
    color: white;
	background: rgba(38, 43, 49, 1);
	border-radius: 8px;
	margin-bottom: 10px;
	box-shadow: 0px 2px 5px rgba(32, 32, 32, 0.2);
	padding: 15px;
	font-size: 14px;

	.time {
		display: flex;
		align-items: center;
        justify-content: space-between;
        color: rgba(233, 209, 140, 1.0);

		h4 {
			margin-right: 8px;
			font-size: 18px;
		}
	}

	.location {
		margin-top: 8px;
	}

	.details {
		margin-top: 8px;

		ul {
			list-style: none;
			display: flex;
			align-items: center;
			justify-content: space-between;

			li {
				display: inline;
			}
		}
	}
`

const Placeholder = styled('div')`
	width: 100%;
	height: 60%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const UserAppointments = ({ type, appointments }) => {
	if (appointments.length === 0) {
		return (
			<Placeholder>
				<h4>You have no {type} appointments.</h4>
			</Placeholder>
		)
	}

	return (
		<Container>
			{appointments.map((appointment, index) => {
				return (
					<Appointment key={index}>
						<div className="time">
							<h4>{format(appointment.startTime, 'h:mma')}</h4>
							<h4>{format(appointment.startTime, 'MMM Do')}</h4>
						</div>
						<div className="location">
							<h4>{appointment.location.name}</h4>
							<h5>{appointment.location.address}</h5>
						</div>
						<div className="details">
							<ul>
								<li>
									${appointment.price} - {appointment.services[0].name}
								</li>
							</ul>
						</div>
					</Appointment>
				)
			})}
		</Container>
	)
}

export default UserAppointments
