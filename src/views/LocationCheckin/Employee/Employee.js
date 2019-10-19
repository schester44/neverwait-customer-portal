import React from 'react'

import { FiChevronRight } from 'react-icons/fi'
import Container from './Container'

import addMinutes from 'date-fns/add_minutes'
import format from 'date-fns/format'

const renderStatus = status => <span style={{ opacity: 0.5 }}>{status}</span>

const WaitTime = ({ status, currentWait }) => {
	if (!status.working) return renderStatus('Not working right now')

	if (!status.canSchedule) {
		if (status.reasonFatal) return <span style={{ color: 'tomato' }}>{status.reason}</span>

		return renderStatus(status.reason || 'Unavailable')
	}

	if (currentWait < 10) return renderStatus('Currently no wait')

	return (
		<span>
			<span style={{ opacity: 0.5 }}>Next Available Time:</span>
			<span> {format(addMinutes(new Date(), currentWait), 'h:mma')}</span>
		</span>
	)
}

const Employee = ({ employee, onClick }) => {
	return (
		<Container onClick={onClick}>
			<div className="main">
				<div>
					<h1>{employee.firstName}</h1>
				</div>

				<div className="right">
					<button>
						Book <FiChevronRight />
					</button>
				</div>
			</div>
			<div className="status">
				<p className="small-sub-text">
					{employee.waitTime === undefined ? null : (
						<WaitTime status={employee.status} currentWait={employee.waitTime} />
					)}
				</p>
			</div>
		</Container>
	)
}

export default Employee
