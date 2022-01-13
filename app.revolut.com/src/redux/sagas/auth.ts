/* eslint-disable no-use-before-define */
import {
  all,
  call,
  put,
  take,
  takeEvery,
  takeLatest,
  fork,
  cancel,
  delay,
} from 'redux-saga/effects'

import { ClientInfoResponseType } from '../../api/types'
import { getClientInfo, getTickets, signIn } from '../../api/API'
import * as authActions from '../reducers/auth'
import * as ticketActions from '../reducers/tickets'
import { getSupportOnline, getSupportArrivalTime } from '../../helpers/time'
import {
  setItemToLocalStorage,
  removeItemFromLocalStorage,
  LocalStorage,
} from '../../constants/storage'
import { RETRY_TIME } from '../../constants/timers'

import { fetchLastMessage } from './ticket/fetchLastMessage'

const AUTH_MAX_ATTEMPTS = 2

function* authEpic({ payload }: { payload: authActions.SignInProps }) {
  for (
    let attemptsCount = 0;
    attemptsCount < AUTH_MAX_ATTEMPTS;
    attemptsCount += 1
  ) {
    yield put(authActions.logout())

    const loginProcess = yield fork(loginProcessSaga, payload)
    const action = yield take([authActions.relogin, authActions.logout])
    if (action.type === authActions.logout.getType()) {
      attemptsCount = AUTH_MAX_ATTEMPTS
    }

    yield cancel(loginProcess)
  }

  yield put(authActions.logout())
}

function* fetchSession() {
  const clientInfo: ClientInfoResponseType = yield call(getClientInfo)
  yield put(authActions.fetchUserInfo(clientInfo))

  const tickets = yield call(getTickets)
  yield put(ticketActions.addTickets(tickets))

  yield* tickets.map(fetchLastMessage)
}

function* onFetchUserInfo({ payload }: { payload: ClientInfoResponseType }) {
  yield put(
    authActions.fetchSupportTime({
      isSupportOnline: getSupportOnline(payload.workHours),
      supportArrivalTime: getSupportArrivalTime(payload.workHours),
    })
  )
}

function* logoutSaga() {
  yield removeItemFromLocalStorage(LocalStorage.CHAT_AUTH_TOKEN)
}

function* loginProcessSaga(payload: authActions.SignInProps) {
  const { anonymous, ...info } = payload
  try {
    const userInfo = yield payload.fromStorage ? info : call(signIn, payload)
    const chatAuthInfo = { ...userInfo, anonymous }

    setItemToLocalStorage(LocalStorage.CHAT_AUTH_TOKEN, chatAuthInfo)

    yield put(authActions.loginSuccess(chatAuthInfo))

    yield call(fetchSession)
  } catch (error) {
    yield delay(RETRY_TIME)
    yield put(authActions.signIn(payload))
  }
}

export default function* watcher() {
  yield all([
    takeEvery(authActions.fetchUserInfo, onFetchUserInfo),
    takeEvery(authActions.logout, logoutSaga),
    takeLatest(authActions.signIn, authEpic),
  ])
}
