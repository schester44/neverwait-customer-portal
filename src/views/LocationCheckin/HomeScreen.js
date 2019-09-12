import React from 'react'
import styled from 'styled-components'
import EmployeeList from './EmployeeList'
import { FiChevronLeft } from 'react-icons/fi'

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

const Placeholder = styled('div')`
	max-width: 80%;
	margin: 0 auto;
	text-align: center;

	.title {
		color: rgba(237, 209, 129, 1);
	}
`

const HomeScreen = ({ history, profileId, employees, location }) => {
	const hasEmployees = employees.length > 0

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
				<h4 data-cy="employee-list" style={{ marginBottom: 10, paddingLeft: 20, letterSpacing: 3, opacity: 0.5 }}>
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
		</div>
	)
}

export default HomeScreen
