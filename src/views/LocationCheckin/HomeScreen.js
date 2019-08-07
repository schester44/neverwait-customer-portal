import React from 'react'
import styled from 'styled-components'
import EmployeeList from '../../components/EmployeeList'

const Header = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	font-family: marguerite;
	padding: 24px auto;
	color: rgba(237, 209, 129, 1);
`

const HomeScreen = ({ employees, locationName }) => {
	return (
		<div style={{ width: '100%' }}>
			<Header>
				<h1>{locationName}</h1>
			</Header>
			<EmployeeList employees={employees} />
		</div>
	)
}

export default HomeScreen
