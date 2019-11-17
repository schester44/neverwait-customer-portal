import differenceInMinutes from 'date-fns/difference_in_minutes'

export default time => differenceInMinutes(time, new Date())
