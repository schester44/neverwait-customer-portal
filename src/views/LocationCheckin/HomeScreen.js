import React from 'react'
import styled from 'styled-components'
import EmployeeList from './EmployeeList'
import { FiChevronLeft } from 'react-icons/fi'

const Header = styled('div')`
	width: 100%;
	padding: 24px auto;
	padding: 10px 5px;
	font-size: 90%;

	span,
	.header-title {
		padding-left: 10px;
	}

	.back {
		padding-left: 10px;
		position: relative;
		font-size: 36px;
		line-height: 1;
		padding-right: 16px;
	}
`

const HomeScreen = ({ history, customerId, employees, locationName }) => {
	return (
		<div style={{ width: '100%' }}>
			<Header>
				{customerId && (
					<div
						className="back"
						onClick={() => {
							history.push('/')
						}}
					>
						<FiChevronLeft />
					</div>
				)}

				<h1 className="header-title">{locationName}</h1>
				<span>Select a staff member</span>
			</Header>

			<EmployeeList employees={employees} />
		</div>
	)
}

export default HomeScreen
