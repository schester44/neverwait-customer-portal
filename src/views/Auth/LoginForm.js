import React from 'react'
import styled from 'styled-components'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Container = styled('div')`
	width: 100%;

	.form-input {
		width: 100%;
		padding: 8px;
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
						value={values.contactNumber}
						name="contactNumber"
						label="Phone Number"
						onChange={handleChange}
					/>
				</div>

				<div className="form-input">
					<Input type="password" value={values.password} name="password" label="Password" onChange={handleChange} />
				</div>

				<Button
					onClick={handleSubmit}
					style={{ width: '100%', marginTop: 24 }}
					disabled={values.contactNumber.trim().length < 10 || values.password.trim().length < 4 || loading}
				>
					Log In
				</Button>
			</form>
		</Container>
	)
}

export default LoginForm
