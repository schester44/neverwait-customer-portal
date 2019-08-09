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

// FIXME: Should need extra variables.. problem with inconsistent types
export const locationDataQuery = gql`
	query Location($locationId: String!, $startTime: String!, $endTime: String!, $startDate: Date!, $endDate: Date!) {
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
				schedule_ranges(input: { where: { start_date: $startDate, end_date: $endDate } }) {
					start_date
					end_date
					day_of_week
					schedule_shifts {
						start_time
						end_time
					}
				}

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
			}
		}
	}
`
