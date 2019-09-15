import React from 'react'
import { startOfDay, format, addMinutes, isAfter } from 'date-fns'

const ClosingSoon = ({ today }) => {
	if (!today || !today.open) return null

	const closingTime = addMinutes(startOfDay(new Date()), today.endTime)

	if (!isAfter(addMinutes(new Date(), 45), closingTime)) return null

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
