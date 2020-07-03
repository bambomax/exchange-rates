import React from 'react'
// libs
import moment from 'moment'
import { Layout, DatePicker, Select } from 'antd'
import { Line } from '@ant-design/charts'
// theme
import './App.css'
// constants
import {
  Currency,
  EXCHANGE_URL,
  fiveDaysAgoMoment,
  todayMoment,
  DATE_FORMAT,
  DEFAULT_CHART_DATA,
  DEFAULT_FIRST_CURRENCY_STATE,
  DEFAULT_SECOND_CURRENCY_STATE,
  DEFAULT_TIME_GAP_STATE,
  SelectValues
} from './constants'

interface IData {
  base: Currency
  date: string
  rates: {
    [key: string]: {
      [key: string]: number
    }
  }
}

type IChartData = Array<{ date: string, value: number }>

interface ITimeGap {
  startAt: string
  endAt: string
}

type RangeValue = Array<moment.Moment | null> | null

let isMounted = false

const App: React.FC = () => {
  const [chartData, setChartData] = React.useState<IChartData>(DEFAULT_CHART_DATA)
  const [first, setFirstCurrency] = React.useState<string>(DEFAULT_FIRST_CURRENCY_STATE)
  const [second, setSecondCurrency] = React.useState<string>(DEFAULT_SECOND_CURRENCY_STATE)
  const [{ startAt, endAt }, setTime] = React.useState<ITimeGap>(DEFAULT_TIME_GAP_STATE)

  const transformFetchedData = ({ rates }: IData): IChartData =>
    // @ts-ignore
    Object.entries(rates).reduce((acc, [date, { [second]: value }]) => [...acc, { date, value }], [])

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch(EXCHANGE_URL + `?base=${first}&start_at=${startAt}&end_at=${endAt}&symbols=${second}`)
      const data: IData = await response.json()
      const chartData: IChartData = transformFetchedData(data)
      setChartData(chartData)
    } catch (error) {
      console.log('fetchData: ', error)
    } finally {
      isMounted = true
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    if (isMounted) { // prevent double fetch
      fetchData()
    }
  }, [first, second, startAt, endAt])

  const onDateChange = (momentArray: RangeValue, [startAt, endAt]: string[]): void => {
    if (startAt && endAt) {
      setTime({ startAt, endAt })
    }
  }

  const chartConfig = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    padding: 'auto',
    forceFit: true,
    point: {
      visible: true,
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#2593fc',
        lineWidth: 2
      }
    }
  }

  return (
    <Layout>
      <h1>Exchange rates</h1>
      <Select defaultValue={first} value={first} onChange={setFirstCurrency} showSearch>{SelectValues}</Select>
      <Select defaultValue={second} value={second} onChange={setSecondCurrency} showSearch>{SelectValues}</Select>
      <DatePicker.RangePicker
        defaultValue={[fiveDaysAgoMoment, todayMoment]}
        format={DATE_FORMAT}
        onChange={onDateChange}
      />
      <p>{first} 1 = {second} {chartData[chartData.length - 1].value}</p>
      <Line {...chartConfig} />
    </Layout>
  )
}

export default App
