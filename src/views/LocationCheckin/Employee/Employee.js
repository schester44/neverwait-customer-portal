import React from 'react'

import { FiCheck, FiX } from 'react-icons/fi'
import Container from './Container'

import addMinutes from 'date-fns/add_minutes'
import format from 'date-fns/format'

import { dateFromTimeString } from './utils/isWorking'

const renderStatus = status => (
	<span className="small-sub-text" style={{ opacity: 0.5 }}>
		{status}
	</span>
)

const getAvailableSources = (shift, options = {}) => {
	if (!shift) return null
	
	let sources = []


	if (shift.acceptingAppointments) {
		if (!options.exclude?.includes('appointments')) {
			sources.push('Appointments')
		}
	}

	if (shift.acceptingCheckins) {
		if (!options.exclude?.includes('checkins')) {
			sources.push('Check-ins')
		}
	}

	if (shift.acceptingWalkins) {
		if (!options.exclude?.includes('walkins')) {
			sources.push('Walk-ins')
		}
	}

	if (!sources.length) return false

	if (sources.length === 1) return sources[0]
	if (sources.length === 2) return sources.join(' & ')

	const last = sources.pop()

	return `${sources.join(', ')} & ${last}`
}

const WaitTime = ({ status, currentWait }) => {
	if (!status.working) {
		if (!status.nextShift) {
			return renderStatus('Not working right now')
		}

		const sources = getAvailableSources(status.nextShift)

		if (!sources) return renderStatus('Not working right now')

		return (
			<div className="small-sub-text" style={{ opacity: 0.5 }}>
				{sources} start at {format(dateFromTimeString(status.nextShift.start_time, new Date()), 'h:mma')}
			</div>
		)
	}

	if (!status.currentShift) return renderStatus('Fully booked today')

	const {
		acceptingAppointments: appointments,
		acceptingCheckins: checkins,
		acceptingWalkins: walkins
	} = status.currentShift

	if (appointments && !checkins && !walkins) {
		const sources = getAvailableSources(status.nextShift, { exclude: ['appointments'] })

		return (
			<div className="small-sub-text">
				<span>Appointments only right now.</span>
				{sources && (
					<div className="small-sub-text" style={{ opacity: 0.5 }}>
						{sources} start at {format(dateFromTimeString(status.nextShift.start_time, new Date()), 'h:mma')}
					</div>
				)}
			</div>
		)
	}

	if (checkins && !appointments && !walkins) {
		const sources = getAvailableSources(status.nextShift, { exclude: ['checkins'] })

		return (
			<div className="small-sub-text">
				<span>Online Check-ins only right now.</span>
				{sources && (
					<div className="small-sub-text" style={{ opacity: 0.5 }}>
						{sources} start at {format(dateFromTimeString(status.nextShift.start_time, new Date()), 'h:mma')}
					</div>
				)}
			</div>
		)
	}

	if (walkins && !checkins && !appointments) {
		const sources = getAvailableSources(status.nextShift, { exclude: ['walkins'] })

		return (
			<div className="small-sub-text">
				<span>Walk-ins only right now.</span>
				{sources && (
					<div className="small-sub-text" style={{ opacity: 0.5 }}>
						{sources} start at {format(dateFromTimeString(status.nextShift.start_time, new Date()), 'h:mma')}
					</div>
				)}
			</div>
		)
	}

	if (!checkins && !appointments && !walkins) {
		// Not accepting anything
		if (!status.nextShift) return renderStatus('Currently unavailable.')

		return WaitTime({ status: { working: false, nextShift: status.nextShift } })
	}

	return (
		<div className="wait-time">
			<p className="accepts small-sub-text">
				{appointments ? (
					<FiCheck style={{ marginRight: 4 }} color="rgba(121, 189, 157, 1.0)" />
				) : (
					<FiX style={{ marginRight: 4 }} color="rgba(206, 48, 37, 1.0)" />
				)}
				Appointments
			</p>

			<p className="accepts small-sub-text">
				{checkins ? (
					<FiCheck style={{ marginRight: 4 }} color="rgba(121, 189, 157, 1.0)" />
				) : (
					<FiX style={{ marginRight: 4 }} color="rgba(206, 48, 37, 1.0)" />
				)}
				Online Check-ins
			</p>
			<p className="accepts small-sub-text">
				{walkins ? (
					<FiCheck style={{ marginRight: 4 }} color="rgba(121, 189, 157, 1.0)" />
				) : (
					<FiX style={{ marginRight: 4 }} color="rgba(206, 48, 37, 1.0)" />
				)}
				Walk-ins
				{walkins && (
					<>
						{currentWait < 10 ? (
							<span> (Currently no wait)</span>
						) : (
							<span style={{ marginLeft: 4, opacity: 0.5 }}>
								(Next Available Time: {format(addMinutes(new Date(), currentWait), 'h:mma')})
							</span>
						)}
					</>
				)}
			</p>
		</div>
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
						<span>SELECT</span>
					</button>
				</div>
			</div>

			<div className="status">
				<WaitTime status={employee.status} currentWait={employee.waitTime} />
			</div>
		</Container>
	)
}

export default Employee
