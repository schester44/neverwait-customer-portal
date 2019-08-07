import React from 'react'
import styled from 'styled-components'
import Button from '../components/Button'

import Modal from './Auth/Modal'
import LoginForm from './Auth/LoginForm'
import CreateAccountForm from './Auth/CreateAccountForm'
import { useMutation } from '@apollo/react-hooks'
import { createCustomerMutation, loginCustomerMutation } from '../graphql/mutations'

const Link = styled('span')`
	cursor: pointer;
	color: rgba(237, 209, 129, 1);
	font-weight: 500;
`

const Container = styled('div')`
	width: 100%;
	text-align: center;
	margin-top: 24px;

	h3 {
		margin: 24px 0;
	}

	p {
		margin: 14px 0;
		color: rgba(240, 240, 240, 1);
	}
`

const CustomerAuthView = ({ companyId, onLogin }) => {
	const [createCustomer, { loading: createLoading }] = useMutation(createCustomerMutation)
	const [login, { loading: loginLoading }] = useMutation(loginCustomerMutation)
	const [{ values, visibleView }, setFormState] = React.useState({
		visibleView: undefined,
		values: {}
	})
	
	const isLoading = loginLoading || createLoading

	const setFieldValue = (k, v) => {
		setFormState(prev => ({ ...prev, values: { ...prev.values, [k]: v } }))
	}

	const handleLogin = async (contactNumber, password) => {
		const {
			data: { loginCustomer }
		} = await login({
			variables: {
				input: {
					contactNumber,
					password
				}
			}
		})

		if (loginCustomer && loginCustomer.id) {
			onLogin(loginCustomer)
		}
	}

	const handleCreateAccount = async () => {
		const {
			data: { createCustomer: response }
		} = await createCustomer({
			variables: {
				input: values
			}
		})

		if (response && response.id) {
			handleLogin(values.contactNumber, values.password)
		} else {
			alert('Failed to create an account.')
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
							handleSubmit={() => handleLogin(values.contactNumber, values.password)}
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

			<h3>Create an account or login to continue.</h3>
			<Button
				style={{ width: '100%' }}
				onClick={() => {
					setFormState({
						loading: false,
						visibleView: 'create-account',
						values: {
							companyId,
							firstName: '',
							lastName: '',
							contactNumber: '',
							password: ''
						}
					})
				}}
			>
				Create an account
			</Button>
			<p>
				Already have a NeverWait account?{' '}
				<Link
					onClick={() => {
						setFormState({
							loading: false,
							visibleView: 'login',
							values: {
								contactNumber: '',
								password: ''
							}
						})
					}}
				>
					Log In
				</Link>
			</p>
		</Container>
	)
}

export default CustomerAuthView
