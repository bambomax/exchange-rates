// const
import { colors } from '../constants/colors'
// types
import { IData, IChartData, IChartDataItem } from '../App'

import moment from 'moment'

export const getRandomColor = () => colors[Math.floor(Math.random() * 10)]

export const transformFetchedData = ({ rates }: IData): IChartData => {
  const entries = Object.entries(rates)

  const result = entries.reduce((acc, [date, currencyRates]) =>
    [...acc, { date, ...currencyRates } as IChartDataItem], [] as IChartData)

  result.sort((a, b) => moment(a.date).isAfter(moment(b.date)) ? 1 : -1)

  return result
}
