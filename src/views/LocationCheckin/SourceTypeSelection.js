import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import Button from '../../components/Button'
import { lighten } from 'polished'
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi'
import { isAfter, addMinutes} from 'date-fns'
import { profileQuery } from '../../graphql/queries'

import { dateFromTimeString } from '../../helpers/date-from'
import { shiftFromTime } from '../../helpers/shifts'
import { scheduleRangeFromDate } from '../../helpers/scheduleRangesByDate'

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
	const { data } = useQuery(profileQuery, { variables: { skip: false } })

	const schedule = scheduleRangeFromDate({ scheduleRanges: employee.schedule_ranges, date: new Date() })

	const isWorking = isWorking({
		schedule,
		time: addMinutes(new Date(), estimates.duration || 0)
	})

	const currentShift = shiftFromTime({
		schedule,
		time: addMinutes(new Date(), estimates.duration || 0)
	})

	const wouldExceedShift =
		!isWorking || !currentShift || isAfter(estimates.endTime, dateFromTimeString(currentShift.end_time))

	const hasExceededMaxUpcomingAppointments = data.profile.appointments.upcoming.length >= 3

	return (
		<Container>
			<div className="back" onClick={onBack}>
				<FiArrowLeft />
			</div>

			<h2 className="title">Choose service time </h2>
			<p className="small-sub-text">Need it soon or need it when you need it?</p>

			<div className="actions">
				<div className="walk-ins">
					<Button
						disabled={!isWorking || !currentShift?.acceptingCheckins || wouldExceedShift}
						onClick={onSelectCheckin}
						style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
					>
						<FiClock style={{ marginRight: 7, opacity: 0.7 }} /> First available time today
					</Button>
				</div>

				<div className="separator">
					<div>or</div>
				</div>

				{hasExceededMaxUpcomingAppointments && (
					<p style={{ marginBottom: 7, color: 'tomato' }} className="small-sub-text">
						Upcoming appointments limit reached.
					</p>
				)}

				<Button
					// disabled={hasExceededMaxUpcomingAppointments}
					onClick={onSelectAppointment}
					style={{
						background: 'rgba(49,49,49,1)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%'
					}}
				>
					<FiCalendar style={{ marginRight: 7, opacity: 0.7 }} /> Create an appointment
				</Button>
			</div>
		</Container>
	)
}

export default SourceTypeSelection
