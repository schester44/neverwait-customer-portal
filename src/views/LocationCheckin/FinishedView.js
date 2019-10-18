import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { format, subMinutes } from 'date-fns'
import Button from '../../components/Button'
import FormFooter from '../../components/FormFooter'

const Wrapper = styled('div')`
	padding: 24px 10px;
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
const Finished = ({ appointment, locationData, selectedServices, selectedServiceIds }) => {

	console.log({ appointment, locationData, selectedServices, selectedServiceIds });
	return (
		<Wrapper>
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
			<div className="block">
				<p style={{ opacity: 0.7, textTransform: 'uppercase', fontSize: 12, fontWeight: 700 }}>You're all set for:</p>
				<h1 className="time" style={{ fontSize: 60 }}>
					{format(appointment.startTime, 'h:mma')}
				</h1>
			</div>

			<div className="block">
				<p className="small-sub-text">
					Please arrive 15 minutes early ({format(subMinutes(appointment.startTime, 15), 'h:mma')}).
				</p>
				<p className="small-sub-text">
					To cancel, please call the shop at
					<span> {locationData.contactNumber}.</span>
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
