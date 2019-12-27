import React from 'react'
import styled from 'styled-components'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Container = styled('div')`
	width: 100%;
	height: 100%;

	.form-input {
		width: 100%;
		padding: 8px 0;
	}
`

const CreateAccountForm = ({ values = {}, setFieldValue, loading = false, handleSubmit }) => {
	const handleChange = ({ target: { name, value } }) => {
		return setFieldValue(name, name === 'phoneNumber' ? value.replace(/[^0-9]/g, '') : value)
	}

	const disabled =
		values.phoneNumber.trim().length < 10 ||
		values.password.trim().length < 4 ||
		values.password.trim() !== values.confirmPassword.trim() ||
		values.firstName.trim().length === 0

	return (
		<Container>
			<p className="text-gray-600 leading-snug text-sm">
				We send text message notifications to remind you of upcoming appointments so it's best to
				use a cell phone if possible.
			</p>

			<div className="form-input">
				<Input
					type="text"
					value={values.firstName}
					name="firstName"
					label="First Name"
					onChange={handleChange}
				/>
			</div>

			<div className="form-input">
				<Input
					type="text"
					value={values.lastName}
					name="lastName"
					label="Last Name"
					onChange={handleChange}
				/>
			</div>

			<div className="form-input">
				<Input
					type="tel"
					value={values.phoneNumber}
					name="phoneNumber"
					label="Phone Number"
					onChange={handleChange}
				/>
			</div>

			<div className="form-input">
				<Input
					type="password"
					value={values.password}
					name="password"
					label="Password"
					onChange={handleChange}
				/>
			</div>

			<div className="form-input">
				<Input
					type="password"
					value={values.confirmPassword}
					name="confirmPassword"
					label="Confirm Password"
					onChange={handleChange}
				/>
			</div>

			<Button className="w-full mt-4" onClick={handleSubmit} disabled={disabled || loading}>
				Create Account
			</Button>
		</Container>
	)
}

export default CreateAccountForm
