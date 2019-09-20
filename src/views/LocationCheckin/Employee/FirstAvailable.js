import React from 'react'
import ReactGA from 'react-ga'
import format from 'date-fns/format'
import addMinutes from 'date-fns/add_minutes'

import { FiChevronRight, FiTarget, FiWatch } from 'react-icons/fi'
import Container from './Container'

const Employee = ({ nextAvailableTime, onClick }) => {
	const handleClick = () => {
		ReactGA.event({
			category: 'Check-in Form',
			action: 'Selected',
			label: 'FirstAvailable'
		})

		onClick()
	}

    console.log(nextAvailableTime);
	return (
		<>
			<Container canSchedule={true} onClick={e => handleClick()}>
				<div>
					<h1 style={{ fontSize: '100%', color: 'rgba(233, 209, 140, 1.0)' }}>
						<FiWatch style={{ marginRight: 5 }} />
						First Available
					</h1>

					<p style={{ fontSize: '80%' }}>
						<span>
							<span style={{ opacity: 0.5 }}>Next Available Time:</span>
							<span> {format(addMinutes(new Date(), nextAvailableTime), 'h:mma')}</span>
						</span>
					</p>
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
