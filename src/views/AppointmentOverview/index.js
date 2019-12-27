import React from 'react'
import clsx from 'clsx'
import { produce } from 'immer'
import { Redirect, useParams, useHistory, Link, generatePath } from 'react-router-dom'
import { format, differenceInHours } from 'date-fns'
import { useMutation } from '@apollo/react-hooks'
import { MobileView } from 'react-device-detect'
import { FiArrowLeft, FiPhone } from 'react-icons/fi'
import { FaStore } from 'react-icons/fa'

import Swipe from 'react-easy-swipe'
import { USER_DASHBOARD, LOCATION_OVERVIEW } from '../../routes'
import isRecentAppointment from '../../helpers/isRecentAppointment'
import { cancelAppointmentMutation } from '../../graphql/mutations'
import { profileQuery } from '../../graphql/queries'

import pling from '../../components/Pling'
import Modal from '../../components/Modal'
import Button from '../../components/Button'

const AppointmentOverview = ({ profile }) => {
	const history = useHistory()
	const { id: appointmentId } = useParams()

	const [state, setState] = React.useState({ showCancelModal: false })

	const [cancelAppointment, { loading: cancelLoading }] = useMutation(cancelAppointmentMutation)

	const appointment = React.useMemo(() => {
		if (appointmentId === 'recent') {
			const appointment = JSON.parse(localStorage.getItem('last-appt'))
			const isRecent = isRecentAppointment(appointment)
			if (isRecent) return appointment

			// when we return undefiend, we need to redirect the user back to the overview screen. tehy're trying to view a recent appointment but there isn't one.
			return isRecent ? appointment : undefined
		}

		const compare = appt => Number(appt.id) === Number(appointmentId)

		return profile.appointments.upcoming.find(compare) || profile.appointments.past.find(compare)
	}, [profile, appointmentId])

	if (!appointment) return <Redirect to={USER_DASHBOARD} />

	const onSwipeRight = () => {
		history.push(history.location.state?.from || '/')
	}

	const handleCancel = async () => {
		await cancelAppointment({
			variables: {
				appointmentId
			},
			update: proxy => {
				const cache = proxy.readQuery({
					query: profileQuery,
					variables: { skip: false }
				})

				proxy.writeQuery({
					query: profileQuery,
					variables: { skip: false },
					data: produce(cache, draftState => {
						draftState.profile.appointments.upcoming.splice(
							profile.appointments.upcoming.findIndex(
								({ id }) => parseInt(id) === parseInt(appointmentId)
							),
							1
						)
					})
				})
			}
		})

		pling({ message: 'Appointment canceled.', intent: 'info' })

		setState(prev => ({ ...prev, showCancelModal: false }))
	}

	return (
		<Swipe className="swipe-container pb-24" onSwipeRight={onSwipeRight}>
			<div
				className={clsx('w-full relative overflow-hidden h-48 bg-gray-900', {
					'h-48': !!appointment.location.photo,
					'h-4': !appointment.location.photo
				})}
			>
				<div className="absolute z-10 top-0 left-0 w-full flex justify-between items-center px-2 py-2">
					<Link to={history.location.state?.from || '/'} className="text-3xl text-white">
						<FiArrowLeft />
					</Link>
					<p className="text-lg font-bold text-white">Overview</p>
					<Link
						to={{
							state: {
								from: history.location.pathname
							},
							pathname: generatePath(LOCATION_OVERVIEW, {
								uuid: appointment.location.uuid
							})
						}}
						className="text-2xl text-white"
					>
						<FaStore />
					</Link>
				</div>

				{appointment.location.photo && (
					<img
						src={appointment.location.photo}
						alt="Location"
						className="opacity-25 w-full h-full object-cover"
					/>
				)}
			</div>

			<div style={{ borderTopLeftRadius: 35 }} className="-mt-12 bg-white relative z-0">
				<div className="container mx-auto h-full px-4">
					<h1 className="text-3xl pt-2">{appointment.location.name}</h1>
					<p className="text-gray-700 text-lg">{appointment.location.address}</p>
					<p className="text-gray-700 text-lg">{appointment.location.contactNumber}</p>

					<div className="mt-2 mb-3 text-2xl font-black text-indigo-500">
						{format(appointment.startTime, 'dddd MMM Do, YYYY')}
					</div>

					<div className="times mt-2">
						<p className="text-sm font-bold leading-none">Start Time</p>
						<p className="mt-1 text-4xl text-gray-900 font-black leading-none">
							{format(appointment.startTime, 'h:mma')}
						</p>

						<p className="text-sm mt-4 font-bold leading-none">End Time</p>
						<p className="mt-1 text-4xl text-gray-900 font-black leading-none">
							{format(appointment.endTime, 'h:mma')}
						</p>
					</div>

					<div className="border-t border-gray-200 pt-4 mt-4 mb-4">
						<p className="text-sm font-bold leading-none mb-2">Service Details</p>

						{appointment.services.length > 0 &&
							appointment.services.map((service, index) => (
								<div className="flex mb-2 justify-between items-center" key={index}>
									<p className="text-lg text-gray-900">{service.name}</p>
									<p className="text-lg text-gray-900">with {appointment.employee.firstName}</p>
								</div>
							))}

						<div className="flex justify-between mt-2">
							<p className="font-black">Total</p>

							<p className="font-black">${appointment.price}</p>
						</div>
					</div>

					<div className="actions mt-8">
						{appointment.location.contactNumber && (
							<MobileView>
								<a href={`tel:${appointment.location.contactNumber}`}>
									<Button className="w-full mt-4 flex items-center justify-center">
										<FiPhone className="mr-2" /> Call {appointment.location.name}
									</Button>
								</a>
							</MobileView>
						)}

						{appointment.status === 'confirmed' &&
							differenceInHours(appointment.startTime, new Date()) > 3 && (
								<Button
									type="ghost"
									className="w-full mt-4"
									onClick={() => setState(prev => ({ ...prev, showCancelModal: true }))}
								>
									Cancel Appointment
								</Button>
							)}
					</div>

					{state.showCancelModal && (
						<Modal onClose={() => setState(prev => ({ ...prev, showCancelModal: false }))}>
							<div>
								<p className="text-sm text-red-600 font-bold text-center text-gray-700">
									Are you sure you want to cancel this appointment?
								</p>

								<Button
									className="w-full mt-8 mb-8"
									onClick={handleCancel}
									disabled={cancelLoading}
								>
									Yes, Cancel
								</Button>

								<Button
									type="ghost"
									className="btn-sm mb-4"
									onClick={() => setState(prev => ({ ...prev, showCancelModal: false }))}
								>
									Nevermind
								</Button>
							</div>
						</Modal>
					)}
				</div>
			</div>
		</Swipe>
	)
}

export default AppointmentOverview
