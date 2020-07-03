import moment from "moment";
import {Select} from "antd";
import React from "react";

export enum Currency {
  USD = 'US dollar',
  EUR = 'Euro',
  JPY = 'Japanese yen',
  BGN = 'Bulgarian lev',
  CZK = 'Czech koruna',
  DKK = 'Danish krone',
  GBP = 'Pound sterling',
  HUF = 'Hungarian forint',
  PLN = 'Polish zloty',
  RON = 'Romanian leu',
  SEK = 'Swedish krona',
  CHF = 'Swiss franc',
  ISK = 'Icelandic krona',
  NOK = 'Norwegian krone',
  HRK = 'Croatian kuna',
  RUB = 'Russian rouble',
  TRY = 'Turkish lira',
  AUD = 'Australian dollar',
  BRL = 'Brazilian real',
  CAD = 'Canadian dollar',
  CNY = 'Chinese yuan renminbi',
  HKD = 'Hong Kong dollar',
  IDR = 'Indonesian rupiah',
  ILS = 'Israeli shekel',
  INR = 'Indian rupee',
  KRW = 'South Korean won',
  MXN = 'Mexican peso',
  MYR = 'Malaysian ringgit',
  NZD = 'New Zealand dollar',
  PHP = 'Philippine peso',
  SGD = 'Singapore dollar',
  THB = 'Thai baht',
  ZAR = 'South African rand'
}

export const EXCHANGE_URL = 'https://api.exchangeratesapi.io/history'

export const fiveDaysAgoMoment = moment().subtract(5, 'd')
export const todayMoment = moment()

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DEFAULT_CHART_DATA = [{
  date: todayMoment.format(DATE_FORMAT),
  value: 1
}]
export const DEFAULT_FIRST_CURRENCY_STATE = 'USD'
export const DEFAULT_SECOND_CURRENCY_STATE = 'EUR'
export const DEFAULT_TIME_GAP_STATE = { startAt: fiveDaysAgoMoment.format(DATE_FORMAT), endAt: todayMoment.format(DATE_FORMAT) }

export const SelectValues = Object.entries(Currency).map(([key, value]) =>
  <Select.Option key={value} value={key}>{value}</Select.Option>)
