import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import { FiArrowRight } from 'react-icons/fi'
import { isToday } from 'date-fns'
import FormFooter from '../components/FormFooter'

const Container = styled('div')`
	padding: 24px 10px;
	width: 100%;

	.flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.block {
		padding-bottom: 24px;
		margin-bottom: 24px;
		border-bottom: 1px solid rgba(150, 150, 150, 0.5);

		p {
			line-height: 1.2;
		}
	}
`

const Link = styled('span')`
	cursor: pointer;
	color: rgba(237, 209, 129, 1);
`

const Pill = styled('div')`
	padding: 3px 6px;
	display: inline-block;
	border-radius: 25px;
	background: rgba(165, 255, 144, 1);
	box-sizing: border-box;
	font-size: 12px;
	color: rgba(26, 30, 32, 1);
`

const RecentAppointmentOverview = ({ appointment, history }) => {
	return (
		<Container>
			<div className="block">
				<h1 style={{ marginBottom: 7 }}>
					{isToday(appointment.startTime) ? 'Today' : format(appointment.startTime, 'MMMM Do')} at{' '}
					{format(appointment.startTime, 'h:mma')}
				</h1>
				<Pill>Confirmed</Pill>
			</div>

			<div className="block">
				<h3>{appointment.location.name}</h3>
				<p>{appointment.location.address}</p>
			</div>
			<div className="block flex">
				<div>
					<h3>{appointment.services[0].name}</h3>
				</div>

				<h3>${appointment.services[0].price}</h3>
			</div>
			<div className="block times">
				<div className="flex">
					<div>
						<p>Start Time</p>
						<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 40 }}>{format(appointment.startTime, 'h:mma')}</h1>
					</div>

					<FiArrowRight size="28" />

					<div>
						<p>End Time</p>
						<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 40 }}>{format(appointment.endTime, 'h:mma')}</h1>
					</div>
				</div>
			</div>

			<FormFooter style={{ paddingBottom: 24 }}>
				<span />
				<Link onClick={() => history.push(`/book/l/${appointment.location.uuid}`)}>Checkin again</Link>
				<span />
			</FormFooter>
		</Container>
	)
}

export default RecentAppointmentOverview
