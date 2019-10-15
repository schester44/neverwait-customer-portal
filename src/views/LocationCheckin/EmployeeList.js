import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Employee from './Employee/Employee'

const EmployeeList = ({ employees, location }) => {
	const history = useHistory()
	const match = useRouteMatch()

	return (
		<div>
			{employees.map(employee => (
				<Employee
					location={location}
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

export default EmployeeList
