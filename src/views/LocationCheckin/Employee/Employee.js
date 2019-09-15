import React from 'react'
import ReactGA from 'react-ga'

import { FiChevronRight } from 'react-icons/fi'
import Container from './Container'
import timeFragmentsFromMinutes from './utils/timeFragments'
import { useWaitTime } from '../../../graphql/hooks'

import Modal from '../../Auth/Modal'

const WaitTime = ({ status, currentWait }) => {
	const time = timeFragmentsFromMinutes(currentWait)

	if (!status.working) return 'Not working right now'

	if (!status.canSchedule) return status.reason || 'Unavailable'

	return currentWait < 15 ? (
		'No Wait'
	) : (
		<span>
			Live Wait Time:{' '}
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
		</span>
	)
}

const Employee = ({ employee, onClick }) => {
	const { status, waitTime } = useWaitTime(employee)

	const [show, set] = React.useState(false)

	const handleClick = e => {
		if (status.working && status.canSchedule) {
			if (waitTime >= 15) {
				ReactGA.event({
					category: 'Check-in Form',
					action: 'Selected',
					label: 'Employee',
					value: Number(employee.id)
				})

				onClick(e)
			} else {
				set(true)
			}
		}
	}

	if (!status.working) return null

	return (
		<>
			{show && (
				<Modal title="Great News!" onClose={() => set(false)}>
					<h3 style={{ textAlign: 'center' }}>There is no need to checkin because there is no wait!</h3>
				</Modal>
			)}
			<Container canSchedule={status.canSchedule} onClick={e => handleClick(status)}>
				<div>
					<h1>{employee.firstName}</h1>

					<p>{waitTime === undefined ? null : <WaitTime status={status} currentWait={waitTime} />}</p>
				</div>

				{status.canSchedule && (
					<div className="right">
						<button>
							<FiChevronRight />
						</button>
					</div>
				)}
			</Container>
		</>
	)
}

export default Employee
