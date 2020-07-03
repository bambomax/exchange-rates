import React from 'react'
// libs
import moment from 'moment'
import { Row, Col, DatePicker, Select, Typography } from 'antd'
import { LineChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// components
import Header from './components/Header'
// utils
import { getRandomColor, transformFetchedData } from './utils'
// theme
import './App.css'
import { Wrapper, CurrentRates } from './theme'
// constants
import { EXCHANGE_URL } from './constants/urls'
import { fiveDaysAgoMoment, todayMoment, DATE_FORMAT } from './constants/dates'
import { Currency, CurrencySelectValues } from './constants/currency'

const DEFAULT_CHART_DATA: IChartData = []
const DEFAULT_FIRST_CURRENCY_STATE = 'USD'
const DEFAULT_SECOND_CURRENCY_STATE = ['EUR']
const DEFAULT_TIME_GAP_STATE = { startAt: fiveDaysAgoMoment.format(DATE_FORMAT), endAt: todayMoment.format(DATE_FORMAT) }

export interface IData {
  base: Currency
  date: string
  rates: {
    [date: string]: {
      [currency: string]: number
    }
  }
}

export type IChartDataItem = {
  // @ts-ignore
  date: string
  [currency: string]: number
}

export type IChartData = Array<IChartDataItem>

interface ITimeGap {
  startAt: string
  endAt: string
}

type RangeValue = Array<moment.Moment | null> | null

let isMounted = false

const App: React.FC = () => {
  const [chartData, setChartData] = React.useState<IChartData>(DEFAULT_CHART_DATA)
  const [first, setFirstCurrency] = React.useState<string>(DEFAULT_FIRST_CURRENCY_STATE)
  const [second, setSecondCurrency] = React.useState<string[]>(DEFAULT_SECOND_CURRENCY_STATE)
  const [{ startAt, endAt }, setTime] = React.useState<ITimeGap>(DEFAULT_TIME_GAP_STATE)

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch(EXCHANGE_URL + `?base=${first}&start_at=${startAt}&end_at=${endAt}&symbols=${second.join(',')}`)
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

  const currentRatesObj = chartData.reduce((acc, item) =>
    moment(item.date, DATE_FORMAT).isAfter(moment(acc.date)) ? item : acc, { date: '2000-01-01' })

  const currentRates = Object
    .entries(currentRatesObj)
    .filter(([key]) => key !== 'date')
    .map(item => item.join(' '))
    .join(', ')

  const lines = Object.entries(chartData[0] || {}).filter(([key]) => key !== 'date')

  return (
    <>
      <Header />
      <Wrapper>
        <Row gutter={[16, 16]} align='middle'>
          <Col>
            <Typography.Text>Select:</Typography.Text>
          </Col>
          <Col>
            <Select defaultValue={first} value={first} onChange={setFirstCurrency} showSearch>{CurrencySelectValues}</Select>
          </Col>
          <Col>
            <Typography.Text>vs.</Typography.Text>
          </Col>
          <Col>
            <Select
              mode='multiple'
              defaultValue={second}
              value={second}
              onChange={setSecondCurrency}
              showSearch
            >
              {CurrencySelectValues}
            </Select>
          </Col>
        </Row>
        <Row align='middle' style={{ marginBottom: 30 }}>
          <Typography.Text style={{ marginRight: 16 }}>Period:</Typography.Text>
          <DatePicker.RangePicker
            defaultValue={[fiveDaysAgoMoment, todayMoment]}
            format={DATE_FORMAT}
            onChange={onDateChange}
          />
        </Row>
        <CurrentRates>1 {first} = {currentRates}</CurrentRates>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey='date' />
            <YAxis />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Legend />
            {lines.map(([key]) => <Line key={key} type='monotone' dataKey={key} stroke={getRandomColor()} />)}
          </LineChart>
        </ResponsiveContainer>
      </Wrapper>
    </>
  )
}

export default App
