import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'
import LoginForm from './LoginForm'

import { loginCustomerMutation } from '../../graphql/mutations'

const themeStyles = ({ theme }) => `
	background: ${theme.colors.n700};
`

const Container = styled('div')`
	width: 100%;
	min-height: 100vh;
	padding: 10px;
	max-width: 768px;
	margin: 0 auto;
	padding-bottom: 40px;

	.title {
		text-align: center;
		padding: 24px;
	}

	.subtitle {
		padding: 0 0 10px 10px;
		font-weight: 400;
	}

	${themeStyles};
`

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
		<Container>
			<h1 className="title">NeverWait</h1>

			<h2 className="subtitle">Login</h2>

			<LoginForm loading={loading} values={fields} setFieldValue={setFieldValue} handleSubmit={handleSubmit} />
		</Container>
	)
}

export default LoginPage
