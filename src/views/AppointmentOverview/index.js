import React from 'react'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { format, differenceInHours } from 'date-fns'
import { useMutation } from '@apollo/react-hooks'
import { MobileView } from 'react-device-detect'
import Swipe from 'react-easy-swipe'
import { USER_DASHBOARD } from '../../routes'
import isRecentAppointment from '../../helpers/isRecentAppointment'
import { cancelAppointmentMutation } from '../../graphql/mutations'

import pling from '../../components/Pling'
import NavHeader from '../../components/NavHeader'
import FormFooter from '../../components/FormFooter'
import Button from '../../components/Button'

const slideIn = keyframes`
	from {
		opacity: 0.5;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0vh);
	}
`

const themeStyles = ({ theme }) => css`
	background: ${theme.colors.headerBg};
	box-shadow: 0px 4px 3px ${theme.colors.shadow};
	font-size: ${theme.typography.text.medium.fontSize};

	.service-block {
		border-bottom: 1px solid ${theme.colors.n500};
	}

	.times {
		border-bottom: 1px solid ${theme.colors.n500};
		display: flex;
		justify-content: space-between;

		p {
			font-size: 10px;
			text-transform: uppercase;
			font-weight: 700;
			opacity: 0.4;
			line-height: 1;
		}

		h1 {
			line-height: 1;
			margin: 0;
			margin-top: -5px;
			font-size: 30px;
			color: ${theme.colors.p500};
		}
	}
`

const Container = styled('div')`
	overflow: hidden;
	height: 100%;
	position: relative;
	max-width: 1200px;

	.price {
		padding-top: 8px;
	}

	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.date {
		padding: 20px 20px 20px 20px;
		text-transform: uppercase;
		opacity: 0.7;
		font-size: 12px;
		font-weight: 700;
	}

	.actions {
		padding: 10px 20px;
		margin-top: 20px;
	}

	.call-btn {
		margin-bottom: 16px;
	}

	.service-block {
		padding: 20px;
	}

	.times {
		padding: 0 20px 10px 20px;
	}

	.details {
		transform: translateY(-100vh);
		animation: ${slideIn} 0.7s ease forwards;
	}

	@media (min-width: 768px) {
		margin: 0 auto;
s	}

	${themeStyles}
`

const AppointmentOverview = ({ profile }) => {
	const history = useHistory()
	const { id: appointmentId } = useParams()

	const [state, setState] = React.useState({
		showCancelModal: false
	})

	const [cancelAppointment, { loading: cancelLoading }] = useMutation(cancelAppointmentMutation)

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

	if (!appointment) return <Redirect to={USER_DASHBOARD} />

	const onSwipeRight = () => {
		history.push(history.location.state?.from || '/')
	}

	const handleCancel = async () => {
		await cancelAppointment({
			variables: {
				appointmentId
			}
		})

		pling({ message: 'Appointment canceled.', intent: 'info' })

		setState(prev => ({ ...prev, showCancelModal: false }))
	}

	return (
		<Swipe className="swipe-container" onSwipeRight={onSwipeRight}>
			<Container>
				<NavHeader
					onBack={() => {
						history.push(history.location.state?.from || '/')
					}}
				/>

				<div className="details">
					<div style={{ padding: '0 20px' }}>
						<h1>{appointment.location.name}</h1>
						<p className="small-sub-text">{appointment.location.address}</p>
						<p className="small-sub-text">{appointment.location.contactNumber}</p>
					</div>

					<div className="date">{format(appointment.startTime, 'dddd, MMM Do, YYYY')}</div>

					<div className="times">
						<div style={{ marginBottom: 16 }}>
							<p style={{ marginBottom: 4 }}>Start Time</p>
							<h1>{format(appointment.startTime, 'h:mma')}</h1>
						</div>

						<div>
							<p style={{ marginBottom: 4 }}>End Time</p>
							<h1>{format(appointment.endTime, 'h:mma')}</h1>
						</div>
					</div>

					<div className="service-block">
						{appointment.services.length > 0 &&
							appointment.services.map((service, index) => (
								<div className="flex" key={index}>
									<p className="services">{service.name}</p>
									<p className="employee">with {appointment.employee.firstName}</p>
								</div>
							))}

						<p className="price">${appointment.price}</p>
					</div>

					<div className="actions">
						<MobileView>
							<div className="call-btn">
								<a href={`tel:${appointment.location.contactNumber}`}>
									<Button style={{ width: '100%', fontSize: 14, textTransform: 'uppercase' }}>
										Call {appointment.location.name}
									</Button>
								</a>
							</div>
						</MobileView>

						{appointment.status === 'confirmed' &&
							differenceInHours(appointment.startTime, new Date()) > 3 && (
								<Button
									intent="secondary"
									style={{ width: '100%', fontSize: 14, textTransform: 'uppercase' }}
									onClick={() => setState(prev => ({ ...prev, showCancelModal: true }))}
								>
									Cancel Appointment
								</Button>
							)}
					</div>
				</div>

				{state.showCancelModal && (
					<FormFooter>
						<div style={{ width: '100%' }}>
							<p
								className="small-sub-text"
								style={{ color: 'white', textAlign: 'center', marginBottom: 16 }}
							>
								Are you sure you want to cancel this appointment?
							</p>

							<Button
								inverted
								style={{ width: '100%' }}
								onClick={handleCancel}
								disabled={cancelLoading}
							>
								Yes, Cancel
							</Button>
							<div style={{ marginTop: 24, cursor: 'pointer', textAlign: 'center' }}>
								<span onClick={() => setState(prev => ({ ...prev, showCancelModal: false }))}>
									Nevermind
								</span>
							</div>
						</div>
					</FormFooter>
				)}
			</Container>
		</Swipe>
	)
}

export default AppointmentOverview
