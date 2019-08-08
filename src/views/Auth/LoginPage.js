import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import LoginForm from './LoginForm'

import { loginCustomerMutation } from '../../graphql/mutations'

const LoginPage = () => {
	const [login, { loading }] = useMutation(loginCustomerMutation)

	const [fields, set] = React.useState({
		firstName: '',
		lastName: '',
		contactNumber: '',
		password: ''
	})

	const setFieldValue = (k, v) => {
		set(p => ({ ...p, [k]: v }))
	}
	const handleSubmit = async () => {
		await login({
			variables: {
				input: {
					contactNumber: fields.contactNumber,
					password: fields.password
				}
			}
		})

		window.location.reload()
	}

	return (
		<div style={{ background: 'white', width: '100%', height: '100vh', padding: 10 }}>
			<h1 style={{ textAlign: 'center', padding: 24 }}>NeverWait</h1>

			<h2 style={{ padding: '0 0 10px 10px', fontWeight: 400 }}>Login</h2>

			<LoginForm loading={loading} values={fields} setFieldValue={setFieldValue} handleSubmit={handleSubmit} />
		</div>
	)
}

export default LoginPage
