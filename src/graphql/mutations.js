import gql from 'graphql-tag'

export const authWithToken = gql`
	mutation authWithToken($key: String!) {
		authWithToken(key: $key) {
			token
		}
	}
`

export const findOrCreateCustomerMutation = gql`
	mutation findOrCreateCustomer($input: CreateCustomerInput!) {
		findOrCreateCustomer(input: $input) {
			customer {
				id
				firstName
				lastName
			}
		}
	}
`

export const sequentialUpsertMutation = gql`
	mutation upsert($input: AppointmentInput!) {
		upsertAppointment(input: $input) {
			appointment {
				id
				startTime
				endTime
				duration
				services {
					name
				}
				employee {
					firstName
					lastName
				}
				customer {
					id
					firstName
					lastName
				}
			}
		}
	}
`
