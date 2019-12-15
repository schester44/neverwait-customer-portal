import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { basicLocationInfoQuery } from '../../graphql/queries'
import NavHeader from '../../components/NavHeader'
import { FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import NavFooter from '../HomeScreen/NavFooter'
import { format, addMinutes, startOfDay } from 'date-fns'

import ClosingSoon from './ClosingSoon'
import WorkingHour from './WorkingHour'
import Button from '../../components/Button'

const slideDown = keyframes`
	from {
			height: 0px;
			opacity: 0;
	}
	to {
			height: 250px;
			opacity: 1;
	}
`

const slideUp = keyframes`
	from {
		height: 250px;
	}
	to {
		height: 0px;
	}
`

const Container = styled('div')`
	.view {
		display: flex;
		flex-direction: column;
		padding-bottom: 90px;
	}

	.pad {
		padding-left: 14px;
		padding-right: 14px;
	}

	.location-hours {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		font-size: 17px;
		line-height: 24px;

		.left {
			display: flex;
			align-items: center;
		}

		&-current {
			padding-left: 20px;
		}
	}

	.hours-container {
		padding: 14px;

		&.show {
			background: rgba(242, 242, 242, 1);
			.location-hours-details {
				animation: ${slideDown} 0.5s ease forwards;
			}
		}

		&.hide {
			.location-hours-details {
				animation: ${slideUp} 0.5s ease forwards;
			}
		}
	}

	.location-photo {
		width: 100%;
		height: 250px;
		object-fit: cover;
	}

	.location-hours-details {
		height: 0px;
		overflow: hidden;
		margin-top: 14px;
		padding-left: 48px;
	}
`

const LocationOverview = () => {
	const { uuid } = useParams()
	const history = useHistory()
	const { data, loading } = useQuery(basicLocationInfoQuery, { variables: { uuid } })
	const [showHours, setShowHours] = React.useState(false)
	const initialLoad = React.useRef(true)

	// TODO: handle load state
	if (loading || !data?.locationByUUID) return null

	const location = data.locationByUUID

	const todaysName = format(new Date(), 'dddd').toLowerCase()
	const workHourKeys = Object.keys(location.working_hours)

	return (
		<Container hasPhoto={!!location.photo}>
			{!!history.location.state?.from && (
				<NavHeader
					onBack={() => {
						history.push(history.location.state?.from)
					}}
				/>
			)}
			<img className="location-photo" src={location.photo} alt={location.name} />

			<div className="view">
				<div className="pad" style={{ paddingTop: 8 }}>
					<h1>{location.name}</h1>
					<p>{location.address}</p>
					<p style={{ paddingBottom: 16, borderBottom: '1px solid rgba(242,242,242,1)' }}>
						{location.contactNumber}
					</p>
				</div>

				<ClosingSoon today={location.working_hours[todaysName]} />

				<div
					className={`hours-container ${showHours ? 'show' : initialLoad.current ? '' : 'hide'}`}
				>
					<div
						onClick={() => {
							setShowHours(prev => !prev)
							initialLoad.current = false
						}}
						className="location-hours"
					>
						<div className="left">
							<FiClock size={28} />
							<div className="location-hours-current">
								{location.working_hours[todaysName]?.open ? (
									<span>
										Open Now{' '}
										{format(
											addMinutes(
												startOfDay(new Date()),
												location.working_hours[todaysName].startTime
											),
											'h:mma'
										)}{' '}
										-
										{format(
											addMinutes(
												startOfDay(new Date()),
												location.working_hours[todaysName].endTime
											),
											'h:mma'
										)}
									</span>
								) : (
									<span>Closed Now</span>
								)}
							</div>
						</div>
						{showHours ? <FiChevronUp size={28} /> : <FiChevronDown size={28} />}
					</div>

					<div className="location-hours-details">
						{workHourKeys.map(day => {
							if (day === '__typename') return null

							return (
								<WorkingHour
									isToday={day === todaysName}
									key={day}
									day={day}
									details={location.working_hours[day]}
								/>
							)
						})}
					</div>
				</div>

				<div className="pad" style={{ paddingTop: 16, borderTop: '1px solid rgba(242,242,242,1)' }}>
					<Link to={`${history.location.pathname}/checkin`}>
						<Button style={{ width: '100%', marginBottom: 14 }}>Check In</Button>
					</Link>
					<Link to={`${history.location.pathname}/appointment`}>
						<Button style={{ width: '100%' }}>Book Appointment</Button>
					</Link>
				</div>
			</div>

			<NavFooter />
		</Container>
	)
}

export default LocationOverview
