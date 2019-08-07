import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const Container = styled('div')`
	padding: 16px 10px;
	height: 100%;

	@media (min-width: 900px) {
		display: flex;
		flex-wrap: wrap;
	}

	a {
		text-decoration: none;
		color: inherit;
	}
`

const Appointment = styled('div')`
	width: 100%;

	background: white;
	color: rgba(38, 43, 49, 1);
	border-radius: 8px;
	margin-bottom: 10px;
	box-shadow: 0px 4px 3px rgba(32, 32, 32, 0.02);
	padding: 15px;
	font-size: 14px;

	@media (min-width: 900px) {
		width: calc(33% - 10px);
		min-width: 350px;
		margin: 10px 5px;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: rgba(233, 209, 140, 1);

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

const placeholder = type => (
	<Placeholder>
		<h4>You have no {type} appointments.</h4>
	</Placeholder>
)

const UserAppointments = ({ type, appointments = [] }) => {
	return (
		<Container>
			{appointments.length === 0
				? placeholder(type)
				: appointments.map((appointment, index) => {
						return (
							<Link to={`/appointment/${appointment.id}`} key={index}>
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
							</Link>
						)
				  })}
		</Container>
	)
}

export default UserAppointments
