import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import Employee from './Employee/Employee'

const Wrapper = styled('div')`
	height: 100%;
	margin-top: 50px;
	padding: 10px;
`

const EmployeeList = ({ employees, match, history }) => {
	return (
		<Wrapper>
			{employees.map(employee => (
				<Employee
					employee={employee}
					key={employee.id}
					onClick={() => {
						history.push(`${match.url}/sign-in/${employee.id}`)
					}}
				/>
			))}
		</Wrapper>
	)
}

export default withRouter(EmployeeList)
