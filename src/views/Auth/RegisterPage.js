import React from 'react'
import ReactGA from 'react-ga'
import { Link, useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import omit from 'lodash/omit'
import { FiArrowLeft } from 'react-icons/fi'

import CreateAccountForm from './CreateAccountForm'
import { loginProfileMutation, registerProfileMutation } from '../../graphql/mutations'

import { USER_DASHBOARD, AUTH_LOGIN } from '../../routes'
import Button from '../../components/Button'

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
			if (history.location.state?.action && history.location.state?.pathname) {
				history.push(history.location.state.pathname)
			} else {
				history.push(USER_DASHBOARD)
			}

			window.location.reload()
		}
	}

	return (
		<div className="container mx-auto px-4 pb-4">
			<Link to="/" className="absolute top-0 left-0 mt-4 ml-4 text-3xl text-gray-900">
				<div className="back">
					<FiArrowLeft />
				</div>
			</Link>

			<h1 className="mt-4 mb-6 mx-auto text-center font-black">SIGN UP</h1>

			<CreateAccountForm
				loading={loading || createLoading}
				values={fields}
				setFieldValue={setFieldValue}
				handleSubmit={handleSubmit}
			/>

			<div className="w-full border border-gray-200 mt-4 h-0" />

			<p className="text-center text-sm text-gray-600 mt-4 mb-4">Already have an account?</p>

			<Link to={AUTH_LOGIN}>
				<Button type="ghost" className="w-full btn-sm">
					Log In
				</Button>
			</Link>
		</div>
	)
}

export default CreateAccount
