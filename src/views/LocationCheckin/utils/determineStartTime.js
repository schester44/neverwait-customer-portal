import subMinutes from 'date-fns/sub_minutes'
import addMinutes from 'date-fns/add_minutes'
import isBefore from 'date-fns/is_before'

// If the appointment hasn't been completed or if its end time is after right now then it can be considered to still be in progress. If its still in progress than set the start time of this appointment to the endTime of the last appointment else set it to right now

// TODO: The 2 should come from a setting value.

export default lastAppt => {
	const now = new Date()
	return !lastAppt || isBefore(lastAppt.endTime, subMinutes(now, 2)) ? now : addMinutes(lastAppt.endTime, 2)
}
