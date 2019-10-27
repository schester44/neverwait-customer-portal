import React from 'react'
import format from 'date-fns/format'
import addMinutes from 'date-fns/add_minutes'
import isAfter from 'date-fns/is_after'

import { dateFromMinutes } from '../Employee/utils/isWorking'

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
