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
	background: rgba(101, 211, 110, 1.0);
	box-sizing: border-box;
	font-size: 10px;
	color: white;
	font-weight: 700;
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
