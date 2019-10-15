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
				id
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

export const profileQuery = gql`
	{
		locations {
			id
			name
			uuid
			address
		}

		profile {
			id
			firstName
			lastName
			phoneNumber
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

// FIXME: Shouldn't need extra variables for startTime,endTiem,startDate,endDate.. should only need 2.. problem with inconsistent types
export const locationDataQuery = gql`
	query Location($uuid: String!, $startTime: String!, $endTime: String!, $startDate: Date!, $endDate: Date!) {
		locationByUUID(input: { uuid: $uuid }) {
			id
			name
			address
			working_hours {
				sunday {
					open
					startTime
					endTime
				}
				monday {
					open
					startTime
					endTime
				}
				tuesday {
					open
					startTime
					endTime
				}
				wednesday {
					open
					startTime
					endTime
				}
				thursday {
					open
					startTime
					endTime
				}
				friday {
					open
					startTime
					endTime
				}
				saturday {
					open
					startTime
					endTime
				}
			}

			closed_dates {
				start_date
				end_date
				description
			}
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
					sources(input: { where: { type: "onlinecheckin" } }) {
						price
						duration
						serviceId
					}
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
