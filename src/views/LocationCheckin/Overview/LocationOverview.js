import React from 'react'
import styled from 'styled-components'
import EmployeeList from '../EmployeeList'
import { FiChevronLeft } from 'react-icons/fi'
import WorkingHour from './WorkingHour'
import format from 'date-fns/format'

const Header = styled('div')`
	width: 100%;
	padding: 24px 20px;
	margin-bottom: 24px;

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

const LocationTable = styled('div')`
	padding: 0 20px;
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

			{hasEmployees && (
				<h4 data-cy="employee-list" style={{ marginBottom: 10, paddingLeft: 20, letterSpacing: 1, opacity: 0.5 }}>
					AVAILABLE STAFF
				</h4>
			)}
			{hasEmployees && <EmployeeList employees={employees} />}
	
			{!hasEmployees && (
				<Placeholder>
					<div className="title">{location.name}</div>
					No available staff at this location.
				</Placeholder>
			)}

			<h4
				style={{
					paddingTop: 16,
					margin: '24px 10px 10px 10px',
					paddingLeft: 10,
					letterSpacing: 1,
					opacity: 0.5
				}}
			>
				LOCATION HOURS
			</h4>

			<LocationTable>
				{Object.keys(location.working_hours).map(day => {
					if (day === '__typename') return null

					return <WorkingHour isToday={day === todaysName} key={day} day={day} details={location.working_hours[day]} />
				})}
			</LocationTable>
		</div>
	)
}

export default LocationOverview
