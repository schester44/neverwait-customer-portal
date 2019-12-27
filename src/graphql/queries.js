import gql from 'graphql-tag'
import { appointment, workingHours, closedDate } from './fragments'

export const profileQuery = gql`
	query OnlineProfile {
		profile {
			id
			firstName
			lastName
			phoneNumber

			locations {
				id
				name
				uuid
				address
				photo
			}

			appointments(limit: 20, where: { status: { in: [confirmed, completed] } }) {
				past {
					...appointment
				}

				upcoming {
					...appointment
				}
			}
		}
	}

	${appointment}
`

export const basicLocationInfoQuery = gql`
	query LocationInfo($uuid: String!, $startDate: DateTime!, $endDate: DateTime!) {
		locationByUUID(input: { uuid: $uuid }) {
			id
			name
			address
			contactNumber
			photo(transformations: { ar: "16-9", h: "250" })
			closed_dates(input: { start_date: $startDate, end_date: $endDate }) {
				...closedDate
			}
			working_hours {
				...workingHours
			}
		}
	}
	${closedDate}
	${workingHours}
`

export const locationDataQuery = gql`
	query Location(
		$uuid: String!
		$startTime: DateTime!
		$endTime: DateTime!
		$sourceType: SourceType!
	) {
		locationByUUID(input: { uuid: $uuid }) {
			id
			name
			address
			contactNumber
			working_hours {
				...workingHours
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
				photo
				schedule_ranges(input: { where: { start_date: $startTime, end_date: $endTime } }) {
					start_date
					end_date
					day_of_week
					schedule_shifts {
						start_time
						end_time
						acceptingAppointments
						acceptingCheckins
						acceptingWalkins
					}
				}

				services {
					id
					name
					sources(input: { where: { type: $sourceType } }) {
						price
						type
						duration
						serviceId
					}
				}
				appointments(
					input: {
						where: {
							status: { eq: confirmed }
							startTime: { gte: $startTime }
							endTime: { lte: $endTime }
						}
					}
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

	${workingHours}
`

export const employeeScheduleQuery = gql`
	query($locationId: ID!, $employeeId: ID!, $input: EmployeeScheduleInput!) {
		employeeSchedule(locationId: $locationId, employeeId: $employeeId, input: $input) {
			appointments {
				id
				startTime
				endTime
			}

			schedule_ranges {
				start_date
				end_date
				day_of_week
				schedule_shifts {
					acceptingAppointments
					acceptingCheckins
					acceptingWalkins
					start_time
					end_time
				}
			}
		}
	}
`
