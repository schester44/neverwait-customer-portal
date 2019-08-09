import React from 'react'
import Container from './Container'
import { FiChevronRight } from 'react-icons/fi'
import timeFragmentsFromMinutes from './utils/timeFragments'
import { useWaitTime } from '../../../graphql/hooks'
import isWorking from './utils/isWorking'
import Modal from '../../Auth/Modal'

const WaitTime = ({ canSchedule, currentWait }) => {
	const time = timeFragmentsFromMinutes(currentWait)

	if (!canSchedule) return 'Not Working'

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
	const canSchedule = React.useMemo(() => isWorking(employee, new Date()), [employee])
	const [show, set] = React.useState(false)

	const handleClick = e => {
		if (canSchedule) {
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
			<Container noHover={!canSchedule} onClick={handleClick}>
				<div>
					<h1>{employee.firstName}</h1>

					<p>{waitTime === undefined ? null : <WaitTime canSchedule={canSchedule} currentWait={waitTime} />}</p>
				</div>

				<div className="right">
					<button>
						<FiChevronRight />
					</button>
				</div>
			</Container>
		</>
	)
}

export default Employee
