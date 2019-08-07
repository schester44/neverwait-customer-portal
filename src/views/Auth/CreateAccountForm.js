import React from 'react'
import styled from 'styled-components'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Container = styled('div')`
	width: 100%;
	height: 100%;

	.form-input {
		width: 100%;
		padding: 8px;
	}
`

const CreateAccountForm = ({ values = {}, setFieldValue, handleSubmit }) => {
	const handleChange = ({ target: { name, value } }) => setFieldValue(name, value)
	return (
		<Container>
			<div className="form-input">
				<Input type="text" value={values.firstName} name="firstName" label="First Name" onChange={handleChange} />
			</div>

			<div className="form-input">
				<Input type="text" value={values.lastName} name="lastName" label="Last Name" onChange={handleChange} />
			</div>

			<div className="form-input">
				<Input
					type="text"
					value={values.contactNumber}
					name="contactNumber"
					label="Phone Number"
					onChange={handleChange}
				/>
			</div>

			<div className="form-input">
				<Input type="text" value={values.password} name="password" label="Password" onChange={handleChange} />
			</div>

			<Button
				onClick={handleSubmit}
				style={{ width: '100%', marginTop: 24 }}
				disabled={
					values.contactNumber.trim().length < 10 ||
					values.password.trim().length < 4 ||
					values.firstName.trim().length === 0
				}
			>
				Create Account
			</Button>
		</Container>
	)
}

export default CreateAccountForm
