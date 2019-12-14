import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'
import LoginForm from './LoginForm'

import { loginProfileMutation } from '../../graphql/mutations'
import { AUTH_REGISTER } from '../../routes'
import Button from '../../components/Button'
import { lighten } from 'polished'

const themeStyles = ({ theme }) => `
	.title  {
		color: ${theme.colors.brand};
	}
`

const Container = styled('div')`
	width: 100%;
	padding: 10px;
	max-width: 768px;
	margin: 0 auto;
	padding-bottom: 40px;

	.separator {
		width: 100%;
		text-align: center;
		position: relative;
		margin: 20px 5px;
		color: ${({ theme }) => lighten(0.2, theme.colors.brand)};

		& > div {
			&:before {
				left: 0;
				top: 10px;
				position: absolute;
				content: ' ';
				width: calc(50% - 15px);
				height: 1px;
				background: ${({ theme }) => lighten(0.5, theme.colors.brand)};
			}

			&:after {
				right: 5px;
				top: 10px;
				position: absolute;
				content: ' ';
				width: calc(50% - 20px);
				height: 1px;
				background: ${({ theme }) => lighten(0.5, theme.colors.brand)};
			}
		}
	}

	.create-account-btn {
		width: 100%;
	}

	.title {
		text-align: center;
		padding: 16px;
		font-size: 18px;
	}

	${themeStyles};
`

const LoginPage = ({ action, isAttemptingAction }) => {
	const history = useHistory()
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
			localStorage.setItem('nw-portal-sess', true)
			window.location.reload()
		}
	}

	return (
		<Container>
			<h1 className="title">LOG IN</h1>

			<LoginForm
				loading={loading}
				values={fields}
				setFieldValue={setFieldValue}
				handleSubmit={handleSubmit}
			/>

			<div className="separator">
				<div>or</div>
			</div>

			{isAttemptingAction && (
				<div>
					<p className="small-sub-text" style={{ textAlign: 'center', marginBottom: 14 }}>
						Create an account. Its fast, easy, and free!
					</p>
				</div>
			)}

			<Link
				to={{ pathname: AUTH_REGISTER, state: { action, pathname: history.location.pathname } }}
			>
				<Button className="create-account-btn" ghost>
					Create An Account
				</Button>
			</Link>
		</Container>
	)
}

export default LoginPage
