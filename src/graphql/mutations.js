import gql from 'graphql-tag'

import { appointment } from './fragments'

export const forgotPasswordMutation = gql`
	mutation forgotPassword($phoneNumber: String!) {
		forgotProfilePassword(phoneNumber: $phoneNumber)
	}
`

export const resetPasswordMutation = gql`
	mutation resetPassword($input: ResetProfileInput!) {
		resetProfilePassword(input: $input)
	}
`

export const registerProfileMutation = gql`
	mutation registerProfile($input: CreateOnlineProfileInput!) {
		registerProfile(input: $input) {
			id
			phoneNumber
		}
	}
`

export const loginProfileMutation = gql`
	mutation loginProfile($input: OnlineProfileLoginInput!) {
		loginProfile(input: $input) {
			id
			firstName
			lastName
			phoneNumber
		}
	}
`

export const customerLogout = gql`
	mutation logout {
		logout
	}
`

export const createProfileAppointmentMutation = gql`
	mutation createProfileAppointment($input: CreateProfileAppointmentInput!) {
		createProfileAppointment(input: $input) {
			id
			startTime
			endTime
			duration
			price
			status
			location {
				id
				name
				address
				uuid
				contactNumber
			}
			services {
				id
				name
				price
				duration
			}
			employee {
				firstName
				lastName
			}
		}
	}
`

export const sequentialUpsertMutation = gql`
	mutation upsert($input: OnlineCheckinInput!) {
		checkinOnline(input: $input) {
			id
			startTime
			endTime
			duration
			price
			status
			location {
				id
				name
				address
				uuid
				contactNumber
			}
			services {
				name
				price
				duration
			}
			employee {
				firstName
				lastName
			}
		}
	}
`

export const changePasswordMutation = gql`
	mutation changePassword($newPassword: String!, $currentPassword: String!) {
		changeProfilePassword(currentPassword: $currentPassword, newPassword: $newPassword)
	}
`

export const updateProfileMutation = gql`
	mutation updateProfile($input: UpdateOnlineProfileInput!) {
		updateProfile(input: $input) {
			firstName
			lastName
			phoneNumber
		}
	}
`

export const cancelAppointmentMutation = gql`
	mutation cancelAppointment($appointmentId: ID!) {
		profileCancelAppointment(appointmentId: $appointmentId) {
			...appointment
		}
	}
	${appointment}
`
