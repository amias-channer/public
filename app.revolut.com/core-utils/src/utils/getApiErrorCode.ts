import { AxiosError } from 'axios'

import { ApiErrorCode } from './constants'

export const getApiErrorCode = (error: AxiosError): ApiErrorCode | undefined =>
  error.response?.data?.code
