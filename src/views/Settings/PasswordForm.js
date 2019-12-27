import React from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { FiArrowLeft } from 'react-icons/fi'

import { changePasswordMutation } from '../../graphql/mutations'

import Button from '../../components/Button'
import Input from '../../components/Input'
import pling from '../../components/Pling'

import { USER_PREFERENCES } from '../../routes'

const PasswordForm = () => {
	const history = useHistory()
	const [values, setValues] = React.useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: ''
	})
	const [changePassword, { loading }] = useMutation(changePasswordMutation)

	const isDisabled =
		values.newPassword.trim().length < 4 ||
		values.newPassword !== values.confirmNewPassword ||
		loading

	const handleSubmit = async () => {
		const { currentPassword, newPassword } = values

		if (isDisabled) return

		await changePassword({
			variables: {
				currentPassword,
				newPassword
			}
		})

		pling({ message: 'Password updated!', intent: 'info' })
	}

	const handleChange = ({ target: { name, value } }) =>
		setValues(prev => ({ ...prev, [name]: value }))

	const onBack = () => history.push(USER_PREFERENCES)

	return (
		<div className="px-4 mx-auto container">
			<div className="absolute text-3xl top-0 left-0 mt-2 ml-2 text-gray-900" onClick={onBack}>
				<FiArrowLeft />
			</div>

			<h1 className="mt-2 mb-8 mx-auto text-center font-black">Change Password</h1>

			<Input
				type="password"
				value={values.currentPassword}
				name="currentPassword"
				label="Current Password"
				onChange={handleChange}
			/>

			<Input
				type="password"
				value={values.newPassword}
				name="newPassword"
				label="New Password"
				onChange={handleChange}
			/>

			<Input
				type="password"
				value={values.confirmNewPassword}
				name="confirmNewPassword"
				label="Confirm New Password"
				onChange={handleChange}
			/>

			<Button onClick={handleSubmit} className="w-full mt-8" disabled={isDisabled}>
				Change Password
			</Button>
		</div>
	)
}

export default PasswordForm
