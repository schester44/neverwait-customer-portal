import React from 'react'
import clsx from 'clsx'
import styled, { keyframes } from 'styled-components'
import { NavLink, useRouteMatch, useHistory, generatePath } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { FiUser, FiX, FiScissors, FiCalendar } from 'react-icons/fi'
import { FaCalendarDay, FaCalendarCheck } from 'react-icons/fa'
import {
	USER_PREFERENCES,
	LOCATION_CHECKIN,
	LOCATION_SEARCH,
	LOCATION_APPOINTMENT
} from '../routes'
import { profileQuery } from '../graphql/queries'

const popUp = keyframes`
	from {
		opacity: 0;
		transform: translateY(50px);
	} 
	to {
		transform: translateY(0px);
		opacity: 1;
	}
`

const disappear = keyframes`
	from {
		transform: translateY(0px);
		opacity: 1;
	} 
	to {
		transform: translateY(50px);
		opacity: 0;
	}
`

const spin = keyframes`
	from {
		transform: rotate(0deg);
	} 
	to {
		transform: rotate(180deg);
	}
`

const Container = styled('div')`
	.close-btn {
		animation: ${spin} 0.25s ease forwards;
	}

	.rotate-once {
		transform: rotate(180deg);
	}

	.action-bar {
		transform: translateY(100px);
		opacity: 0;
		pointer-events: none;
	}

	.navbar-show-actions {
		animation: ${popUp} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.575) forwards;
		pointer-events: inherit;
	}

	.navbar-hide-actions {
		animation: ${disappear} 0.2s ease forwards;
	}
`

const Action = ({ exact = false, to, children, style, buttonClassName = '' }) => {
	return (
		<NavLink exact={exact} to={to}>
			<div
				style={style}
				className={clsx(
					'rounded text-3xl w-12 h-12 flex items-center justify-center',
					buttonClassName
				)}
			>
				{children}
			</div>
		</NavLink>
	)
}

const NavFooter = () => {
	const [isActionsVisible, setActionsVisible] = React.useState(false)
	const actionsHaveBeenSeenOnce = React.useRef(false)
	const match = useRouteMatch()
	const history = useHistory()

	const { data } = useQuery(profileQuery, {
		skip: !localStorage.getItem('nw-portal-sess')
	})

	const profile = data?.profile

	const filteredLocations = React.useMemo(() => {
		if (profile.appointments.upcoming.length === 0 && profile.appointments.past.length === 0) {
			return profile.locations
		}

		let locationIds = {}

		profile.appointments.upcoming.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		profile.appointments.past.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		return profile.locations.filter(location => !!locationIds[location.id])
	}, [profile])

	const shouldRedirectToLastAppointment =
		filteredLocations.length === 1 || filteredLocations.length <= profile.locations.length

	const handleCheckin = () => {
		if (shouldRedirectToLastAppointment) {
			history.push(
				generatePath(LOCATION_CHECKIN, {
					uuid: filteredLocations[0].uuid
				}),
				{ from: history.location.pathname }
			)
		} else {
			history.push(LOCATION_SEARCH, { action: 'checkin' }, { from: history.location.pathname })
		}
	}

	const handleCreateAppointment = () => {
		if (shouldRedirectToLastAppointment) {
			history.push(generatePath(LOCATION_APPOINTMENT, { uuid: filteredLocations[0].uuid }), {
				from: history.location.pathname
			})
		} else {
			history.push(LOCATION_SEARCH, { action: 'checkin' }, { from: history.location.pathname })
		}
	}

	return (
		<Container className="fixed bottom-0 left-0 w-full bg-white z-50 border-gray-200 border-t">
			<div
				className={clsx('action-bar fixed w-full', {
					'navbar-show-actions': isActionsVisible,
					'navbar-hide-actions': !isActionsVisible && !!actionsHaveBeenSeenOnce.current
				})}
				style={{ bottom: 110, left: 0 }}
			>
				<div
					style={{ borderRadius: 50 }}
					className="w-11/12 shadow-lg bg-indigo-500 px-4 py-3 mx-auto text-white flex"
				>
					<div
						onClick={handleCheckin}
						className="jaf-domus shadow flex-1 text-center cursor-pointer mr-1 bg-white rounded-l-full flex hover:bg-gray-100 items-center justify-center flex-col text-indigo-500 font-black px-2 py-2 text-sm"
					>
						<FaCalendarCheck className="text-2xl mb-1" />
						Check In Now
					</div>
					<div
						onClick={handleCreateAppointment}
						className="jaf-domus shadow flex-1 text-center cursor-pointer ml-1 bg-white rounded-r-full flex hover:bg-gray-100 items-center justify-center flex-col text-indigo-500 font-black px-2 py-2 text-sm"
					>
						<FaCalendarDay className="text-2xl mb-1" />
						Book Appointment
					</div>
				</div>
			</div>

			<div className="container mx-auto flex items-center justify-around py-2 px-2">
				<Action
					buttonClassName={
						match.path === '/profile/appointments' ? 'text-indigo-500 bg-gray-100' : 'text-gray-700'
					}
					to="/profile/appointments"
				>
					<FiCalendar />
				</Action>

				{match.path === '/l/:uuid' ? (
					//  hide the action btn when on the location page since it shows those primary action btns
					<span />
				) : (
					<div
						onClick={() => {
							actionsHaveBeenSeenOnce.current = true
							setActionsVisible(prev => !prev)
						}}
						className={clsx(
							'main-action-btn rounded text-2xl flex items-center justify-center -mt-12 bg-indigo-500 rounded-full w-16 h-16 border-8 border-white text-white'
						)}
					>
						{isActionsVisible ? (
							<FiX className="close-btn" />
						) : (
							<FiScissors
								className={actionsHaveBeenSeenOnce.current ? 'close-btn' : 'rotate-once'}
							/>
						)}
					</div>
				)}

				<Action
					buttonClassName={
						match.path === USER_PREFERENCES ? 'text-indigo-500 bg-gray-100' : 'text-gray-700'
					}
					to={USER_PREFERENCES}
				>
					<FiUser />
				</Action>
			</div>
		</Container>
	)
}

export default NavFooter
