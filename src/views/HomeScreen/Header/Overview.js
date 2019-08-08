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

const styles = ({ theme }) => `
	color: ${theme.colors.bodyBg};
	background: ${theme.colors.success};
	border-radius: ${theme.borderRadius.large};
`

const Pill = styled('div')`
	padding: 3px 6px;
	margin-top: 10px;
	display: inline-block;
	box-sizing: border-box;
	font-size: 10px;
	font-weight: 700;
	${styles};
`

const Overview = ({ info, onBack }) => {
	return (
		<Container>
			<div className="back" onClick={onBack}>
				<FiChevronLeft />
			</div>

			{info.time && (
				<h3 className="subtitle">
					{isToday(info.time) ? 'Today' : format(info.time, 'MMMM Do')} at {format(info.time, 'h:mma')}
				</h3>
			)}
			<Pill>Confirmed</Pill>
		</Container>
	)
}

export default Overview
