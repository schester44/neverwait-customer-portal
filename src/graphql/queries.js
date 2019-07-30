import gql from 'graphql-tag'

export const temporaryAccessTokenQuery = gql`
	query tempToken($locationId: ID!) {
		temporaryAccessToken(locationId: $locationId)
	}
`

export const locationDataQuery = gql`
	query Location($locationId: String!, $startTime: String!, $endTime: String!) {
		locationByUUID(input: { uuid: $locationId }) {
			id
			name
			employees(input: { where: { bookingEnabled: true } }) {
				id
				firstName
				services {
					id
					name
					price
					duration
				}
				appointments(
					input: { where: { status: { not: "completed" }, startTime: { gte: $startTime }, endTime: { lte: $endTime } } }
				) {
					id
					status
					duration
					startTime
					endTime
				}
				blockedTimes(input: { where: { startTime: { gte: $startTime }, endTime: { lte: $endTime } } }) {
					id
					startTime
					endTime
				}
			}
		}
	}
`

export const searchCustomers = gql`
	query searchCustomers($input: CustomerSearchInput!) {
		searchCustomers(input: $input) {
			id
			firstName
			lastName
			appointments {
				past {
					id
					services {
						id
					}
				}
			}
		}
	}
`
