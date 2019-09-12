import React from 'react'
import { generatePath, NavLink } from 'react-router-dom'
import Menu from './Menu'
import { USER_APPOINTMENTS } from '../../../routes'

const NavBar = () => {
	return (
		<Menu className="app-header__menu">
			<NavLink to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })}>
				<Menu.Item data-cy="user-nav-upcoming">UPCOMING</Menu.Item>
			</NavLink>

			<NavLink to={generatePath(USER_APPOINTMENTS, { type: 'past' })}>
				<Menu.Item data-cy="user-nav-past">PAST</Menu.Item>
			</NavLink>
		</Menu>
	)
}

export default NavBar
