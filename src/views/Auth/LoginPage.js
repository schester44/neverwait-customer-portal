import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import LoginForm from './LoginForm'

import { loginProfileMutation } from '../../graphql/mutations'
import { AUTH_REGISTER } from '../../routes'
import Button from '../../components/Button'

const LoginPage = ({ action, isAttemptingAction }) => {
	const history = useHistory()
	const [login, { loading }] = useMutation(loginProfileMutation)

	const [fields, set] = React.useState({
		phoneNumber: '',
		password: ''
	})

	const setFieldValue = (k, v) => {
		set(p => ({ ...p, [k]: v }))
	}

	const handleSubmit = async () => {
		const { data } = await login({
			variables: {
				input: {
					phoneNumber: fields.phoneNumber,
					password: fields.password
				}
			}
		})

		if (data.loginProfile) {
			localStorage.setItem('nw-portal-sess', true)
			window.location.reload()
		}
	}

	return (
		<div className="mx-auto px-4 max-w-2xl">
			<h1 className="mt-4 mb-6 mx-auto text-center font-black">LOG IN</h1>

			<LoginForm
				loading={loading}
				values={fields}
				setFieldValue={setFieldValue}
				handleSubmit={handleSubmit}
			/>

			<div className="w-full text-center text-gray-500 my-4">or</div>

			<Link
				to={{ pathname: AUTH_REGISTER, state: { action, pathname: history.location.pathname } }}
			>
				<Button className="w-full" type="ghost">
					Create An Account
				</Button>
			</Link>

			{isAttemptingAction && (
				<div>
					<p className="text-center text-gray-600 text-sm mt-4">
						Creating an account is fast, easy, and free! Plus it makes booking appointments super
						quick!
					</p>
				</div>
			)}
		</div>
	)
}

export default LoginPage
