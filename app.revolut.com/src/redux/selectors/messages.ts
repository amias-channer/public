import * as R from 'ramda'
import { createSelector } from 'reselect'

import { MessageType } from '../../api/ticketTypes'
import { MessagePayloadType, ServiceType } from '../../api/types'
import { BOT_IDS_TO_IGNORE } from '../../constants/agents'

import { ticketIdSelector } from './tickets'

export const getMessages = R.propOr({}, 'messages')

export const currentTicketMessagesSelector = createSelector(
  getMessages,
  ticketIdSelector,
  (messages: { [key: string]: MessageType[] }, ticketId: string) =>
    messages[ticketId] || []
)

const hasMessagesFromAgentBeforeReassignment = (
  followUpMessages: MessageType[],
  agentId: string
) => {
  for (const message of followUpMessages) {
    // When reassignment happened before any follow-up messages from the current agent.
    if (
      [ServiceType.ASSIGNED, ServiceType.ESCALATED].includes(
        message.payload.type
      )
    ) {
      return false
    }

    if (message.author?.id === agentId) {
      return true
    }
  }
  return false
}

const checkIsVisibleServiceMessage = (
  followUpMessages: MessageType[],
  message: MessageType
) => {
  switch (message.payload.type) {
    case ServiceType.ASSIGNED:
    case ServiceType.ESCALATED: {
      const agentId =
        message.payload.assigned?.agentId || message.payload.agentId
      return (
        agentId &&
        !BOT_IDS_TO_IGNORE.includes(agentId) &&
        hasMessagesFromAgentBeforeReassignment(followUpMessages, agentId)
      )
    }
    case ServiceType.RATED:
      return true
    default:
      return false
  }
}

export const chatMessagesSelector = createSelector(
  currentTicketMessagesSelector,
  (messages) =>
    Array.isArray(messages)
      ? messages.filter(
          (message, index) =>
            [MessagePayloadType.MESSAGE, MessagePayloadType.MASS].includes(
              message.payloadType
            ) ||
            (message.payloadType === MessagePayloadType.SERVICE &&
              checkIsVisibleServiceMessage(messages.slice(index + 1), message))
        )
      : []
)

export const getMessageByCorrelationIdSelector = (correlationId: string) =>
  createSelector(
    chatMessagesSelector,
    R.find((msg: MessageType) => msg.correlationId === correlationId)
  )

export const serviceMessagesSelector = createSelector(
  currentTicketMessagesSelector,
  (messages) =>
    messages
      ? messages.filter(R.propEq('payloadType', MessagePayloadType.SERVICE))
      : []
)

export const groupedChatMessagesSelector = createSelector(
  chatMessagesSelector,
  (messages) => messages
)

export const getMessage = (ticketId: string, correlationId: string) =>
  createSelector(
    getMessages,
    R.pipe(
      R.propOr([], ticketId),
      R.find(R.propEq('correlationId', correlationId))
    )
  )
