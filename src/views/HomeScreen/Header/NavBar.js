import React from 'react'
import { generatePath, NavLink } from 'react-router-dom'
import { USER_APPOINTMENTS } from '../../../routes'

const NavBar = () => {
	return (
		<div className="flex overflow-hidden justify-around items-end px-2 relative">
			<NavLink
				className="user-navbar flex-1 text-gray-600"
				to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })}
			>
				<div className="action-link h-full w-full text-center px-2 py-4 cursor-pointer border-b-2 border-transparent text-sm font-bold">
					UPCOMING
				</div>
			</NavLink>

			<NavLink
				className="user-navbar flex-1 text-gray-600"
				to={generatePath(USER_APPOINTMENTS, { type: 'past' })}
			>
				<div className="action-link h-full w-full text-center px-2 py-4 cursor-pointer border-b-2 border-transparent text-sm font-bold">
					PAST
				</div>
			</NavLink>
		</div>
	)
}

export default NavBar
