// const
import { colors } from '../constants/colors'
// types
import { IData, IChartData, IChartDataItem } from '../App'

export const getRandomColor = () => colors[Math.floor(Math.random() * 10)]

export const transformFetchedData = ({ rates }: IData): IChartData =>
  Object.entries(rates).reduce((acc, [date, currencyRates]) =>
    [...acc, { date, ...currencyRates } as IChartDataItem], [] as IChartData)
