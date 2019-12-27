import React from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { AUTH_FORGOT_PASSWORD } from '../../routes'

const LoginForm = ({ loading = false, values = {}, setFieldValue, handleSubmit }) => {
	const handleChange = ({ target: { name, value } }) => setFieldValue(name, value)

	const disabled = values.phoneNumber.trim().length < 10 || values.password.trim().length < 4

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<Input
					className="mt-4"
					type="tel"
					value={values.phoneNumber}
					name="phoneNumber"
					label="Phone Number"
					onChange={handleChange}
				/>

				<Input
					className="mt-4"
					type="password"
					value={values.password}
					name="password"
					label="Password"
					onChange={handleChange}
				/>

				<div className="text-sm mt-6">
					<Link to={AUTH_FORGOT_PASSWORD}>Forgot Password?</Link>
				</div>

				<Button onClick={handleSubmit} className="w-full mt-6" disabled={disabled || loading}>
					Log In
				</Button>
			</form>
		</div>
	)
}

export default LoginForm
