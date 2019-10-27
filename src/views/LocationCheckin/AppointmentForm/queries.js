import gql from 'graphql-tag'

export const employeeScheduleQuery = gql`
	query($locationId: ID!, $employeeId: ID!, $input: EmployeeScheduleInput!) {
		employeeSchedule(locationId: $locationId, employeeId: $employeeId, input: $input) {
			
			appointments {
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
