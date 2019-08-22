import React from 'react'
import addMinutes from 'date-fns/add_minutes'
import { FiChevronRight } from 'react-icons/fi'
import Container from './Container'
import timeFragmentsFromMinutes from './utils/timeFragments'
import { useWaitTime } from '../../../graphql/hooks'
import isWorking from './utils/isWorking'
import Modal from '../../Auth/Modal'

const WaitTime = ({ status, currentWait }) => {
	const time = timeFragmentsFromMinutes(currentWait)

	if (!status.working) return 'Currently Closed'

	if (!status.canSchedule) return status.reason || 'Unavailable'

	return currentWait < 15 ? (
		'No Wait'
	) : (
		<span>
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
		</span>
	)
}

const Employee = ({ employee, onClick }) => {
	const waitTime = useWaitTime(employee)

	const status = React.useMemo(() => isWorking(employee, addMinutes(new Date(), waitTime || 0)), [employee, waitTime])

	const [show, set] = React.useState(false)

	const handleClick = e => {
		if (status.working && status.canSchedule) {
			if (waitTime >= 15) {
				onClick(e)
			} else {
				set(true)
			}
		}
	}

	return (
		<>
			{show && (
				<Modal title="Great News!" onClose={() => set(false)}>
					<h3 style={{ textAlign: 'center' }}>There is no need to checkin because there is no wait!</h3>
				</Modal>
			)}
			<Container working={status.working} canSchedule={status.canSchedule} onClick={handleClick}>
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
