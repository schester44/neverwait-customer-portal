import scheduleRangesByDate from './scheduleRangesByDate'

// This determines if the user has a shift today and not whether or not they're currently working
export const isScheduledToWork = (employee, date) => !!scheduleRangesByDate(employee.schedule_ranges, date)

export default isScheduledToWork
