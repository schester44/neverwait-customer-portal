import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { FiChevronLeft } from 'react-icons/fi'

import { changePasswordMutation } from '../../graphql/mutations'

import Button from '../../components/Button'
import Input from '../../components/Input'
import pling from '../../components/Pling'

import { Header } from '../HomeScreen/Header'
import { USER_PREFERENCES } from '../../routes'

const Container = styled('div')`
	width: 100%;
	min-height: 100%;
	position: relative;

	.back {
		position: absolute;
		font-size: 32px;
		line-height: 1;
		left: 10px;
		top: 7px;
	}

	.content {
		padding: 20px;
	}

	.form-input {
		width: 100%;
		padding: 8px 0;
	}
`

const PasswordForm = () => {
	const history = useHistory()
	const [values, setValues] = React.useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
	const [changePassword, { loading }] = useMutation(changePasswordMutation)

	const handleSubmit = async () => {
		const { currentPassword, newPassword } = values

		await changePassword({
			variables: {
				currentPassword,
				newPassword
			}
		})

		pling({ message: 'Password updated!', intent: 'info' })
	}

	const handleChange = ({ target: { name, value } }) => setValues(prev => ({ ...prev, [name]: value }))

	const onBack = () => history.push(USER_PREFERENCES)

	return (
		<Container>
			<Header title="Change Password">
				<div className="back" onClick={onBack}>
					<FiChevronLeft />
				</div>
			</Header>

			<div className="content">
				<div className="form-input">
					<Input
						type="password"
						value={values.currentPassword}
						name="currentPassword"
						label="Current Password"
						onChange={handleChange}
					/>
				</div>

				<div className="form-input">
					<Input
						type="password"
						value={values.newPassword}
						name="newPassword"
						label="New Password"
						onChange={handleChange}
					/>
				</div>

				<div className="form-input">
					<Input
						type="password"
						value={values.confirmNewPassword}
						name="confirmNewPassword"
						label="Confirm New Password"
						onChange={handleChange}
					/>
				</div>

				<Button
					onClick={handleSubmit}
					style={{ width: '100%', marginTop: 24 }}
					disabled={values.newPassword.trim().length < 4 || values.newPassword !== values.confirmNewPassword || loading}
				>
					Change Password
				</Button>
			</div>
		</Container>
	)
}

export default PasswordForm
