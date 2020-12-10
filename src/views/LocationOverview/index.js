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

import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useViewport } from '../../components/ViewportProvider'

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
		background: rgba(252, 252, 252, 1);

		.location-hours-details {
			animation: ${slideDown} 0.25s ease forwards;
		}
	}

	&.hide {
		.location-hours-details {
			animation: ${slideUp} 0.25s ease forwards;
		}
	}
`

const startDate = new Date()
const endDate = addDays(startDate, 7)

const LocationOverview = () => {
	const { uuid } = useParams()
	const history = useHistory()

	const { data, loading } = useQuery(basicLocationInfoQuery, {
		variables: { uuid, startDate, endDate },
	})

	const { isMobile } = useViewport()

	const [showHours, setShowHours] = React.useState(!isMobile)
	const initialLoad = React.useRef(true)

	// TODO: handle load state
	if (loading || !data?.locationByUUID) return null

	const location = data.locationByUUID

	const todaysName = format(new Date(), 'dddd').toLowerCase()
	const workHourKeys = Object.keys(location.working_hours)

	const closedDate = location.closed_dates.find((date) =>
		isWithinRange(new Date(), startOfDay(date.start_date), endOfDay(date.end_date))
	)

	const isClosedToday = !!closedDate || !location.working_hours[todaysName]?.open

	return (
		<div className="flex flex-col w-full md:pt-20 pb-20 md:pb-0">
			<div className="flex flex-wrap md:pt-2 md:mb-2 w-full flex-col-reverse md:flex-row">
				<div
					className="md:bg-gray-200 pt-6 px-6 md:pb-6 w-full md:w-2/5 flex flex-col items-center justify-center"
					style={{ minHeight: isMobile ? 0 : 300 }}
				>
					<div className="mb-8 flex items-center justify-between" style={{ width: '100%' }}>
						<div>
							<h1 className="font-black md:text-4xl">{location.name}</h1>
							<h3 className="text-gray-600 md:text-xl">{location.address}</h3>
							{isMobile && <h3 className="text-gray-600 md:text-xl">{location.contactNumber}</h3>}
						</div>

						{location.contactNumber && (
							<MobileView>
								<a href={`tel:${location.contactNumber}`}>
									<div className="leading-none rounded-full text-xl w-10 h-10 bg-green-500 text-white flex justify-center items-center shadow ml-2">
										<FiPhone />
									</div>
								</a>
							</MobileView>
						)}
					</div>

					{isClosedToday ? (
						<Button disabled={isClosedToday} className="w-full mb-4">
							Check In
						</Button>
					) : (
						<Link className="w-full" to={`${history.location.pathname}/checkin`}>
							<Button className="w-full mb-4">Check In</Button>
						</Link>
					)}
					<Link className="w-full" to={`${history.location.pathname}/appointment`}>
						<Button className="w-full mb-4">Book Appointment</Button>
					</Link>
				</div>

				<div className="w-full md:w-3/5 md:pl-2">
					<Carousel showIndicators={false} showThumbs={false}>
						{location.photos.map((photo) => {
							return (
								<div key={photo.path}>
									<img src={photo.url} alt={location.name} style={{ maxHeight: 500 }} />
								</div>
							)
						})}
					</Carousel>
				</div>
			</div>

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

			<div className="flex flex-col flex-1 w-full">
				<div className="flex px-4 pt-4">
					{(location.bio || !isMobile) && (
						<div className="w-full md:w-3/5">
							<div>
								{!isMobile && <h1>About {location.name}</h1>}
								{location.bio && <p className="text-gray-800 text-lg">{location.bio}</p>}
								{!location.bio && (
									<p className="text-gray-600 italic text-lg">
										This location does not have any info
									</p>
								)}
							</div>
						</div>
					)}

					<div
						className={clsx('w-full', {
							'md:w-2/5': !!location.bio || !isMobile,
						})}
					>
						{!isMobile && (
							<div>
								<h1>Location</h1>
								<p className="text-gray-700 text-lg">{location.address}</p>
								<p className="text-gray-700 text-lg">{location.contactNumber}</p>
							</div>
						)}

						<Hours
							className={clsx('mt-4', {
								show: showHours,
								hide: !showHours && !initialLoad.current,
							})}
						>
							<LocationDrawerHeader
								isDrawerVisible={showHours}
								isClosedToday={isClosedToday}
								today={location.working_hours[todaysName]}
								onClick={() => {
									setShowHours((prev) => !prev)
									initialLoad.current = false
								}}
							/>

							<div className="location-hours-details px-4">
								{workHourKeys.map((day) => {
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
					</div>
				</div>

				<ClosingSoon today={location.working_hours[todaysName]} />
			</div>

			<NavFooter />
		</div>
	)
}

export default LocationOverview
