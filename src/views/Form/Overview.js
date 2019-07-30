import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { format } from 'date-fns'
import { FiCheck } from 'react-icons/fi'

import Button from '../../components/Button'

const Timer = styled('div')`
	position: absolute;
	top: 10px;
	right: 10px;
`

const formattedTime = time => {
	let minutes = 0

	if (time > 60) {
		minutes = Math.floor(time / 60)
	}

	minutes = minutes >= 10 ? minutes : `0${minutes}`

	return `${minutes}:${time % 60}`
}

const useTimer = duration => {
	const [time, setTime] = React.useState(duration)

	React.useState(() => {
		const handler = () => {
			setTime(prev => {
				if (prev - 1 < 0) {
					window.clearInterval(int)
					return prev
				}

				return prev - 1
			})
		}

		const int = window.setInterval(handler, 1000)

		return () => window.clearInterval(int)
	}, [])

	return formattedTime(time)
}

const Wrapper = styled('div')`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 10px;

	.estimated-time {
		margin-bottom: 50px;
		color: white;

		span {
			color: red;
		}
	}
`
const Content = styled('div')`
	position: relative;
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	text-align: center;
	padding-top: 50px;

	h1,
	h2,
	h3,
	h4 {
		line-height: 1.5;
	}

	h1 {
		margin-bottom: 50px;
		font-size: 26px;
	}

	h3 {
		font-size: 18px;
	}
`

const Overview = ({ estimates }) => {
	const time = useTimer(120)

	return (
		<Wrapper>
			<Timer>{time}</Timer>

			<Content>
				<h1>Review and confirm</h1>

				<h3 style={{ fontSize: 16 }}>You can expect to be in the chair around:</h3>

				<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 60 }}>{format(estimates.startTime, 'h:mma')}</h1>

				<h4 style={{ opactiy: 0.5, fontWeight: 100 }}>
					The above time is only an estimate and may change by the time you click Confirm. You must click confirm to
					create an appointment.
				</h4>
			</Content>
		</Wrapper>
	)
}

export default Overview
