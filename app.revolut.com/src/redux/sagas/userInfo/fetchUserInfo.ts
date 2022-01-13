import { call, put } from 'redux-saga/effects'

import { getClientInfo } from '../../../api/API'
import { ClientInfoResponseType } from '../../../api/types'
import * as authActions from '../../reducers/auth'
import { getError } from '../helpers'

export function* fetchUserInfoSaga() {
  try {
    const clientInfo: ClientInfoResponseType = yield call(getClientInfo)
    yield put(authActions.fetchUserInfo(clientInfo))
  } catch (error) {
    getError(error)
  }
}
