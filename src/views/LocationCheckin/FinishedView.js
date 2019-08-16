import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { format, subMinutes } from 'date-fns'
import Button from '../../components/Button'
import FormFooter from '../../components/FormFooter'

const Wrapper = styled('div')`
	padding: 24px 10px;
	width: 100%;

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
const Finished = ({ price, estimates, appointment, locationData, selectedServices, selectedServiceIds }) => {
	return (
		<Wrapper>
			<div className="block location">
				<h3>{locationData.name}</h3>
				<h5>{locationData.address}</h5>
			</div>

			<div className="block service">
				<div>
					{selectedServiceIds.map((id, index) => {
						return (
							<h3 key={index} style={{ marginTop: index > 0 ? 4 : 0 }}>
								{selectedServices[id].name}
							</h3>
						)
					})}
					<h5>{estimates.duration} minutes</h5>
				</div>
				<h3>${price}</h3>
			</div>
			<div className="block">
				<p>You're all set for:</p>

				<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 60 }}>{format(appointment.startTime, 'h:mma')}</h1>
			</div>

			<div className="block">
				<p>
					Please arrive 15 minutes early ({format(subMinutes(appointment.startTime, 15), 'h:mma')}).
					<br />
					To cancel, please call {appointment.location.contactNumber}.
				</p>
			</div>

			<FormFooter>
				<span />
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
