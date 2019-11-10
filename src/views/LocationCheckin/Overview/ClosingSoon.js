import React from 'react'

import { addMinutes, format, isAfter } from 'date-fns'

import { dateFromMinutes } from '../../../helpers/date-from'

const ClosingSoon = ({ today }) => {
	if (!today || !today.open) return null

	const closingTime = dateFromMinutes(today.endTime)

	if (!isAfter(addMinutes(new Date(), 45), closingTime) || isAfter(new Date(), closingTime)) return null

	return (
		<div
			style={{
				textTransform: 'uppercase',
				margin: '0px 10px',
				background: 'rgba(236, 90, 87, 1.0)',
				padding: 5,
				borderRadius: 4,
				fontSize: 12,
				textAlign: 'center',
				color: '#fff',
				fontWeight: 700
			}}
		>
			This location is closing soon ({format(closingTime, 'h:mma')})
		</div>
	)
}

export default ClosingSoon
