import gql from 'graphql-tag'

export const authWithToken = gql`
	mutation authWithToken($key: String!) {
		authWithToken(key: $key) {
			token
		}
	}
`
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

export const sequentialUpsertMutation = gql`
	mutation upsert($input: OnlineCheckinInput!) {
		checkinOnline(input: $input) {
			id
			startTime
			endTime
			duration
			price
			location {
				id
				name
				address
				uuid
				contactNumber
			}
			services {
				name
				sources {
					id
					serviceId
					price
					duration
				}
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
