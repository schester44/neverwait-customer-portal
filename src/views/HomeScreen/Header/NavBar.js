import React from 'react'
import { NavLink } from 'react-router-dom'
import Menu from './Menu'

const NavBar = () => {
	return (
		<Menu className="app-header__menu">
			<NavLink to="/appointments/upcoming">
				<Menu.Item>Upcoming</Menu.Item>
			</NavLink>

			<NavLink to="/appointments/past">
				<Menu.Item>Past</Menu.Item>
			</NavLink>
		</Menu>
	)
}

export default NavBar
