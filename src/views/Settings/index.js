import React from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { FiEdit, FiLogOut, FiLock } from 'react-icons/fi'

import { customerLogout } from '../../graphql/mutations'

import NavFooter from '../../components/NavFooter'

import {
	USER_SETTINGS_EDIT_ACCOUNT,
	USER_SETTINGS_CHANGE_PASSWORD,
	USER_PREFERENCES
} from '../../routes'
import PasswordForm from './PasswordForm'

const EditAccount = React.lazy(() => import('./Account'))

const MenuItem = ({ icon: Icon, text, ...props }) => {
	return (
		<div
			className="border-b-2 text-xl cursor-pointer flex items-center px-4 py-4 border-gray-200"
			{...props}
		>
			<div className="mr-2 text-gray-900">{Icon && <Icon />}</div>
			<div className="text text-gray-600">{text}</div>
		</div>
	)
}

const UserSettingsMenu = ({ profile }) => {
	const [logout] = useMutation(customerLogout)

	const onLogout = async () => {
		await logout()

		localStorage.removeItem('nw-portal-sess')
		window.location.reload()
	}

	return (
		<div>
			<Switch>
				<Route exact path={USER_SETTINGS_EDIT_ACCOUNT}>
					<EditAccount profile={profile} />
				</Route>

				<Route exact path={USER_SETTINGS_CHANGE_PASSWORD}>
					<PasswordForm />
				</Route>

				<Route exact path={USER_PREFERENCES}>
					<div className="mx-auto px-2 container">
						<h1 className="my-4 text-4xl mx-auto text-center font-black">Settings</h1>

						<Link className="text-gray-900" to={USER_SETTINGS_EDIT_ACCOUNT}>
							<MenuItem icon={FiEdit} text="Edit Account" />
						</Link>

						<Link className="text-gray-900" to={USER_SETTINGS_CHANGE_PASSWORD}>
							<MenuItem icon={FiLock} text="Change Password" />
						</Link>

						<MenuItem icon={FiLogOut} text="Sign Out" onClick={onLogout} />
					</div>
				</Route>

				<Redirect to="/" />
			</Switch>

			<NavFooter />
		</div>
	)
}

export default UserSettingsMenu
