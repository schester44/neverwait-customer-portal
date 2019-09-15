import gql from 'graphql-tag'

export const appointmentsSubscription = gql`
	subscription onAppointmentsChange($locationId: ID!) {
		AppointmentsChange(locationId: $locationId) {
			employeeId
			isNewRecord
			appointment {
				id
				status
				duration
				startTime
				endTime
				deleted
			}
		}
	}
`
