import React from 'react'
import styled from 'styled-components'
import isToday from 'date-fns/is_today'
import format from 'date-fns/format'
import { FiChevronLeft } from 'react-icons/fi'

const Container = styled('div')`
	position: relative;

	.back {
		position: absolute;
		font-size: 36px;
		line-height: 1;
		left: 10px;
		top: 10px;
	}
`

const Pill = styled('div')`
	padding: 3px 6px;
	margin-top: 10px;
	display: inline-block;
	border-radius: 25px;
	background: rgba(101, 211, 110, 1);
	box-sizing: border-box;
	font-size: 10px;
	color: white;
	font-weight: 700;
`

const Overview = ({ start, onBack }) => {
	return (
		<Container>
			<div className="back" onClick={onBack}>
				<FiChevronLeft />
			</div>

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
