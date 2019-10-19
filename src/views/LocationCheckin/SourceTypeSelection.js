import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import { lighten } from 'polished'
import { FiArrowLeft } from 'react-icons/fi'
import { format, isAfter } from 'date-fns'

import { dateFromTimeString } from './Employee/utils/isWorking'
import pling from '../../components/Pling'

const Container = styled('div')`
	text-align: center;
	width: 100%;
	height: 100%;
	padding-bottom: 40px;
	display: flex;
	flex-direction: column;

	.back {
		position: absolute;
		top: 10px;
		left: 5px;
		font-size: 36px;
		line-height: 1;
	}

	.title {
		margin-top: 24px;
		margin-bottom: 7px;
	}

	.actions {
		width: 80%;
		margin: 24px auto 0 auto;

		.separator {
			width: 100%;
			text-align: center;
			position: relative;
			margin: 24px 5px;
			color: ${({ theme }) => lighten(0.2, theme.colors.brand)};

			& > div {
				&:before {
					left: 0;
					top: 10px;
					position: absolute;
					content: ' ';
					width: calc(50% - 15px);
					height: 1px;
					background: ${({ theme }) => lighten(0.5, theme.colors.brand)};
				}

				&:after {
					right: 5px;
					top: 10px;
					position: absolute;
					content: ' ';
					width: calc(50% - 20px);
					height: 1px;
					background: ${({ theme }) => lighten(0.5, theme.colors.brand)};
				}
			}
		}
	}
`

const SourceTypeSelection = ({ employee, estimates, onSelectCheckin, onSelectAppointment, onBack }) => {
	const [visible, setVisible] = React.useState({
		noWait: false
	})

	const handleCheckinClick = () => {
		// check service durations against employee end time
		const shiftEndTime = dateFromTimeString(employee.status.currentShift.end_time, new Date())

		// TODO: This shouldn't be visible because the UI would show which source actions are available
		if (isAfter(estimates.endTime, shiftEndTime)) {
			pling({
				message: `Selected service duration exceeds ${employee.firstName}'s work hours. You could book an appointment instead.`
			})

			return false
		}

		if (employee.waitTime >= 15) {
			onSelectCheckin()
		} else {
			setVisible(prev => ({ ...prev, noWait: true }))
		}
	}

	return (
		<Container>
			<div className="back" onClick={onBack}>
				<FiArrowLeft />
			</div>

			<h2 className="title">Choose service time </h2>
			<p className="small-sub-text">Need it soon or need it when you need it?</p>

			<div className="actions">
				<p style={{ marginBottom: 14 }} className="small-sub-text">
					First available time today is {format(estimates.startTime, 'h:mmA')}.
				</p>

				{/* Show, but disable this button if we can't book the employee (due to schedule reasons) */}
				<Button onClick={handleCheckinClick} style={{ width: '100%' }}>
					First available time today
				</Button>

				<div className="separator">
					<div>or</div>
				</div>

				<Button onClick={onSelectAppointment} style={{ background: 'rgba(49,49,49,1)', width: '100%' }}>
					Create an appointment
				</Button>
			</div>
		</Container>
	)
}

export default SourceTypeSelection
