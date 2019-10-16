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

	.forgot-password-link {
		margin-top: 16px;

		color: ${({ theme }) => theme.colors.brand};
		font-size: 0.8rem;
		line-height: 1;
	}
`

const LoginForm = ({ loading = false, values = {}, setFieldValue, handleSubmit }) => {
	const handleChange = ({ target: { name, value } }) => setFieldValue(name, value)

	const disabled = values.phoneNumber.trim().length < 10 || values.password.trim().length < 4

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

				<div className="forgot-password-link">
					<Link to={AUTH_FORGOT_PASSWORD}>Forgot Password?</Link>
				</div>

				<Button
					intent={disabled ? 'primary' : 'success'}
					className="login-submit-btn"
					onClick={handleSubmit}
					style={{ width: '100%', marginTop: 24 }}
					disabled={disabled || loading}
				>
					Log In
				</Button>
			</form>
		</Container>
	)
}

export default LoginForm
