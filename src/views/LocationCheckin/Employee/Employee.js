import React from 'react'
import ReactGA from 'react-ga'

import { FiChevronRight } from 'react-icons/fi'
import Container from './Container'
import { useWaitTime } from '../../../graphql/hooks'

import addMinutes from 'date-fns/add_minutes'
import format from 'date-fns/format'
import Button from '../../../components/Button'

const WaitTime = ({ status, currentWait }) => {
	if (!status.working) return 'Not working right now'

	if (!status.canSchedule) return status.reason || 'Unavailable'

	if (currentWait < 10) return <span>Currently no wait</span>

	return (
		<span>
			<span style={{ opacity: 0.5 }}>Next Available Time:</span>
			<span> {format(addMinutes(new Date(), currentWait), 'h:mma')}</span>
		</span>
	)
}

const Employee = ({ employee, location, onClick }) => {
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
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100vh',
						zIndex: 999,
						paddingBottom: 80,
						background: 'rgba(245, 247, 251, 1.0)',
						lineHeight: 1.5,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<h1 style={{ lineHeight: 1, margin: '0 auto', textAlign: 'center', maxWidth: '80%' }}>
						The line isn't long so there's no need to check in with {employee.firstName}.
					</h1>

					<p style={{ opacity: 0.8, lineHeight: 1.5, margin: '25px auto', textAlign: 'center', maxWidth: '80%' }}>
						Act fast since the wait time can change by the time you get to {location.name}. There's no guarantee that
						there won't be a line by the time you get there.
					</p>

					<Button  onClick={() => set(false)} style={{ maxWidth: 200, margin25: 50 }}>Go Back</Button>
				</div>
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
