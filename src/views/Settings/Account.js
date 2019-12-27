import React from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { FiArrowLeft } from 'react-icons/fi'

import { updateProfileMutation } from '../../graphql/mutations'

import Button from '../../components/Button'
import Input from '../../components/Input'
import pling from '../../components/Pling'

import { USER_PREFERENCES } from '../../routes'

const Account = ({ profile }) => {
	const history = useHistory()
	const [values, setValues] = React.useState(profile)
	const [updateProfile, { loading }] = useMutation(updateProfileMutation)

	const isDisabled =
		values.phoneNumber.trim().length < 10 ||
		values.firstName.trim().length === 0 ||
		loading ||
		isNaN(parseInt(values.phoneNumber))

	const handleSubmit = async () => {
		const { firstName, lastName, phoneNumber } = values

		if (isDisabled) {
			return
		}

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

	const handleChange = ({ target: { name, value } }) =>
		setValues(prev => ({ ...prev, [name]: value }))

	const onBack = () => history.push(USER_PREFERENCES)

	return (
		<div className="container mx-auto px-4">
			<div className="absolute text-3xl top-0 left-0 mt-2 ml-2 text-gray-900" onClick={onBack}>
				<FiArrowLeft />
			</div>

			<h1 className="mt-2 mb-8 mx-auto text-center font-black">Account</h1>

			<Input
				type="text"
				value={values.firstName}
				name="firstName"
				label="First Name"
				onChange={handleChange}
			/>

			<Input
				type="text"
				value={values.lastName}
				name="lastName"
				label="Last Name"
				onChange={handleChange}
			/>

			<Input
				type="tel"
				value={values.phoneNumber}
				name="phoneNumber"
				label="Phone Number"
				onChange={handleChange}
			/>

			<Button className="w-full mt-8" onClick={handleSubmit} disabled={isDisabled}>
				Update Account
			</Button>
		</div>
	)
}

export default Account
