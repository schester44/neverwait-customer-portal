import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { basicLocationInfoQuery } from '../../graphql/queries'
import { FiArrowLeft } from 'react-icons/fi'
import { FiClock, FiPhone, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import NavFooter from '../HomeScreen/NavFooter'
import { format, addMinutes, startOfDay, isWithinRange } from 'date-fns'
import clsx from 'clsx'
import { MobileView } from 'react-device-detect'

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
		opacity: 1;
		background: rgba(242, 242, 242, 1);
	}
	to {
		height: 0px;
		opacity: 0;
		background: #fff;
	}
`

const Hours = styled('div')`
	.location-hours-details {
		height: 0;
		opacity: 0;
		overflow: hidden;
	}

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
		<div className="h-screen flex flex-col">
			<div
				className={clsx('overflow-hidden w-full bg-indigo-700', {
					'h-0': !location.photo,
					'h-64': !!location.photo
				})}
				style={{ borderBottomRightRadius: '50%' }}
			>
				{!!history.location.state?.from && (
					<div className="px-2 py-2 absolute top-0 left-0 mt-2 l-2">
						<FiArrowLeft
							className="text-3xl text-gray-700"
							onClick={() => {
								history.push(history.location.state.from)
							}}
						/>
					</div>
				)}

				{location.photo && (
					<img className="w-full h-full object-cover" src={location.photo} alt={location.name} />
				)}
			</div>

			<div className="flex flex-col flex-1">
				<div className="px-4 pt-4">
					<div className="flex items-center">
						<h1>{location.name}</h1>

						{location.contactNumber && (
							<MobileView>
								<a href={`tel:${location.contactNumber}`}>
									<div className="ml-2 rounded-full bg-green-500 text-white flex justify-center items-center text-lg w-8 h-8 shadow-lg">
										<FiPhone />
									</div>
								</a>
							</MobileView>
						)}
					</div>
					<p className="text-gray-700 text-lg">{location.address}</p>
					<p className="text-gray-700 text-lg">{location.contactNumber}</p>
				</div>

				<ClosingSoon today={location.working_hours[todaysName]} />

				<Hours
					className={clsx('mt-4', { show: showHours, hide: !showHours && !initialLoad.current })}
				>
					<div
						onClick={() => {
							setShowHours(prev => !prev)
							initialLoad.current = false
						}}
						className="flex justify-between items-center border-t border-gray-200 pr-2"
					>
						<div className="flex items-center px-4 py-4">
							<FiClock size={28} />

							{location.working_hours[todaysName]?.open &&
							isWithinRange(
								new Date(),
								addMinutes(startOfDay(new Date()), location.working_hours[todaysName].startTime),
								addMinutes(startOfDay(new Date()), location.working_hours[todaysName].endTime)
							) ? (
								<span className="text-lg pl-2">
									Open Now{' '}
									{format(
										addMinutes(
											startOfDay(new Date()),
											location.working_hours[todaysName].startTime
										),
										'h:mma'
									)}{' '}
									-{' '}
									{format(
										addMinutes(startOfDay(new Date()), location.working_hours[todaysName].endTime),
										'h:mma'
									)}
								</span>
							) : (
								<span className="text-lg pl-2">Closed Now</span>
							)}
						</div>

						{showHours ? <FiChevronUp size={28} /> : <FiChevronDown size={28} />}
					</div>

					<div className="location-hours-details px-4">
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
				</Hours>

				<div className="px-4 pb-20 mt-4 flex flex-col justify-end flex-1">
					<Link to={`${history.location.pathname}/checkin`}>
						<Button className="w-full mb-4">Check In</Button>
					</Link>
					<Link to={`${history.location.pathname}/appointment`}>
						<Button className="w-full mb-4">Book Appointment</Button>
					</Link>
				</div>
			</div>

			<NavFooter />
		</div>
	)
}

export default LocationOverview
