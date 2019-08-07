import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

import Button from '../../components/Button'
import FormFooter from '../../components/FormFooter'

const formattedTime = time => {
	let minutes = 0

	if (time > 60) {
		minutes = Math.floor(time / 60)
	}

	minutes = minutes >= 10 ? minutes : `0${minutes}`

	let seconds = time % 60
	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
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
	padding: 10px 10px 80px 10px;
	width: 100%;

	.block {
		padding-bottom: 24px;
		margin-bottom: 24px;
		border-bottom: 1px solid rgba(150, 150, 150, 0.5);

		p {
			line-height: 1.2;
		}

		&.service {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
`

const Review = ({ selectedService, estimates, locationData, handleConfirm }) => {
	const time = useTimer(120)

	return (
		<Wrapper>
			<div className="block location">
				<h3>{locationData.name}</h3>
				<h5>{locationData.address}</h5>
			</div>

			<div className="block service">
				<div>
					<h3>{selectedService.name}</h3>
					<h5>{selectedService.duration} minutes</h5>
				</div>
				<h3>${selectedService.price}</h3>
			</div>

			<div className="block">
				<p>Your estimated service time is:</p>
				<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 60 }}>{format(estimates.startTime, 'h:mma')}</h1>
			</div>

			<h4 style={{ opactiy: 0.5, fontWeight: 100 }}>
				The above time has not been secured and is only an estimate. Click confirm to lock in your scheduled time.
			</h4>

			<FormFooter>
				<span>Expires in {time}</span>
				<Button style={{ width: '50%' }} onClick={handleConfirm}>
					Confirm
				</Button>
			</FormFooter>
		</Wrapper>
	)
}

export default Review
