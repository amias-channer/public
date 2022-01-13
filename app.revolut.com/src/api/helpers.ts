import { call, put } from 'redux-saga/effects'
import { UNAUTHORIZED } from 'http-status-codes'

import { relogin } from '../redux/reducers/auth'

export const enhancedCall = (saga: any, ...args: any[]) =>
  call(function* () {
    try {
      const response = yield call(saga, ...args)
      return response.data || response
    } catch (err) {
      const { response } = err

      if (response.status === UNAUTHORIZED) {
        yield put(relogin())
      }

      throw new Error(err.response)
    }
  })
