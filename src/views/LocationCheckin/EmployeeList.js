import React from 'react'
import { withRouter } from 'react-router-dom'
import Employee from './Employee/Employee'

const EmployeeList = ({ employees, match, history }) => {
	return (
		<div>
			{employees.map(employee => (
				<Employee
					employee={employee}
					key={employee.id}
					onClick={status => {
						history.push(`${match.url}/sign-in/${employee.id}`, { status })
					}}
				/>
			))}
		</div>
	)
}

export default withRouter(EmployeeList)
