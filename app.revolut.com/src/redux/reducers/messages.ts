import * as R from 'ramda'
import { createAction, createReducer } from 'redux-act'

import { MessageType, TicketsResponseType } from '../../api/ticketTypes'
import { MessagePayloadType, MessageTypes } from '../../api/types'
import { propMessageIdEq } from '../../helpers/utils'
import { MessageActions } from '../actions/messages'
import { ServiceTypes } from '../../api/wsEvents'

import { logout } from './auth'
import { StructuredMessagePayload } from '../../constants/structuredMessage'

const messagesReducer = createReducer<{ [key: string]: MessageType[] }>({}, {})

export const getFullImage = createAction<MessageType>(
  MessageActions.GET_FULL_IMAGE
)

export const getFiles = createAction<{ uuid: string; ticketId: string }>(
  MessageActions.GET_FILES
)

export const createMessage = (
  ticketId: string,
  uuid: string,
  payload: string | StructuredMessagePayload
) => ({
  type: MessageTypes.MESSAGE_TEXT,
  payload: {
    message: {
      ticketId,
      correlationId: uuid,
      payloadType: MessagePayloadType.MESSAGE,
      fromClient: true,
      createdAt: new Date().toISOString(),
      payload,
    },
  },
})

export const postStructuredMessage = createAction<{
  ticketId: string
  uuid: string
  value: FormData
}>(MessageActions.SEND, (ticketId: string, uuid: string, value: FormData) => ({
  ticketId,
  uuid,
  value,
}))

export const postMessage = createAction<{
  ticketId: string
  uuid: string
  value: string
}>(MessageActions.SEND, (ticketId: string, uuid: string, value: string) => ({
  ticketId,
  uuid,
  value,
}))

export const putTicketMessageHistory = createAction<{
  ticketId: string
  payload?: TicketsResponseType[]
}>(MessageActions.PUT_TO_HISTORY)
messagesReducer.on(putTicketMessageHistory, (state, payload) => {
  if (!payload.payload) {
    return state
  }

  const tickets = state[payload.ticketId] || []
  const result = R.pipe(
    R.uniqBy(R.prop('messageId')),
    R.sortBy(
      R.pipe(R.prop('createdAt'), (createdAt) => new Date(createdAt).getTime())
    )
  )([...tickets, ...payload.payload])

  return R.assocPath([payload.ticketId], result, state)
})

export const deleteMessage = createAction<{
  correlationId: string
  ticketId: string
}>(MessageActions.DELETE)

messagesReducer.on(deleteMessage, (state, { correlationId, ticketId }) => {
  const messages = state[ticketId] || []
  return R.assocPath(
    [ticketId],
    R.reject(
      (message) =>
        message.correlationId === correlationId ||
        message.messageId === correlationId,
      messages
    ),
    state
  )
})

type PatchMessageType = {
  correlationId: string
  ticketId: string
  payload: object
}

export const loadHistory = createAction(MessageActions.UPDATE_HISTORY)

export const patchMessage = createAction<PatchMessageType>(
  MessageActions.PATCH,
  (ticketId, correlationId, payload) => ({
    ticketId,
    correlationId,
    payload,
  })
)

messagesReducer.on(
  patchMessage,
  (state, { correlationId, ticketId, payload }) => {
    if (!state[ticketId]) {
      return state
    }

    const messageId = R.findIndex(
      propMessageIdEq(correlationId),
      state[ticketId]
    )
    const patchedMessage = R.mergeDeepRight(
      R.path([ticketId, messageId], state),
      payload
    )

    return R.assocPath([ticketId, messageId], patchedMessage, state)
  }
)

messagesReducer.on(
  [
    MessageTypes.MESSAGE_TEXT,
    ServiceTypes.SERVICE_ASSIGNED,
    ServiceTypes.SERVICE_ESCALATED,
  ] as any,
  (state, { message }: { message: MessageType }) => {
    const { ticketId } = message
    const messages = state[ticketId] || []

    const shouldUpdate = R.find(
      R.propEq('correlationId', message.correlationId),
      messages
    )

    if (shouldUpdate && message.correlationId) {
      return R.assocPath(
        [ticketId],
        R.map(
          (msg) =>
            msg.correlationId === message.correlationId ? message : msg,
          messages
        ),
        state
      )
    }

    return R.assocPath([ticketId], R.append(message, messages), state)
  }
)

messagesReducer.on(
  MessageTypes.MESSAGE_UPLOAD,
  (state, { message }: { message: MessageType }) => {
    const { ticketId } = message
    const messages = state[ticketId] || []

    const shouldUpdate = R.find(
      R.propEq('correlationId', message.correlationId),
      messages
    )

    if (shouldUpdate && message.correlationId) {
      return R.assocPath(
        [ticketId],
        R.map((msg) => {
          if (msg.correlationId === message.correlationId) {
            const { url, name } = msg.payload
            const newMessage = { ...msg }

            newMessage.payload.url = url
            newMessage.payload.name = name
            newMessage.payload.text = name
            return newMessage
          }

          return msg
        }, messages),
        state
      )
    }

    return R.assocPath([ticketId], R.append(message, messages), state)
  }
)

messagesReducer.on(logout, () => ({}))

export default messagesReducer
