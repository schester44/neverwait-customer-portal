import gql from "graphql-tag"

export const blockedTimesSubscription = gql`
	subscription onBlockedTimeChange($locationId: ID!) {
		BlockedTimeChange(locationId: $locationId) {
			employeeId
			deleted
			blockedTime {
				id
				startTime
				endTime
			}
		}
	}
`

export const appointmentsSubscription = gql`
	subscription onAppointmentsChange($locationId: ID!) {
		AppointmentsChange(locationId: $locationId) {
			employeeId
			appointment {
				id
				status
				duration
				startTime
				endTime
			}
		}
	}
`
