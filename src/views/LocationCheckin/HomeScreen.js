import React from 'react'
import styled from 'styled-components'
import EmployeeList from './EmployeeList'
import { FiChevronLeft } from 'react-icons/fi'

const Header = styled('div')`
	display: flex;
	width: 100%;
	align-items: center;
	padding: 24px auto;
	padding: 10px 5px;
	font-size: 90%;

	.back {
		position: relative;
		top: 3px;
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

				<div>
					<h1>{locationName}</h1>
				</div>
			</Header>

			<EmployeeList employees={employees} />
		</div>
	)
}

export default HomeScreen
