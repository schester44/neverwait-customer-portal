import React from 'react'
import styled from 'styled-components'
import isToday from 'date-fns/is_today'
import format from 'date-fns/format'

const Container = styled('div')``

const Pill = styled('div')`
	padding: 3px 6px;
	margin-top: 10px;
	display: inline-block;
	border-radius: 25px;
	background: rgba(165, 255, 144, 1);
	box-sizing: border-box;
	font-size: 12px;
	color: rgba(26, 30, 32, 1);
`

const Overview = ({ start }) => {
	return (
		<Container>
			{start && (
				<h3 className="subtitle">
					{isToday(start) ? 'Today' : format(start, 'MMMM Do')} at {format(start, 'h:mma')}
				</h3>
			)}
			<Pill>Confirmed</Pill>
		</Container>
	)
}

export default Overview
