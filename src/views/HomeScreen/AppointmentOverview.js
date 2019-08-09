import React from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import format from 'date-fns/format'

const themeStyles = ({ theme }) => `
	background: ${theme.colors.headerBg};
	box-shadow: 0px 4px 3px ${theme.colors.shadow};
	font-size: ${theme.typography.text.medium.fontSize};
	border-radius: ${theme.borderRadius.medium};


	.times {
		h1 {
			font-size: 40px;
			color: ${theme.colors.p500};
		}
	}

	.block {
		margin-top: 8px;
		margin-bottom: 16px;
		padding-bottom: 16px;

		&:not(:last-of-type) {
			border-bottom: 1px solid ${theme.colors.n500};
		}
	}
`

const Container = styled('div')`
	padding: 10px;
	margin: 10px;
	width: calc(100% - 20px);
	padding: 15px;

	@media (min-width: 768px) {
		width: 740px;
		min-width: 350px;
		margin: 10px auto;
	}

	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.block {
		margin-top: 8px;
		margin-bottom: 16px;
		padding-bottom: 16px;
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

	${themeStyles}
`

const RecentAppointmentOverview = ({ setTime, user, appointmentId, appointment: passedInAppointment }) => {
	const appointment = React.useMemo(() => {
		if (passedInAppointment) return passedInAppointment

		const compare = appt => Number(appt.id) === Number(appointmentId)

		return user.appointments.upcoming.find(compare) || user.appointments.past.find(compare)
	}, [user, appointmentId, passedInAppointment])

	React.useEffect(() => {
		if (appointment) {
			setTime(appointment.startTime, appointment.employee.firstName)
		}
	}, [appointment, setTime])

	if (!appointment) return <Redirect to="/" />

	return (
		<Container>
			<div className="block location">
				<h3>{appointment.location.name}</h3>
				<h5>{appointment.location.address}</h5>
				<h5>{appointment.location.contactNumber}</h5>
			</div>
			<div className="block">
				<div className="flex">
					<h4>{appointment.services[0].name}</h4>
					<h5>with {appointment.employee.firstName}</h5>
				</div>

				<h3>${appointment.price}</h3>
			</div>
			<div className="block times">
				<div style={{ marginBottom: 8 }}>
					<p>Start Time</p>
					<h1>{format(appointment.startTime, 'h:mma')}</h1>
				</div>

				<div>
					<p>End Time</p>
					<h1>{format(appointment.endTime, 'h:mma')}</h1>
				</div>
			</div>
		</Container>
	)
}

export default RecentAppointmentOverview
