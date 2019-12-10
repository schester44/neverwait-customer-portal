import React from 'react'
import styled from 'styled-components'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import { customerLogout } from '../../graphql/mutations'

import NavFooter from '../HomeScreen/NavFooter'
import { Header } from '../HomeScreen/Header'
import { FiEdit, FiLogOut, FiLock } from 'react-icons/fi'

import {
	USER_SETTINGS_EDIT_ACCOUNT,
	USER_SETTINGS_CHANGE_PASSWORD,
	USER_PREFERENCES
} from '../../routes'
import PasswordForm from './PasswordForm'

const EditAccount = React.lazy(() => import('./Account'))

const Container = styled('div')`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;

	.content {
		padding: 20px;
	}
`

const MenuItemContainer = styled('div')`
	width: 100%;
	padding: 20px;
	display: flex;
	align-items: center;
	font-size: 20px;
	cursor: pointer;
	border-bottom: 1px solid #C6CACD;

	.text {
		opacity: 0.7;
	}

	&:hover {
		.text {
			opacity: 1;
		}
	}

	.icon {
		opacity: 1 !important;
		margin-right: 16px;
		font-size: 24px;
	}
`

const MenuItem = ({ icon: Icon, text, ...props }) => {
	return (
		<MenuItemContainer {...props}>
			<div className="icon">{Icon && <Icon />}</div>
			<div className="text">{text}</div>
		</MenuItemContainer>
	)
}

const UserSettingsMenu = ({ profile }) => {
	const [logout] = useMutation(customerLogout)

	const onLogout = async () => {
		await logout()
		window.location.reload()
	}

	return (
		<Container>
			<Switch>
				<Route exact path={USER_SETTINGS_EDIT_ACCOUNT}>
					<EditAccount profile={profile} />
				</Route>

				<Route exact path={USER_SETTINGS_CHANGE_PASSWORD}>
					<PasswordForm />
				</Route>

				<Route exact path={USER_PREFERENCES}>
					<Header title="Settings" />

					<div className="content">
						<Link to={USER_SETTINGS_EDIT_ACCOUNT}>
							<MenuItem icon={FiEdit} text="Edit Account" />
						</Link>

						<Link to={USER_SETTINGS_CHANGE_PASSWORD}>
							<MenuItem icon={FiLock} text="Change Password" />
						</Link>

						<MenuItem icon={FiLogOut} text="Sign Out" onClick={onLogout} />
					</div>
				</Route>

				<Redirect to="/" />
			</Switch>

			<NavFooter />
		</Container>
	)
}

export default UserSettingsMenu
