import { call, put, spawn, takeEvery } from 'redux-saga/effects'

import {
  MessageType,
  TicketsResponseType,
  TicketStatus,
} from '../../api/ticketTypes'
import { getTicket } from '../../api/API'
import { MessageTypes } from '../../api/types'
import { ServiceTypes } from '../../api/wsEvents'
import * as ticketActions from '../reducers/tickets'
import * as agentActions from '../reducers/agents'
import * as messageActions from '../reducers/messages'
import { BOT_IDS_TO_IGNORE } from '../../constants/agents'

import { fetchFileSaga } from './file'
import { getError } from './helpers'
import { fetchUserInfoSaga } from './userInfo/fetchUserInfo'
import { ticketResolutionOptionsSaga } from './ticket/resolutionOptions'

type MessagePayload = {
  payload: {
    message: {
      ticketId: string
      payload: { agentId: string }
      updatedAt?: string
    }
  }
}

function* resolvedSaga({
  payload: {
    message: { ticketId },
  },
}: {
  payload: { message: { ticketId: string } }
}) {
  try {
    const ticketInfo: TicketsResponseType = yield call(getTicket, ticketId)
    if (ticketInfo.state === TicketStatus.RESOLVED) {
      yield spawn(ticketResolutionOptionsSaga, ticketId)
    }
    yield put(ticketActions.addTicket(ticketInfo))
    yield spawn(fetchUserInfoSaga)
  } catch (error) {
    yield getError(error)
  }
}

function* assignedSaga({
  payload: { message },
}: {
  payload: { message: any }
}) {
  const { ticketId, payload } = message
  const agentId = payload?.assigned?.agentId || payload?.agentId

  if (BOT_IDS_TO_IGNORE.includes(agentId)) {
    return
  }

  yield put(
    ticketActions.patchTicket({
      ticketId,
      payload: {
        assigned: agentId,
        state: TicketStatus.ASSIGNED,
      },
    })
  )
  yield spawn(fetchUserInfoSaga)

  if (agentId) {
    yield put(agentActions.fetchAgent(agentId))
  }
}

function* ratedSaga({ payload: { message } }: MessagePayload) {
  const { ticketId } = message
  yield put(
    ticketActions.patchTicket({
      ticketId,
      payload: {
        state: TicketStatus.CLOSED_AND_RATED,
      },
    })
  )
  yield spawn(fetchUserInfoSaga)
}

function* chatInitializedSaga({ payload: { message } }: MessagePayload) {
  const {
    ticketId,
    payload: { agentId },
    updatedAt,
  } = message

  yield put(
    ticketActions.addTicket({
      id: ticketId,
      assigned: agentId,
      updatedAt,
      state: TicketStatus.ASSIGNED,
    })
  )

  yield spawn(fetchUserInfoSaga)
}

function* escalatedSaga({ payload: { message } }: MessagePayload) {
  const { ticketId } = message

  yield put(
    ticketActions.patchTicket({
      ticketId,
      payload: {
        state: TicketStatus.OPEN,
        assigned: undefined,
      },
    })
  )
}

type NewUploadMessageType = {
  payload: {
    message: MessageType
  }
}
function* uploadMessageSaga({ payload: { message } }: NewUploadMessageType) {
  yield spawn(fetchFileSaga, { payload: message })
  const { ticketId, correlationId, messageId } = message
  yield put(
    messageActions.patchMessage(ticketId, correlationId || messageId, message)
  )
  yield put(
    ticketActions.patchTicket({
      ticketId,
      payload: {
        lastMessage: message,
      },
    })
  )
}

function* messageSaga({
  payload: { message },
}: {
  payload: {
    message: MessageType
  }
}) {
  const { ticketId } = message

  if (!message.fromClient) {
    yield put(
      ticketActions.patchTicket({
        ticketId,
        payload: { readOnly: false },
      })
    )
  }
}

function* deleteSaga({
  payload: { message },
}: {
  payload: { message: MessageType }
}) {
  const {
    payload: { messageId: correlationId },
    ticketId,
  } = message

  if (ticketId && correlationId) {
    yield put(
      messageActions.deleteMessage({
        ticketId,
        correlationId,
      })
    )
  }
}

function* watcher() {
  yield takeEvery(ServiceTypes.SERVICE_RATED, ratedSaga)
  yield takeEvery(ServiceTypes.SERVICE_RESOLVED, resolvedSaga)
  yield takeEvery(ServiceTypes.SERVICE_ASSIGNED, assignedSaga)
  yield takeEvery(ServiceTypes.SERVICE_INITIALIZED, chatInitializedSaga)
  yield takeEvery(ServiceTypes.SERVICE_ESCALATED, escalatedSaga)
  yield takeEvery(ServiceTypes.SERVICE_DELETED, deleteSaga)
  yield takeEvery(MessageTypes.MESSAGE_TEXT, messageSaga)
  yield takeEvery(MessageTypes.MESSAGE_UPLOAD, uploadMessageSaga)
}

export default [watcher()]
