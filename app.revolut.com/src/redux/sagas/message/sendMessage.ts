import { call, delay, fork, put, select, spawn } from 'redux-saga/effects'

import {
  postMessage,
  uploadFile,
  anonymousPostMessage,
  anonymousUploadFile,
  postStructuredMessage,
} from '../../../api/API'
import * as messageActions from '../../reducers/messages'
import { getMessage } from '../../selectors/messages'
import { CHAT_TIME_UPDATE } from '../../../constants/timers'
import { StructuredMessage } from '../../../constants/structuredMessage'

import { getMessagePayload } from './utils'

type PostMessageSagaProps = {
  payload: {
    ticketId: string
    value: string | StructuredMessage
    uuid: string
  }
}

function* sendMessage(
  ticketId: string,
  uuid: string,
  value: string | StructuredMessage | FormData,
  isStructured?: boolean
) {
  try {
    if (ticketId) {
      if (typeof value === 'string') {
        yield call(postMessage, ticketId, uuid, value)
      } else if (isStructured) {
        yield call(postStructuredMessage, ticketId, uuid, value)
        yield put(messageActions.getFiles({ ticketId, uuid }))
      } else {
        yield call(uploadFile, ticketId, uuid, value)
      }
    } else if (typeof value === 'string') {
      yield call(anonymousPostMessage, uuid, value)
    } else {
      yield call(anonymousUploadFile, uuid, value)
    }
  } catch (error) {
    const msgState = yield select(getMessage(ticketId, uuid))
    if (msgState && !(msgState.id && msgState.clientMessageId)) {
      yield put(
        messageActions.patchMessage(ticketId, uuid, {
          isSending: false,
          isFailed: true,
        })
      )
    }
  }
}

export function* sendMessageSaga(
  ticketId: string,
  uuid: string,
  value: string | StructuredMessage,
  isStructured?: boolean
) {
  yield fork(sendMessage, ticketId, uuid, value, isStructured)

  yield delay(CHAT_TIME_UPDATE)

  const msgState = yield select(getMessage(ticketId, uuid))
  if (!isStructured && msgState && !(msgState.id && msgState.clientMessageId)) {
    yield put(
      messageActions.patchMessage(ticketId, uuid, {
        isSending: true,
      })
    )
  }
}

export function* postMessageSaga({
  payload: { ticketId, value, uuid },
}: PostMessageSagaProps) {
  const payload = yield call(getMessagePayload, value)
  if (payload) {
    /* Add fake message to list */
    yield put(messageActions.createMessage(ticketId, uuid, payload))
    yield spawn(sendMessageSaga, ticketId, uuid, value)
  }
}
