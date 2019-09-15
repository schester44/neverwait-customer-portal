import React from 'react'
import omit from 'lodash/omit'
import styled from 'styled-components'
import Button from '../components/Button'

import Modal from './Auth/Modal'
import LoginForm from './Auth/LoginForm'
import CreateAccountForm from './Auth/CreateAccountForm'
import { useMutation } from '@apollo/react-hooks'
import { registerProfileMutation, loginProfileMutation } from '../graphql/mutations'

const Container = styled('div')`
	width: 100%;
	text-align: center;
	margin-top: 24px;

	h4 {
		margin: 24px 0;
	}

	p {
		margin: 24px 0;
	}
`

const CustomerAuthView = ({ onLogin }) => {
	const [registerProfile, { loading: createLoading }] = useMutation(registerProfileMutation)
	const [login, { loading: loginLoading }] = useMutation(loginProfileMutation)
	const [{ values, visibleView }, setFormState] = React.useState({
		visibleView: undefined,
		values: {}
	})

	const isLoading = loginLoading || createLoading

	const setFieldValue = (k, v) => {
		setFormState(prev => ({ ...prev, values: { ...prev.values, [k]: v } }))
	}

	const handleLogin = async (phoneNumber, password) => {
		const {
			data: { loginProfile }
		} = await login({
			variables: {
				input: {
					phoneNumber,
					password
				}
			}
		})

		if (loginProfile && loginProfile.id) {
			onLogin(loginProfile)
		}
	}

	const handleCreateAccount = async () => {
		try {
			const {
				data: { registerProfile: response }
			} = await registerProfile({
				variables: {
					input: omit(values, ['confirmPassword'])
				}
			})

			if (response && response.id) {
				handleLogin(values.phoneNumber, values.password)
			} else {
				alert('Failed to create an account.')
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<Container>
			{visibleView && (
				<Modal
					title={visibleView === 'login' ? 'Log in' : 'Create Account'}
					onClose={() => setFormState({ loading: false, values: {}, visibleView: undefined })}
				>
					{visibleView === 'login' && (
						<LoginForm
							values={values}
							loading={isLoading}
							setFieldValue={setFieldValue}
							handleSubmit={() => handleLogin(values.phoneNumber, values.password)}
						/>
					)}
					{visibleView === 'create-account' && (
						<CreateAccountForm
							loading={isLoading}
							values={values}
							setFieldValue={setFieldValue}
							handleSubmit={handleCreateAccount}
						/>
					)}
				</Modal>
			)}

			<h4>Create an account or login to continue.</h4>
			<Button
				style={{ width: '100%' }}
				onClick={() => {
					setFormState({
						loading: false,
						visibleView: 'create-account',
						values: {
							firstName: '',
							lastName: '',
							phoneNumber: '',
							password: '',
							confirmPassword: ''
						}
					})
				}}
			>
				Create an account
			</Button>
			<p style={{ marginTop: '10%' }}>Already have an account?</p>
			<Button
				style={{ width: '100%' }}
				onClick={() => {
					setFormState({
						loading: false,
						visibleView: 'login',
						values: {
							phoneNumber: '',
							password: ''
						}
					})
				}}
			>
				Sign In
			</Button>
		</Container>
	)
}

export default CustomerAuthView
