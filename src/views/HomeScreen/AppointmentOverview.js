import React from 'react'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import format from 'date-fns/format'
import Swipe from 'react-easy-swipe'
import Button from '../../components/Button'
import { MobileView } from 'react-device-detect'
import { USER_DASHBOARD } from '../../routes'
import isRecentAppointment from '../../utils/isRecentAppointment'

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
	margin: 0 10px;
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

const AppointmentOverview = ({ profile, setTime }) => {
	const history = useHistory()
	const { id: appointmentId } = useParams()

	const appointment = React.useMemo(() => {
		if (appointmentId === 'recent') {
			const appointment = JSON.parse(localStorage.getItem('last-appt'))
			const isRecent = isRecentAppointment(appointment)
			if (isRecent) return appointment

			// when we return undefiend, we need to redirect the user back to the overview screen. tehy're trying to view a recent appointment but there isn't one.
			return isRecent ? appointment : undefined
		}

		const compare = appt => Number(appt.id) === Number(appointmentId)

		return profile.appointments.upcoming.find(compare) || profile.appointments.past.find(compare)
	}, [profile, appointmentId])

	React.useEffect(() => {
		if (appointment) {
			setTime(appointment.startTime, appointment.employee.firstName)
		}
	}, [appointment, setTime])

	if (!appointment) return <Redirect to={USER_DASHBOARD} />

	const onSwipeRight = () => history.goBack()

	return (
		<Swipe className="swipe-container" onSwipeRight={onSwipeRight}>
			<Container>
				<div className="block location">
					<h3>{appointment.location.name}</h3>
					<h5>{appointment.location.address}</h5>
					<h5>{appointment.location.contactNumber}</h5>
				</div>
				<div className="block">
					<div className="flex">
						{appointment.services.length > 1 ? (
							<h4>Multiple Services</h4>
						) : (
							appointment.services.length === 1 && <h4>{appointment.services[0].name}</h4>
						)}
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

				<MobileView>
					<a href={`tel:${appointment.location.contactNumber}`}>
						<Button style={{ width: '100%', fontSize: 12 }}>Call {appointment.location.name}</Button>
					</a>
				</MobileView>
			</Container>
		</Swipe>
	)
}

export default AppointmentOverview
