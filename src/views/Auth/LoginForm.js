import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { AUTH_FORGOT_PASSWORD } from '../../routes'

const Container = styled('div')`
	width: 100%;

	.form-input {
		width: 100%;
		padding: 8px 0;
	}
`

const LoginForm = ({ loading = false, values = {}, setFieldValue, handleSubmit }) => {
	const handleChange = ({ target: { name, value } }) => setFieldValue(name, value)
	return (
		<Container>
			<form onSubmit={handleSubmit}>
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
					<Input type="password" value={values.password} name="password" label="Password" onChange={handleChange} />
				</div>

				<div>
					<Link style={{ color: 'rgba(237, 209, 129, 1.0)', fontSize: '.8rem', lineHeight: 1 }} to={AUTH_FORGOT_PASSWORD}>
						Forgot Password?
					</Link>
				</div>

				<Button
					className="login-submit-btn"
					onClick={handleSubmit}
					style={{ width: '100%', marginTop: 24 }}
					disabled={values.phoneNumber.trim().length < 10 || values.password.trim().length < 4 || loading}
				>
					Log In
				</Button>
			</form>
		</Container>
	)
}

export default LoginForm
