import axios, { AxiosError } from 'axios'
import isString from 'lodash/isString'

import { ApiErrorCode, HttpHeader } from './constants'

export class AxiosCommonHeader {
  static get(header: HttpHeader) {
    return axios.defaults.headers.common[header]
  }

  static set(header: HttpHeader, value: string | boolean) {
    axios.defaults.headers.common[header] = isString(value)
      ? value
      : JSON.stringify(value)
  }

  static remove(header: HttpHeader) {
    delete axios.defaults.headers.common[header]
  }
}

export const getAxiosApiErrorCode = (error: AxiosError): ApiErrorCode | undefined =>
  error.response?.data?.code
