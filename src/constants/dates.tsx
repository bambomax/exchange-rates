import moment from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'

export const todayMoment = moment()
export const fiveDaysAgoMoment = moment().subtract(5, 'd')
