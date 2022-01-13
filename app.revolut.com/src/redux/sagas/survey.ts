import { takeEvery, call, put } from 'redux-saga/effects'

import * as surveyActions from '../reducers/survey'
import * as authActions from '../reducers/auth'
import { ClientInfoResponseType } from '../../api/types'
import { rateTicket, getClientInfo } from '../../api/API'

function* rateSaga({ payload }: any) {
  const { onRated, ticketId, rate, feedbackId, feedback } = payload
  onRated()
  yield call(rateTicket, ticketId, rate, feedbackId, feedback)
  const clientInfo: ClientInfoResponseType = yield call(getClientInfo)
  yield put(authActions.fetchUserInfo(clientInfo))
}

function* watcher() {
  yield takeEvery(surveyActions.rateTicket, rateSaga)
}

export default [watcher()]
