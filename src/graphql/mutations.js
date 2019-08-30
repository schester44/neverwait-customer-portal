import gql from 'graphql-tag'

export const authWithToken = gql`
	mutation authWithToken($key: String!) {
		authWithToken(key: $key) {
			token
		}
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
