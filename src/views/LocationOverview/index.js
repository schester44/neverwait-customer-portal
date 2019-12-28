import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { format, addDays, isWithinRange, startOfDay, endOfDay } from 'date-fns'
import clsx from 'clsx'
import { MobileView } from 'react-device-detect'

import { FiArrowLeft } from 'react-icons/fi'
import { FiPhone } from 'react-icons/fi'
import NavFooter from '../../components/NavFooter'
import Button from '../../components/Button'

import { basicLocationInfoQuery } from '../../graphql/queries'

import ClosingSoon from './ClosingSoon'
import WorkingHour from './WorkingHour'
import LocationDrawerHeader from './LocationDrawerHeader'

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

const startDate = new Date()
const endDate = addDays(startDate, 7)

const LocationOverview = () => {
	const { uuid } = useParams()
	const history = useHistory()

	const { data, loading } = useQuery(basicLocationInfoQuery, {
		variables: { uuid, startDate, endDate }
	})

	const [showHours, setShowHours] = React.useState(false)
	const initialLoad = React.useRef(true)

	// TODO: handle load state
	if (loading || !data?.locationByUUID) return null

	const location = data.locationByUUID

	const todaysName = format(new Date(), 'dddd').toLowerCase()
	const workHourKeys = Object.keys(location.working_hours)

	const closedDate = location.closed_dates.find(date =>
		isWithinRange(new Date(), startOfDay(date.start_date), endOfDay(date.end_date))
	)

	const isClosedToday = !!closedDate || !location.working_hours[todaysName]?.open

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
					<div className="px-2 py-2 absolute top-0 left-0 l-2">
						<FiArrowLeft
							className="text-3xl text-white"
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
					<LocationDrawerHeader
						isDrawerVisible={showHours}
						isClosedToday={isClosedToday}
						today={location.working_hours[todaysName]}
						onClick={() => {
							setShowHours(prev => !prev)
							initialLoad.current = false
						}}
					/>

					<div className="location-hours-details px-4">
						{workHourKeys.map(day => {
							if (day === '__typename') return null

							return (
								<WorkingHour
									closedDates={location.closed_dates}
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
					{isClosedToday ? (
						<Button disabled={isClosedToday} className="w-full mb-4">
							Check In
						</Button>
					) : (
						<Link to={`${history.location.pathname}/checkin`}>
							<Button className="w-full mb-4">Check In</Button>
						</Link>
					)}
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
