import * as R from 'ramda'
import { call, put, spawn, select } from 'redux-saga/effects'

import { getHistory } from '../../../api/API'
import { MESSAGES_LENGTH } from '../../../constants/utils'
import * as messageActions from '../../reducers/messages'
import { currentTicketMessagesSelector } from '../../selectors/messages'
import {
  PayloadType,
  MessagePayloadType,
  ServiceType,
} from '../../../api/types'
import { getError } from '../helpers'
import { fetchFileSaga } from '../file'
import { MessageType } from '../../../api/ticketTypes'

type LoadMessageSagaType = {
  payload: {
    ticketId: string
  }
}

export function* uploadFiles(item: MessageType) {
  if (item && item.payload.type === PayloadType.UPLOAD) {
    yield spawn(fetchFileSaga, { payload: item }, true)
  }
}

export function* loadMessagesSaga() {
  const messages = yield select(currentTicketMessagesSelector)
  if (messages.length) {
    const { ticketId, createdAt, payloadType, payload } = R.head(
      messages
    ) as MessageType

    if (
      payloadType === MessagePayloadType.SERVICE &&
      payload &&
      payload.type === ServiceType.INITIALIZED
    ) {
      return null
    }

    try {
      const loadedPayload = yield call(
        getHistory,
        ticketId,
        createdAt,
        MESSAGES_LENGTH
      )
      yield put(
        messageActions.putTicketMessageHistory({
          payload: loadedPayload,
          ticketId,
        })
      )
      yield* loadedPayload.map(uploadFiles)
    } catch (error) {
      yield getError(error)
    }
  }
}
