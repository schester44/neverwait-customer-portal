import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { format, subMinutes } from 'date-fns'
import Button from '../../components/Button'
import FormFooter from '../../components/FormFooter'

const Wrapper = styled('div')`
	padding: 10px;
	width: 100%;

	.time {
		color: ${({ theme }) => theme.colors.success};
	}

	.block {
		padding-bottom: 24px;
		margin-bottom: 24px;
		border-bottom: 1px solid rgba(150, 150, 150, 0.5);

		p {
			line-height: 1.2;
		}

		&.service {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
`
const Finished = ({ isAppointment, appointment, locationData, selectedServices, selectedServiceIds }) => {
	return (
		<Wrapper>
			<div className="small-sub-text" style={{ textAlign: 'center', marginBottom: 14 }}>
				{isAppointment && (
					<p>
						Your appointment for {format(appointment.startTime, 'dddd, MMM Do')}
						<br />
						has been confirmed.
					</p>
				)}
			</div>

			<div className="block">
				<h4 style={{ marginTop: 14, opacity: 0.9 }}>
					{isAppointment ? format(appointment.startTime, 'dddd, MMMM Do') : 'Today'} at
				</h4>

				<h1 className="time" style={{ fontFamily: 'inherit', fontSize: 60, lineHeight: 1, margin: 0 }}>
					{format(appointment.startTime, 'h:mmA')}
				</h1>
			</div>

			<div className="block location">
				<h3>{locationData.name}</h3>
				<p className="small-sub-text">{locationData.address}</p>
			</div>

			<div className="block service">
				<div>
					{selectedServiceIds.map((id, index) => {
						return (
							<p key={index} style={{ marginTop: index > 0 ? 4 : 0 }}>
								{selectedServices[id].name}
							</p>
						)
					})}
					<p className="small-sub-text">{appointment.duration} minutes</p>
				</div>
				<h3>${appointment.price}</h3>
			</div>

			<p style={{ textAlign: 'center' }} className="small-sub-text">
				Please arrive 15 minutes early ({format(subMinutes(appointment.startTime, 15), 'h:mma')}).
			</p>

			<FormFooter style={{ background: 'transparent' }}>
				<Link to="/" style={{ width: '100%', display: 'block' }}>
					<Button style={{ width: '100%' }} className="finished-btn">
						Finish
					</Button>
				</Link>
			</FormFooter>
		</Wrapper>
	)
}

export default Finished
