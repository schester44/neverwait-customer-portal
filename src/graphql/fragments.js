import gql from 'graphql-tag'

export const appointment = gql`
	fragment appointment on Appointment {
		id
		startTime
		endTime
		duration
		price
		status
		employee {
			firstName
		}
		location {
			id
			name
			address
			contactNumber
			uuid
			photo
		}
		services {
			id
			price
			duration
			quantity
			name
		}
	}
`

export const closedDate = gql`
	fragment closedDate on ClosedDate {
		id
		description
		start_date
		end_date
	}
`

export const workingHours = gql`
	fragment workingHours on LocationWorkingHours {
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
`
