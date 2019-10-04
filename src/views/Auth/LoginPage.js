import React from 'react'
import ReactGA from 'react-ga'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'
import LoginForm from './LoginForm'

import { loginProfileMutation } from '../../graphql/mutations'
import { AUTH_REGISTER, AUTH_LOGIN } from '../../routes'
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

	.separator {
		width: 100%;
		text-align: center;
		position: relative;
		margin: 20px 5px;

		& > div {
			&:before {
				left: 0;
				top: 10px;
				position: absolute;
				content: ' ';
				width: calc(50% - 15px);
				height: 1px;
				background: rgba(249, 249, 249, 0.2);
			}

			&:after {
				right: 0;
				top: 10px;
				position: absolute;
				content: ' ';
				width: calc(50% - 15px);
				height: 1px;
				background: rgba(249, 249, 249, 0.2);
			}
		}
	}

	.create-account-btn {
		width: 100%;
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
	React.useEffect(() => {
		ReactGA.pageview(AUTH_LOGIN)
	}, [])

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

			<div className="separator">
				<div>or</div>
			</div>

			<Link to={AUTH_REGISTER}>
				<Button className="create-account-btn" size="small" ghost>
					Create An Account
				</Button>
			</Link>
		</Container>
	)
}

export default LoginPage
