import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { FiChevronLeft } from 'react-icons/fi'

import { updateProfileMutation } from '../../graphql/mutations'

import Button from '../../components/Button'
import Input from '../../components/Input'
import pling from '../../components/Pling'

import { Header } from '../HomeScreen/Header'
import { USER_PREFERENCES } from '../../routes'

const Container = styled('div')`
	width: 100%;
	min-height: 100%;
	position: relative;

	.back {
		position: absolute;
		font-size: 32px;
		line-height: 1;
		left: 10px;
		top: 7px;
	}

	.content {
		padding: 20px;
	}

	.form-input {
		width: 100%;
		padding: 8px 0;
	}
`

const Account = ({ profile }) => {
	const history = useHistory()
	const [values, setValues] = React.useState(profile)
	const [updateProfile, { loading }] = useMutation(updateProfileMutation)

	const handleSubmit = async () => {
		const { firstName, lastName, phoneNumber } = values

		await updateProfile({
			variables: {
				input: {
					firstName,
					lastName,
					phoneNumber
				}
			}
		})

		pling({ message: 'Account updated!', intent: 'info' })
	}

	const handleChange = ({ target: { name, value } }) => setValues(prev => ({ ...prev, [name]: value }))

	const onBack = () => history.push(USER_PREFERENCES)

	return (
		<Container>
			<Header title="Edit Account">
				<div className="back" onClick={onBack}>
					<FiChevronLeft />
				</div>
			</Header>

			<div className="content">
				<div className="form-input">
					<Input type="text" value={values.firstName} name="firstName" label="First Name" onChange={handleChange} />
				</div>

				<div className="form-input">
					<Input type="text" value={values.lastName} name="lastName" label="Last Name" onChange={handleChange} />
				</div>

				<div className="form-input">
					<Input
						type="tel"
						value={values.phoneNumber}
						name="phoneNumber"
						label="Phone Number"
						onChange={handleChange}
					/>
				</div>

				<Button
					onClick={handleSubmit}
					style={{ width: '100%', marginTop: 24 }}
					disabled={values.phoneNumber.trim().length < 10 || values.firstName.trim().length === 0 || loading}
				>
					Update Account
				</Button>
			</div>
		</Container>
	)
}

export default Account
