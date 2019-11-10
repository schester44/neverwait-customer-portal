import { addMinutes, isBefore, subMinutes } from 'date-fns'

// TODO: The 2 should come from a setting value.
const determineStartTime = ({ firstAvailableTime }) => {
	const now = new Date()

	if (!firstAvailableTime) return

	if (isBefore(firstAvailableTime, subMinutes(now, 2))) {
		return now
	}

	return addMinutes(firstAvailableTime, 2)
}

export default determineStartTime
