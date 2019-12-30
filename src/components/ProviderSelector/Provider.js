import React from 'react'
import { FiUser, FiCheck, FiChevronRight, FiX } from 'react-icons/fi'
import { addMinutes, format } from 'date-fns'
import clsx from 'clsx'

import { dateFromTimeString } from '../../helpers/date-from'

const renderWaitTime = ({ waitTime }) => {
	if (waitTime < 60) return `${waitTime}mins`

	if (waitTime === 60) return `1 hour`

	const hours = Math.floor(waitTime / 60)
	const minutes = Math.floor((waitTime / 60 - hours) * 60)

	return `${hours}hr${hours === 1 ? '' : 's'} ${minutes}mins`
}

const Provider = ({ provider, isSelected, isAppointmentSelector, onClick }) => {
	const nextShift = provider.sourcesNextShifts?.acceptingCheckins
	const hasWalkinSchedule = !!provider.sourcesNextShifts?.acceptingWalkins

	const canScheduleAppointments =
		isAppointmentSelector &&
		provider.schedule_ranges.some(range =>
			range.schedule_shifts.some(shift => !!shift.acceptingAppointments)
		)

	const isSchedulable = isAppointmentSelector
		? canScheduleAppointments || false
		: provider.isSchedulable

	return (
		<div
			className={clsx('flex items-center border-b border-gray-200 mb-2 py-3 pl-2', {
				'hover:bg-gray-100 cursor-pointer': isSchedulable,
				'cursor-not-allowed': !isSchedulable,
				'bg-gray-200': isSelected
			})}
			onClick={() => {
				if (isAppointmentSelector && !canScheduleAppointments) return

				onClick()
			}}
		>
			<div className="relative">
				<div
					className={clsx(
						'w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-white text-2xl',
						{
							'bg-indigo-500': isSchedulable,
							'bg-gray-400': !isSchedulable
						}
					)}
				>
					{provider.photo ? (
						<img
							src={provider.photo}
							alt={provider.firstName}
							className="w-full h-full object-cover"
						/>
					) : (
						<FiUser />
					)}
				</div>

				<div
					className={clsx(
						'absolute bottom-0 right-0 rounded-full w-4 h-4 flex justify-center items-center text-xs text-white',
						{
							'bg-green-500': isSchedulable,
							'bg-red-500': !isSchedulable
						}
					)}
				>
					{isSchedulable ? <FiCheck /> : <FiX style={{ color: 'white' }} />}
				</div>
			</div>
			<div className="flex-1 pl-3">
				<div className="flex flex-1 justify-between items-center">
					<div className="left">
						<p className="font-bold leading-none text-xl">
							{provider.firstName} {provider.lastName}
						</p>

						{!isAppointmentSelector &&
							!provider.isSchedulable &&
							hasWalkinSchedule &&
							(!nextShift ||
								nextShift.start_time !==
									provider.sourcesNextShifts.acceptingWalkins.start_time) && (
								<p className="text-gray-600 text-lg">
									Walk-ins available at{' '}
									{format(
										dateFromTimeString(provider.sourcesNextShifts.acceptingWalkins.start_time),
										'h:mma'
									)}
								</p>
							)}

						<p className="text-gray-600 text-lg">
							{isAppointmentSelector
								? canScheduleAppointments
									? 'Available'
									: 'Unavailable'
								: provider.isSchedulable
								? provider.waitTime > 30
									? 'Available'
									: 'Available Now'
								: nextShift
								? `Check-ins start at ${format(dateFromTimeString(nextShift.start_time), 'h:mma')}`
								: provider.currentShift
								? 'Unavailable (Fully Booked)'
								: 'Unavailable'}
						</p>
					</div>
					<div className="flex items-center">
						{!isAppointmentSelector && provider.isSchedulable && (
							<div>
								<p className="font-bold text-lg text-gray-900 text-right">
									{format(addMinutes(new Date(), provider.waitTime), 'h:mma')}
								</p>
								<p className="text-gray-600 text-lg text-right">
									{provider.waitTime > 30
										? renderWaitTime({ waitTime: provider.waitTime })
										: 'No Wait'}
								</p>
							</div>
						)}

						{isSchedulable && <FiChevronRight className="chevron text-3xl text-gray-500" />}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Provider
