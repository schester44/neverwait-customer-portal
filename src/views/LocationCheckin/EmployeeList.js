import React from 'react'
import { withRouter } from 'react-router-dom'
import Employee from './Employee/Employee'
import FirstAvailable from './Employee/FirstAvailable'
import { useWaitTime } from '../../graphql/hooks'

const EmployeeList = ({ employees, match, history }) => {
	const { status, waitTime, employeesWorkingCount, nextAvailableTime } = useWaitTime(employees)

	const handleFirstAvailable = () => {}

	console.log(nextAvailableTime);
	return (
		<div>
			{employeesWorkingCount >= 1 && (
				<FirstAvailable nextAvailableTime={nextAvailableTime.time} onClick={handleFirstAvailable} />
			)}

			{employees.map(employee => (
				<Employee
					employee={employee}
					key={employee.id}
					waitTime={waitTime[employee.id]}
					status={status[employee.id]}
					onClick={status => {
						history.push(`${match.url}/sign-in/${employee.id}`, { status })
					}}
				/>
			))}
		</div>
	)
}

export default withRouter(EmployeeList)
