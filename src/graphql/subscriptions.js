import gql from 'graphql-tag'

export const appointmentsSubscription = gql`
	subscription onScheduleChange($locationId: ID!) {
		SchedulingChange(locationId: $locationId) {
			employeeId
			locationId
			action
			payload {
				appointment {
					id
					status
					duration
					startTime
					endTime
				}
				blockedTime {
					id
					startTime
					endTime
					locationId
					employeeId
					description
				}
			}
		}
	}
`
