import { takeEvery, select } from 'redux-saga/effects'
import { onMessageSelector } from '../selectors/onMessage'
import { MessageTypes } from '../../api/types'

function* onMessageSaga({ payload }: any) {
  const { onMessage } = yield select(onMessageSelector)
  if (onMessage) {
    onMessage(payload)
  }
}

function* watcher() {
  yield takeEvery(MessageTypes.MESSAGE_TEXT, onMessageSaga)
}

export default [watcher()]
