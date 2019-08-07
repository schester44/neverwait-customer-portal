import React from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import format from 'date-fns/format'

const Container = styled('div')`
	padding: 10px;
	margin: 10px;
	background: white;
	width: calc(100% - 20px);
	box-shadow: 0px 4px 3px rgba(32, 32, 32, 0.02);

	border-radius: 8px;
	padding: 15px;
	font-size: 15px;

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

	.block {
		margin-top: 8px;
		margin-bottom: 16px;
		padding-bottom: 16px;

		&:not(:last-of-type) {
			border-bottom: 1px solid rgba(242, 242, 242, 1);
		}
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

const RecentAppointmentOverview = ({ setTime, user, appointmentId, appointment: passedInAppointment }) => {
	const appointment = React.useMemo(() => {
		if (passedInAppointment) return passedInAppointment

		const compare = appt => Number(appt.id) === Number(appointmentId)

		return user.appointments.upcoming.find(compare) || user.appointments.past.find(compare)
	}, [user, appointmentId, passedInAppointment])

	React.useEffect(() => {
		if (appointment) {
			setTime(appointment.startTime)
		}
	}, [appointment, setTime])

	if (!appointment) return <Redirect to="/" />

	return (
		<Container>
			<div className="block location">
				<h3>{appointment.location.name}</h3>
				<h5>{appointment.location.address}</h5>
			</div>
			<div className="block flex">
				<div>
					<h4>{appointment.services[0].name}</h4>
				</div>

				<h3>${appointment.price}</h3>
			</div>
			<div className="block times">
				<div className="flex">
					<div>
						<p>Start Time</p>
						<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 40 }}>{format(appointment.startTime, 'h:mma')}</h1>
					</div>

					<div>
						<p>End Time</p>
						<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 40 }}>{format(appointment.endTime, 'h:mma')}</h1>
					</div>
				</div>
			</div>
		</Container>
	)
}

export default RecentAppointmentOverview
