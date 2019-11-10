import React from 'react'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { darken } from 'polished'
import { format } from 'date-fns'

import { MobileView } from 'react-device-detect'
import Swipe from 'react-easy-swipe'
import { FiArrowLeft } from 'react-icons/fi'

import Button from '../../components/Button'
import { USER_DASHBOARD } from '../../routes'
import isRecentAppointment from '../../helpers/isRecentAppointment'

const slideIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(-50vh);
	}
	to {
		opacity: 1;
		transform: translateY(0vh);
	}
`

const headerSlideDown = keyframes`
	from {
		transform: translateY(-120px);
	}
	to {
		transform: translateY(0px);
	}
`

const themeStyles = ({ theme }) => css`
	background: ${theme.colors.headerBg};
	box-shadow: 0px 4px 3px ${theme.colors.shadow};
	font-size: ${theme.typography.text.medium.fontSize};

	.header {
		min-height: 100px;
		background-image: linear-gradient(${theme.colors.brand}, ${darken(0.05, theme.colors.brand)});
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 20px));
		animation: ${headerSlideDown} 0.4s ease forwards;
	}

	.location {
		position: relative;
		color: white;
		padding: 10px;
	}

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
			font-size: 40px;
			color: ${theme.colors.p500};
		}
	}
`

const Container = styled('div')`
	overflow: hidden;
	height: 100%;
	position: relative;
	max-width: 1200px;

	.header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;

		.back {
			position: absolute;
			top: 16px;
			left: 10px;
			font-size: 36px;
			line-height: 1;
			z-index: 999;
			color: white;
			cursor: pointer;
		}

		.location {
			padding-left: 52px;
			padding-top: 16px;
		}
	}

	.price {
		padding-top: 8px;
	}

	.location {
		margin-bottom: 16px;
		padding-bottom: 16px;

		h3 {
			line-height: 1.5;
		}
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
		padding-top: 100px;
		transform: translateY(-100vh);
		animation: ${slideIn} 0.7s ease forwards;
	}

	@media (min-width: 768px) {
		margin: 0 auto;

		.header {
			min-height: 120px !important;
		}

		.details {
			padding-top: 140px;
		}
	}

	${themeStyles}
`

const AppointmentOverview = ({ profile }) => {
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

	if (!appointment) return <Redirect to={USER_DASHBOARD} />

	const onSwipeRight = () => {
		history.push(history.location.state?.from || '/')
	}

	return (
		<Swipe className="swipe-container" onSwipeRight={onSwipeRight}>
			<Container>
				<div className="header">
					<div
						className="back"
						onClick={() => {
							history.push(history.location.state?.from || '/')
						}}
					>
						<FiArrowLeft />
					</div>

					<div className="location">
						<h3>{appointment.location.name}</h3>
						<p className="small-sub-text">{appointment.location.address}</p>
						<p className="small-sub-text">{appointment.location.contactNumber}</p>
					</div>
				</div>

				<div className="details">
					<div className="date">{format(appointment.startTime, 'dddd, MMM Do, YYYY')}</div>

					<div className="times">
						<div style={{ marginBottom: 16 }}>
							<p>Start Time</p>
							<h1>{format(appointment.startTime, 'h:mma')}</h1>
						</div>

						<div>
							<p>End Time</p>
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
					</div>
				</div>
			</Container>
		</Swipe>
	)
}

export default AppointmentOverview
