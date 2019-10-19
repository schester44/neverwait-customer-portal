import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Employee from './Employee/Employee'

const EmployeeList = ({ employees, setNoWaitModal }) => {
	const history = useHistory()
	const match = useRouteMatch()

	return (
		<div>
			{employees.map(employee => (
				<Employee
					setNoWaitModal={setNoWaitModal}
					employee={employee}
					key={employee.id}
					onClick={() => {
						history.push(`${match.url}/sign-in/${employee.id}`)
					}}
				/>
			))}
		</div>
	)
}

export default EmployeeList
