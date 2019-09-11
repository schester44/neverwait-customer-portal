import React from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'
import LoginForm from './LoginForm'

import { loginProfileMutation } from '../../graphql/mutations'
import { AUTH_REGISTER } from '../../routes'
import Button from '../../components/Button'

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

	.register-btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding-bottom: 20px;
		text-align: center;
		left: 0;
		
		p {
			margin-bottom: 8px;
		}
	}

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
	const [login, { loading }] = useMutation(loginProfileMutation)

	const [fields, set] = React.useState({
		firstName: '',
		lastName: '',
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
			window.location.reload()
		}
	}

	return (
		<Container>
			<h1 className="title">NeverWait</h1>

			<h2 className="subtitle">Login</h2>

			<LoginForm loading={loading} values={fields} setFieldValue={setFieldValue} handleSubmit={handleSubmit} />

			<div className="register-btn">
				<p>Don't have an account?</p>

				<Link to={AUTH_REGISTER}>
					<Button size="small" ghost>
						Create An Account
					</Button>
				</Link>
			</div>
		</Container>
	)
}

export default LoginPage
