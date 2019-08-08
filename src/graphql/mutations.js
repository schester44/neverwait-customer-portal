import gql from 'graphql-tag'

export const authWithToken = gql`
	mutation authWithToken($key: String!) {
		authWithToken(key: $key) {
			token
		}
	}
`

export const createCustomerMutation = gql`
	mutation createCustomer($input: CreateCustomerInput!) {
		createCustomer(input: $input) {
			id
			contactNumber
		}
	}
`

export const loginCustomerMutation = gql`
	mutation loginCustomer($input: CustomerLoginInput!) {
		loginCustomer(input: $input) {
			id
			firstName
			lastName
			contactNumber
		}
	}
`

export const sequentialUpsertMutation = gql`
	mutation upsert($input: AppointmentInput!) {
		upsertAppointment(input: $input) {
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
