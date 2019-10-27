import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Employee from './Employee/Employee'

const EmployeeList = ({ employees }) => {
	const history = useHistory()
	const match = useRouteMatch()

	return (
		<div>
			{employees.map(employee => {
				// Don't render an employee if they don't have services because clicking on them wont allow the user to do anything. The employee needs services to be bookable.
				if (employee.services.length === 0) return null

				return (
					<Employee
						employee={employee}
						key={employee.id}
						onClick={() => {
							history.push(`${match.url}/sign-in/${employee.id}`)
						}}
					/>
				)
			})}
		</div>
	)
}

export default EmployeeList
