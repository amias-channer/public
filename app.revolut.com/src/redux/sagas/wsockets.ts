import { take, call, takeEvery, put } from 'redux-saga/effects'

import { WS as ChatWS, wsChannel } from '../../services/WSEngine'
import * as authActions from '../reducers/auth'
import * as ticketActions from '../reducers/tickets'

const socket = new ChatWS()

function* wsActionSaga({ type, data: payload }: { type: string; data: any }) {
  if (type === 'message') {
    yield put({
      type: `${payload.message.payloadType}_${payload.message.payload.type}`,
      payload,
    })
  } else if (type === 'read') {
    const { ticketId } = payload
    yield put(
      ticketActions.patchTicket({
        ticketId,
        payload: {
          unread: 0,
        },
      })
    )
  } else {
    yield put({ type, payload })
  }
}

function* wsSaga() {
  while (true) {
    yield take(authActions.loginSuccess)
    socket.open()
    const channel = yield call(wsChannel, socket)
    yield takeEvery(channel, wsActionSaga)
    yield take(authActions.logout)
    if (!window.Cypress || !process.env.CHAT_NO_WS) {
      socket.close()
    }
  }
}

export default [wsSaga()]
