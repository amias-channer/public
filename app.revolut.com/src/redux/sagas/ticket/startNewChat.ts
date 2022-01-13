import { call, put, spawn } from 'redux-saga/effects'
import { routerActions } from 'connected-react-router'

import { createTicket } from '../../../api/API'
import { TicketStatus } from '../../../api/ticketTypes'
import { sendMessageSaga } from '../message/sendMessage'
import { fetchUserInfoSaga } from '../userInfo/fetchUserInfo'
import * as ticketActions from '../../reducers/tickets'
import * as messageActions from '../../reducers/messages'
import { getError } from '../helpers'
import { TICKET_LOADING_STATE } from '../../../constants/loading'
import { TicketPaths } from '../../../constants/routerPaths'
import { PayloadType, TicketOptions } from '../../../api/types'
import { StructuredMessage } from '../../../constants/structuredMessage'

type NewChatPayload = {
  uuid: string
  content: string | StructuredMessage
  options: TicketOptions
  isStructured: boolean
}

type CreatedTicketType = {
  bot: boolean
  createdAt: string
  id: string
  language: string
  readOnly: boolean
  state: TicketStatus
  unread: number
  updatedAt: string
}

export function* startNewChatSaga({ payload }: { payload: NewChatPayload }) {
  try {
    const { uuid, content, options, isStructured } = payload

    yield put(
      ticketActions.setTicketLoading(
        TicketPaths.NEW,
        TICKET_LOADING_STATE.LOADING
      )
    )
    const createdTicket: CreatedTicketType = yield call(createTicket, options)
    yield put(ticketActions.addTicket(createdTicket))
    yield put(routerActions.replace(`/chat/${createdTicket.id}`))
    yield put(
      ticketActions.setTicketLoading(
        createdTicket.id,
        TICKET_LOADING_STATE.COMPLETE
      )
    )

    if (isStructured && typeof content !== 'string') {
      yield put(
        messageActions.createMessage(createdTicket.id, uuid, {
          type: PayloadType.STRUCTURE,
          content: content.message,
        })
      )
    }
    yield spawn(sendMessageSaga, createdTicket.id, uuid, content, isStructured)
    yield spawn(fetchUserInfoSaga)

    yield put(
      ticketActions.setTicketLoading(
        TicketPaths.NEW,
        TICKET_LOADING_STATE.COMPLETE
      )
    )
  } catch (error) {
    yield getError(error)
  }
}
