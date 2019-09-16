import React from 'react'
import { format, addMinutes, isAfter } from 'date-fns'
import { dateFromMinutes } from '../Employee/utils/isWorking'

const ClosingSoon = ({ today }) => {
	if (!today || !today.open) return null

	const closingTime = dateFromMinutes(today.endTime)

	if (!isAfter(addMinutes(new Date(), 45), closingTime) || isAfter(new Date(), closingTime)) return null

	return (
		<div
			style={{
				margin: '0px 20px',
				background: 'tomato',
				padding: 10,
				color: '#000',
				borderRadius: 4,
				fontSize: 12
			}}
		>
			This location is closing soon ({format(closingTime, 'h:mma')})
		</div>
	)
}

export default ClosingSoon
