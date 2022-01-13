import { all, takeEvery } from 'redux-saga/effects'

import * as messageActions from '../../reducers/messages'
import { openWithPrefilledMessage } from '../../reducers/external'
import { fetchFileSaga } from '../file'

import { postMessageSaga } from './sendMessage'
import { openNewChatSaga } from './openNewChat'
import { loadMessagesSaga } from './loadMessages'

export default function* watcher() {
  yield all([
    takeEvery(messageActions.postMessage, postMessageSaga),
    takeEvery(openWithPrefilledMessage, openNewChatSaga),
    takeEvery(messageActions.getFullImage, fetchFileSaga),
    takeEvery(messageActions.loadHistory, loadMessagesSaga),
  ])
}
