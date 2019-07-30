import { format, subMinutes, addMinutes, isBefore } from "date-fns"

// If the appointment hasn't been completed or if its end time is after right now then it can be considered to still be in progress. If its still in progress than set the start time of this appointment to the endTime of the last appointment else set it to right now

export default lastAppt => {
	const now = new Date()
	return !lastAppt || isBefore(lastAppt.endTime, subMinutes(now, 2))
		? format(now)
		: format(addMinutes(lastAppt.endTime, 2))
}
