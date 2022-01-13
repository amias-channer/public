import { AxiosError } from 'axios'

import { GeneralErrorDto } from '@revolut/rwa-core-types'
import { ApiErrorCode, HttpCode, getApiErrorCode } from '@revolut/rwa-core-utils'

export const isErrorMatchesGivenCodes = (
  e: AxiosError<GeneralErrorDto>,
  httpCode: HttpCode,
  errorCode: ApiErrorCode,
) => {
  const responseHttpCode = e.response?.status
  const responseErrorCode = getApiErrorCode(e)

  return responseHttpCode === httpCode && responseErrorCode === errorCode
}
