import React from 'react'
import Container from './Container'
import { FiChevronRight } from 'react-icons/fi'
import timeFragmentsFromMinutes from './utils/timeFragments'
import { useWaitTime } from '../../../graphql/hooks'

const debug = require('debug')('app:employee')

const WaitTime = ({ currentWait }) => {
	const time = timeFragmentsFromMinutes(currentWait)

	return currentWait < 5 ? (
		<h4>No Wait</h4>
	) : (
		<h4>
			Current Wait:{' '}
			{time.hours > 0 ? (
				<span>
					{time.hours}
					<span className="small"> hr{time.hours > 1 && 's'}</span> {time.minutes}
					<span className="small"> minutes</span>
				</span>
			) : (
				<span>
					{time.minutes} <span className="small">minutes</span>
				</span>
			)}
		</h4>
	)
}

const Employee = ({ employee, onClick }) => {
	const waitTime = useWaitTime(employee)

	debug(employee.firstName, 'wait time:', waitTime)

	return (
		<Container onClick={onClick}>
			<div>
				<h1>{employee.firstName}</h1>
				{waitTime === undefined ? null : <WaitTime currentWait={waitTime} />}
			</div>

			<div className="right">
				<button>
					<FiChevronRight />
				</button>
			</div>
		</Container>
	)
}

export default Employee
