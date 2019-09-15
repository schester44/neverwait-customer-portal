import React from 'react'
import styled from 'styled-components'
import EmployeeList from '../EmployeeList'
import { FiChevronLeft, FiCalendar, FiUser } from 'react-icons/fi'
import WorkingHour from './WorkingHour'
import ClosingSoon from './ClosingSoon'

import format from 'date-fns/format'

const Header = styled('div')`
	width: 100%;
	padding: 24px 20px;
	margin-bottom: 24px;
	background: ${({ theme }) => theme.colors.secondaryHeaderBg};

	.header-title {
		color: rgba(237, 209, 129, 1);
	}

	.back {
		position: relative;
		font-size: 36px;
		line-height: 1;
		padding-right: 16px;
		cursor: pointer;
	}
`

const Card = styled('div')`
	margin: 24px 10px 0 10px;
	padding: 10px;
	border-radius: 8px;
	background: ${({ theme }) => theme.colors.primaryCardBg};

	h4.title {
		padding-bottom: 10px;
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

const LocationOverview = ({ isClosed, history, profileId, employees, location }) => {
	const hasEmployees = employees.length > 0
	const todaysName = format(new Date(), 'dddd').toLowerCase()

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Header>
				{profileId && (
					<div
						className="back"
						onClick={() => {
							history.push('/')
						}}
					>
						<FiChevronLeft />
					</div>
				)}

				{hasEmployees && (
					<>
						<h1 className="header-title">{location.name}</h1>
						<h3>{location.address}</h3>
					</>
				)}
			</Header>

			<ClosingSoon today={location.working_hours[todaysName]} />

			<Card>
				<h4 className="title">
					<FiUser style={{ marginRight: 4 }} />
					AVAILABLE STAFF
				</h4>

				{hasEmployees && <EmployeeList employees={employees} />}
			</Card>

			{!hasEmployees && (
				<Placeholder>
					<div className="title">{location.name}</div>
					No available staff at this location.
				</Placeholder>
			)}

			<Card>
				<h4 className="title">
					<FiCalendar style={{ marginRight: 4 }} />
					LOCATION HOURS
				</h4>

				{Object.keys(location.working_hours).map(day => {
					if (day === '__typename') return null

					return <WorkingHour isToday={day === todaysName} key={day} day={day} details={location.working_hours[day]} />
				})}
			</Card>
		</div>
	)
}

export default LocationOverview
