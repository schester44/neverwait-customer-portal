import React from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'

import { AUTH_FORGOT_PASSWORD } from '../../routes'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { loginProfileMutation, forgotPasswordMutation, resetPasswordMutation } from '../../graphql/mutations'

const themeStyles = ({ theme }) => `
	background: ${theme.colors.n700};
`

const Container = styled('div')`
	width: 100%;
	min-height: 100vh;
	padding: 10px 20px;
	max-width: 768px;
	margin: 0 auto;

	.form-input {
		margin-bottom: 16px;
	}

	.form {
		margin-top: 30px;
		margin-bottom: 30px;
	}

	.description {
		opacity: 0.7;
	}

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
		padding-bottom: 10px;
		font-weight: 400;
	}

	${themeStyles};
`

const LoginPage = () => {
	const history = useHistory()

	const [forgotPassword, { loading: forgotPassLoading }] = useMutation(forgotPasswordMutation)
	const [resetPassword, { loading: resetPassLoading }] = useMutation(resetPasswordMutation)
	const [login] = useMutation(loginProfileMutation)

	const [state, setState] = React.useState({
		pinFormVisible: false,
		phoneNumber: '',
		code: '',
		password: ''
	})

	React.useEffect(() => {
		ReactGA.pageview(AUTH_FORGOT_PASSWORD)
	}, [])

	const handleChange = ({ target: { name, value } }) => setState(prev => ({ ...prev, [name]: value }))

	const handleSend = async () => {
		await forgotPassword({
			variables: {
				phoneNumber: state.phoneNumber
			}
		})

		setState(prev => ({ ...prev, pinFormVisible: true }))
	}

	const handlePasswordChange = async () => {
		const { phoneNumber, code, password } = state

		const { data } = await resetPassword({
			variables: {
				input: {
					phoneNumber,
					password,
					code
				}
			}
		})

		if (data?.resetProfilePassword) {
			await login({
				variables: {
					input: {
						phoneNumber: state.phoneNumber,
						password: state.password
					}
				}
			})

			history.push('/')
			window.location.reload()
		}
	}

	return (
		<Container>
			<h1 className="title">NeverWait</h1>
			{!state.pinFormVisible ? (
				<div>
					<h2 className="subtitle">Forgot Password</h2>
					<p className="description">Enter your phone number and we will text you a temporary password.</p>
					<div className="form">
						<div className="form-input">
							<Input
								type="tel"
								value={state.phoneNumber}
								name="phoneNumber"
								label="Phone Number"
								onChange={handleChange}
							/>
						</div>
					</div>
					<Button
						onClick={handleSend}
						disabled={forgotPassLoading || resetPassLoading || state.phoneNumber.trim().length < 10}
						style={{ width: '100%' }}
					>
						Send Temporary Password
					</Button>
				</div>
			) : (
				<div>
					<h2 className="subtitle">Enter Pin</h2>
					<p className="description">
						We sent a pin code to your phone number. To reset your password, enter the code and your new password below.
					</p>
					<div className="form">
						<div className="form-input">
							<Input type="number" value={state.code} name="code" label="Pin Code" onChange={handleChange} />
						</div>

						<div className="form-input">
							<Input
								type="password"
								value={state.password}
								name="password"
								label="New Password"
								onChange={handleChange}
							/>
						</div>
					</div>
					<Button
						onClick={handlePasswordChange}
						disabled={
							forgotPassLoading ||
							resetPassLoading ||
							state.code.trim().length <= 3 ||
							state.password.trim().length <= 3
						}
						style={{ width: '100%' }}
					>
						Update Password
					</Button>
				</div>
			)}
		</Container>
	)
}

export default LoginPage
