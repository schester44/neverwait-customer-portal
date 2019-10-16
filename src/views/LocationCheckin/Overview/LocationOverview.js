import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { darken } from 'polished'

import EmployeeList from '../EmployeeList'
import { FiChevronLeft, FiCalendar, FiUser } from 'react-icons/fi'
import WorkingHour from './WorkingHour'
import ClosingSoon from './ClosingSoon'

import format from 'date-fns/format'

const headerSlideDown = keyframes`
	from {
		transform: translateY(-120px);
	}
	to {
		transform: translateY(0px);
	}
`

const Header = styled('div')`
	min-height: 100px;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 999;
	animation: ${headerSlideDown} 0.4s ease forwards;

	.back {
		cursor: pointer;
		position: absolute;
		top: 16px;
		left: 10px;
		font-size: 36px;
		line-height: 1;
		z-index: 999;
		color: white;
	}

	.location {
		margin-bottom: 16px;
		padding-bottom: 16px;
		padding-left: 52px;
		padding-top: 16px;

		color: white;

		h3 {
			line-height: 1.5;
		}

		.sub {
			font-size: 10px;
			text-transform: uppercase;
			font-weight: 700;
			opacity: 0.8;
			line-height: 1.5;
		}
	}

	${({ theme }) => css`
		background-image: linear-gradient(${theme.colors.brand}, ${darken(0.05, theme.colors.brand)});
	`};

	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 20px));
`

const slideIn = keyframes`
	from {
		transform: translateY(-100vh);
	}
	to {
		transform: translateY(0vh);
		opacity: 1;
	}
`

const Contents = styled('div')`
	opacity: 0;
	transform: translateY(-100vw);
	animation: ${slideIn} 0.5s ease forwards;
`

const Card = styled('div')`
	margin: 24px 10px 0 10px;
	padding: 10px;
	border-radius: 8px;

	.title {
		font-size: 12px;
		font-weight: 700;
		padding-top: 5px;
		padding-bottom: 15px;
		opacity: 0.7;
	}
`

const Placeholder = styled('div')`
	max-width: 80%;
	margin: 0 auto;
	text-align: center;

	.title {
		color: rgba(237, 209, 129, 1);
	}
`

const LocationOverview = ({ history, employees, location }) => {
	const hasEmployees = employees.length > 0
	const todaysName = format(new Date(), 'dddd').toLowerCase()

	return (
		<div style={{ width: '100%', height: '100%', paddingTop: 90 }}>
			<Header>
				<div
					className="back"
					onClick={() => {
						history.push(history.location.state?.from || '/')
					}}
				>
					<FiChevronLeft />
				</div>

				{hasEmployees && (
					<div className="location">
						<h3>{location.name}</h3>
						<p className="sub">{location.address}</p>
						<p className="sub">{location.contactNumber}</p>
					</div>
				)}
			</Header>

			<Contents>
				<ClosingSoon today={location.working_hours[todaysName]} />

				<Card>
					<p className="title">
						<FiUser style={{ marginRight: 4 }} />
						AVAILABLE STAFF
					</p>

					{hasEmployees && <EmployeeList location={location} employees={employees} />}
				</Card>

				{!hasEmployees && (
					<Placeholder>
						<div className="title">{location.name}</div>
						No available staff at this location.
					</Placeholder>
				)}

				<Card>
					<p className="title">
						<FiCalendar style={{ marginRight: 4 }} />
						LOCATION HOURS
					</p>

					<div style={{ background: 'white', borderRadius: 10, padding: 10 }}>
						{Object.keys(location.working_hours).map(day => {
							if (day === '__typename') return null

							return (
								<WorkingHour isToday={day === todaysName} key={day} day={day} details={location.working_hours[day]} />
							)
						})}
					</div>
				</Card>
			</Contents>
		</div>
	)
}

export default LocationOverview
