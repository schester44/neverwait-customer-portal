import differenceInMinutes from 'date-fns/difference_in_minutes'

export default time => differenceInMinutes(new Date(), time)
