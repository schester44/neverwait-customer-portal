import React from 'react'
import styled from 'styled-components'
import isToday from 'date-fns/is_today'
import format from 'date-fns/format'
import isAfter from 'date-fns/is_after'
import { FiArrowLeft } from 'react-icons/fi'

const Container = styled('div')`
	position: relative;

	.back {
		position: absolute;
		font-size: 36px;
		line-height: 1;
		left: 10px;
		top: 6px;
	}

	.date {
		padding-top: 4px;
		font-size: 14px;
		font-weight: 700;
		opacity: 0.6;
	}
`

const styles = ({ theme }) => `
	color: ${theme.colors.bodyBg};
	background: ${theme.colors.brand};
	border-radius: ${theme.borderRadius.large};
`

const Pill = styled('div')`
	padding: 3px 6px;
	margin-top: 5px;
	display: inline-block;
	box-sizing: border-box;
	font-size: 12px;
	${styles};
`

const Overview = ({ info, onBack }) => {
	return (
		<Container>
			<div className="back" onClick={onBack}>
				<FiArrowLeft />
			</div>

			{info.time && (
				<div className="date">
					{isToday(info.time) ? 'Today' : format(info.time, 'MMMM Do')} at {format(info.time, 'h:mma')}
				</div>
			)}
			<Pill>{isAfter(new Date(), new Date(info.time)) ? 'Completed' : 'Confirmed'}</Pill>
		</Container>
	)
}

export default Overview
