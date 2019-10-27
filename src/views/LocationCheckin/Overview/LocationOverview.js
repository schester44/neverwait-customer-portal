import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { darken } from 'polished'
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi'
import format from 'date-fns/format'

import EmployeeList from '../EmployeeList'
import WorkingHour from './WorkingHour'
import ClosingSoon from './ClosingSoon'

import { useEnhancedEmployees } from '../../../graphql/hooks'

const headerSlideDown = keyframes`
	from {
		transform: translateY(-120px);
	}
	to {
		transform: translateY(0px);
	}
`

const Header = styled('div')`
	min-height: 100px;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 99;
	animation: ${headerSlideDown} 0.4s ease forwards;

	.back {
		cursor: pointer;
		position: absolute;
		top: 16px;
		left: 10px;
		font-size: 36px;
		line-height: 1;
		z-index: 999;
		color: white;
	}

	.location {
		margin-bottom: 16px;
		padding-bottom: 16px;
		padding-left: 52px;
		padding-top: 16px;

		color: white;

		h3 {
			line-height: 1.5;
		}
	}

	${({ theme }) => css`
		background-image: linear-gradient(${theme.colors.brand}, ${darken(0.05, theme.colors.brand)});
	`};

	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 20px));
`

const slideIn = keyframes`
	from {
		transform: translateY(100vh);
	}
	to {
		transform: translateY(0vh);
		opacity: 1;
	}
`

const Contents = styled('div')`
	opacity: 0;
	transform: translateY(-100vw);
	animation: ${slideIn} 0.5s ease forwards;
	padding-top: 20px;
	padding-bottom: 80px;
`

const Card = styled('div')`
	margin: 10px;
	border-radius: 8px;

	.inverted {
		background: white;
		box-shadow: 0px 1px 3px rgba(32, 32, 32, 0.05);
		border-radius: 10px;
		padding: 10px;
	}

	.title {
		font-size: 12px;
		font-weight: 700;
		padding-top: 5px;
		padding-bottom: 15px;
		opacity: 0.7;
	}
`

const LocationOverview = ({ history, employees: defaultEmployees, location }) => {
	const todaysName = format(new Date(), 'dddd').toLowerCase()
	const { employees, loading } = useEnhancedEmployees({ employees: defaultEmployees })

	return (
		<div style={{ width: '100%', height: '100%', paddingTop: 90 }}>
			<Header>
				<div
					className="back"
					onClick={() => {
						history.push(history.location.state?.from || '/')
					}}
				>
					<FiArrowLeft />
				</div>

				<div className="location">
					<h3>{location.name}</h3>
					<p className="small-sub-text">{location.address}</p>
					<p className="small-sub-text">{location.contactNumber}</p>
				</div>
			</Header>

			<Contents>
				<ClosingSoon today={location.working_hours[todaysName]} />

				<Card>
					<p className="title">
						<FiUser style={{ marginRight: 4 }} />
						AVAILABLE STAFF
					</p>

					{!loading && <EmployeeList employees={employees} />}
				</Card>

				<Card>
					<p className="title">
						<FiCalendar style={{ marginRight: 4 }} />
						LOCATION HOURS
					</p>

					<div className="inverted">
						{Object.keys(location.working_hours).map(day => {
							if (day === '__typename') return null

							return (
								<WorkingHour isToday={day === todaysName} key={day} day={day} details={location.working_hours[day]} />
							)
						})}
					</div>
				</Card>
			</Contents>
		</div>
	)
}

export default LocationOverview
