import React from 'react'
import ReactGA from 'react-ga'

import { FiChevronRight } from 'react-icons/fi'
import Container from './Container'

import addMinutes from 'date-fns/add_minutes'
import format from 'date-fns/format'

const WaitTime = ({ status, currentWait }) => {
	if (!status.working) return 'Not working right now'

	if (!status.canSchedule) {
		if (status.reasonFatal) return <span style={{ color: 'tomato' }}>{status.reason}</span>

		return status.reason || 'Unavailable'
	}
	
	if (currentWait < 10) return <span>Currently no wait</span>

	return (
		<span>
			<span style={{ opacity: 0.5 }}>Next Available Time:</span>
			<span> {format(addMinutes(new Date(), currentWait), 'h:mma')}</span>
		</span>
	)
}

const Employee = ({ employee, setNoWaitModal, onClick }) => {
	const handleClick = e => {

		// if (!employee.status.working || !employee.status.canSchedule) return

		// if (employee.waitTime >= 15) {
		// 	ReactGA.event({
		// 		category: 'Check-in Form',
		// 		action: 'Selected',
		// 		label: 'Employee',
		// 		value: Number(employee.id)
		// 	})

			onClick(e)
		// } else {
		// 	setNoWaitModal(true)
		// }
	}

	if (!employee.status.working) return null

	return (
		<Container canSchedule={employee.status.canSchedule} onClick={e => handleClick(employee.status)}>
			<div>
				<h1>{employee.firstName}</h1>

				<p>
					{employee.waitTime === undefined ? null : (
						<WaitTime status={employee.status} currentWait={employee.waitTime} />
					)}
				</p>
			</div>

			{employee.status.canSchedule && (
				<div className="right">
					<button>
						<FiChevronRight />
					</button>
				</div>
			)}
		</Container>
	)
}

export default Employee
