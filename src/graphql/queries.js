import gql from 'graphql-tag'

const fragments = {
	appointment: gql`
		fragment appointment on Appointment {
			id
			startTime
			endTime
			duration
			price
			employee {
				firstName
			}
			location {
				name
				address
				contactNumber
			}
			services {
				name
			}
		}
	`
}

export const customerInfoQuery = gql`
	{
		locations {
			name
			uuid
			address
		}

		customerInfo {
			id
			firstName
			lastName
			appointments(limit: 10) {
				past {
					...appointment
				}

				upcoming {
					...appointment
				}
			}
		}
	}

	${fragments.appointment}
`

export const locationDataQuery = gql`
	query Location($locationId: String!, $startTime: String!, $endTime: String!) {
		locationByUUID(input: { uuid: $locationId }) {
			id
			name
			address
			company {
				id
			}
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
