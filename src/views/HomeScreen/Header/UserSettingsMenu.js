import React from 'react'
import { Link } from 'react-router-dom'
import Drawer from '../Drawer'
import Menu from '../../../components/Menu'
import { USER_PAYMENT_METHODS, USER_PREFERENCES } from '../../../routes'

import { useMutation } from '@apollo/react-hooks'

import { customerLogout } from '../../../graphql/mutations'

const UserSettingsMenu = ({ onClose }) => {
	const [logout] = useMutation(customerLogout)

	const onLogout = async () => {
		console.log('logout')
		await logout()
		window.location.reload()
	}

	return (
		<Drawer title="Settings" onClose={onClose}>
			<Menu>
				{/* 
				<Link to={USER_ACCOUNT_SETTINGS}>
					<Menu.Item>Account</Menu.Item>
				</Link>
				<Link to={USER_PREFERENCES}>
					<Menu.Item>Preferences</Menu.Item>
				</Link>
				<Link to={USER_PAYMENT_METHODS}>
					<Menu.Item>Payment Methods</Menu.Item>
				</Link> */}
				<Menu.Item onClick={onLogout}>Log Out</Menu.Item>
			</Menu>
		</Drawer>
	)
}

export default UserSettingsMenu
