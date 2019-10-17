import React from 'react'
import ReactGA from 'react-ga'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useMutation } from '@apollo/react-hooks'
import omit from 'lodash/omit'
import { FiChevronLeft } from 'react-icons/fi'

import CreateAccountForm from './CreateAccountForm'

import { loginProfileMutation, registerProfileMutation } from '../../graphql/mutations'

import { USER_DASHBOARD } from '../../routes'

const themeStyles = ({ theme }) => `
	.back {
		color: ${theme.colors.brand};
	}
`

const Container = styled('div')`
	width: 100%;
	min-height: 100vh;
	padding: 10px;
	max-width: 1200px;
	margin: 0 auto;
	padding-bottom: 40px;

	.register-btn {
		margin-top: 5vh;
		text-align: center;

		p {
			margin-bottom: 8px;
		}
	}

	.back {
		position: absolute;
		top: 24px;
		left: 10px;
		font-size: 28px;
		line-height: 1;
	}

	.title {
		text-align: center;
		padding: 16px;
		font-size: 18px;
	}

	${themeStyles};
`

const CreateAccount = () => {
	const history = useHistory()

	const [login, { loading }] = useMutation(loginProfileMutation)
	const [registerProfile, { loading: createLoading }] = useMutation(registerProfileMutation)

	const [fields, set] = React.useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		password: '',
		confirmPassword: ''
	})

	const setFieldValue = (k, v) => {
		set(p => ({ ...p, [k]: v }))
	}

	const handleSubmit = async () => {
		try {
			const {
				data: { registerProfile: response }
			} = await registerProfile({
				variables: {
					input: omit(fields, ['confirmPassword'])
				}
			})

			ReactGA.event({
				category: 'Auth',
				action: 'AccountCreated',
				label: 'RegisterPage'
			})

			if (response && response.id) {
				handleLogin(fields.phoneNumber, fields.password)
			} else {
				alert('Failed to create an account.')
			}
		} catch (error) {
			console.error(error)
		}
	}

	const handleLogin = async (phoneNumber, password) => {
		const { data } = await login({
			variables: {
				input: {
					phoneNumber,
					password
				}
			}
		})

		if (data?.loginProfile) {
			history.push(USER_DASHBOARD)
			window.location.reload()
		}
	}

	return (
		<Container>
			<Link to="/">
				<div className="back">
					<FiChevronLeft />
				</div>
			</Link>

			<h1 className="title">SIGN UP</h1>

			<CreateAccountForm
				loading={loading || createLoading}
				values={fields}
				setFieldValue={setFieldValue}
				handleSubmit={handleSubmit}
			/>
		</Container>
	)
}

export default CreateAccount
