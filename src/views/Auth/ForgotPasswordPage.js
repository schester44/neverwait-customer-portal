import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import Button from '../../components/Button'
import Input from '../../components/Input'

import {
	loginProfileMutation,
	forgotPasswordMutation,
	resetPasswordMutation
} from '../../graphql/mutations'

const LoginPage = () => {
	const history = useHistory()

	const [forgotPassword, { loading: forgotPassLoading }] = useMutation(forgotPasswordMutation)
	const [resetPassword, { loading: resetPassLoading }] = useMutation(resetPasswordMutation)
	const [login] = useMutation(loginProfileMutation)

	const [state, setState] = React.useState({
		pinFormVisible: false,
		phoneNumber: '',
		code: '',
		password: ''
	})

	const handleChange = ({ target: { name, value } }) =>
		setState(prev => ({ ...prev, [name]: value }))

	const handleSend = async () => {
		await forgotPassword({
			variables: {
				phoneNumber: state.phoneNumber
			}
		})

		setState(prev => ({ ...prev, pinFormVisible: true }))
	}

	const handlePasswordChange = async () => {
		const { phoneNumber, code, password } = state

		const { data } = await resetPassword({
			variables: {
				input: {
					phoneNumber,
					password,
					code
				}
			}
		})

		if (data?.resetProfilePassword) {
			await login({
				variables: {
					input: {
						phoneNumber: state.phoneNumber,
						password: state.password
					}
				}
			})

			history.push('/profile/appointments')
			window.location.reload()
		}
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-center  text-2xl jaf-domus">NEVERWAIT</h1>
			{!state.pinFormVisible ? (
				<div>
					<h2 className="text-2xl font-black mt-8 mb-4">Forgot Your Password?</h2>
					<p className="text-lg text-gray-600">
						Enter your phone number and we will text you a temporary password.
					</p>

					<Input
						type="tel"
						value={state.phoneNumber}
						name="phoneNumber"
						label="Phone Number"
						onChange={handleChange}
					/>

					<Button
						className="w-full mt-4"
						onClick={handleSend}
						disabled={forgotPassLoading || resetPassLoading || state.phoneNumber.trim().length < 10}
					>
						Send Temporary Password
					</Button>

					<Link to="/">
						<p className="text-indigo-300 text-center text-sm cursor-pointer mt-8">
							or click here to login
						</p>
					</Link>
				</div>
			) : (
				<div>
					<h2 className="text-2xl font-black mt-8 mb-4">Enter Pin</h2>

					<p className="text-lg text-gray-600">
						We sent a pin code to your phone. To reset your password, enter the code and your new
						password below.
					</p>

					<div className="form-input">
						<Input
							type="number"
							value={state.code}
							name="code"
							label="Pin Code"
							onChange={handleChange}
						/>
					</div>

					<div className="form-input">
						<Input
							type="password"
							value={state.password}
							name="password"
							label="New Password"
							onChange={handleChange}
						/>
					</div>

					<Button
						className="w-full mt-4"
						onClick={handlePasswordChange}
						disabled={
							forgotPassLoading ||
							resetPassLoading ||
							state.code.trim().length <= 3 ||
							state.password.trim().length <= 3
						}
					>
						Update Password
					</Button>
				</div>
			)}
		</div>
	)
}

export default LoginPage
