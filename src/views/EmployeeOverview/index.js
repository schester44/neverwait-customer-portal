import React from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import clsx from 'clsx'

import { FiArrowLeft } from 'react-icons/fi'
import { FiPhone } from 'react-icons/fi'
import { MobileView } from 'react-device-detect'

import { employeeByUUIDQuery } from '../../graphql/queries'

import NavFooter from '../../components/NavFooter'
import Button from '../../components/Button'

import { format, addDays, startOfDay, endOfDay, isWithinRange } from 'date-fns'

const startTime = new Date()
const endTime = addDays(startTime, 7)

const EmployeeOverview = () => {
	const { uuid } = useParams()
	const history = useHistory()

	const { data, loading } = useQuery(employeeByUUIDQuery, {
		variables: { uuid, startTime, endTime }
	})

	const employee = data?.employee

	const todaysName = format(new Date(), 'dddd').toLowerCase()

	if (loading || !employee) return null

	const allLocationsClosed = employee.locations.every(location => {
		if (!location.working_hours[todaysName]?.open) return true

		return location.closed_dates.find(date =>
			isWithinRange(new Date(), startOfDay(date.start_date), endOfDay(date.end_date))
		)
	})

	return (
		<div className="flex flex-col min-h-full">
			<div
				className={clsx('relative overflow-hidden w-full bg-indigo-700', {
					'h-64': true
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

				<div className="w-full h-full flex items-center justify-center">
					<div className="relative z-10 rounded-full w-32 h-32 overflow-hidden border-2 border-white shadow-2xl">
						<img
							className="relative w-full h-full object-cover"
							src={employee.photo}
							alt={employee.firstName}
						/>
					</div>
				</div>

				{employee.photo && (
					<img
						src={employee.photo}
						alt={employee.firstName}
						className="absolute top-0 left-0"
						style={{ transform: 'scale(3)', filter: 'blur(3px)' }}
					/>
				)}
			</div>

			<div className="flex flex-col flex-1">
				<div className="px-4 pt-4">
					<div className="flex items-center">
						<h1>
							{employee.firstName} {employee.lastName}
						</h1>

						{employee.phoneNumber && (
							<MobileView>
								<a href={`tel:${employee.phoneNumber}`}>
									<div className="ml-2 rounded-full bg-green-500 text-white flex justify-center items-center text-lg w-8 h-8 shadow-lg">
										<FiPhone />
									</div>
								</a>
							</MobileView>
						)}
					</div>
				</div>

				<div className="px-4 pb-20 mt-4 flex flex-col justify-end flex-1">
					{allLocationsClosed ? (
						<Button disabled={true} className="w-full mb-4">
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

export default EmployeeOverview
