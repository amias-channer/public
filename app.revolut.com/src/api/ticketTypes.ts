/* eslint-disable coherence/no-confusing-enum */
import { PayloadType, AgentId, MessagePayloadType, ServiceType } from './types'
import { StructuredMessageContainer } from '../constants/structuredMessage'

export enum TicketStatus {
  OPEN = 'Open',
  ASSIGNED = 'Assigned',
  AWAITING_RESPONSE = 'AwaitingResponse',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  CLOSED_AND_RATED = 'ClosedAndRated',
}

type BaseMessageType = {
  id: string
  payload: {
    mediaType?: string
    url?: string
    type: PayloadType & ServiceType
    text?: string
    content?: StructuredMessageContainer
    name?: string
    uploadId?: string
    meta: {
      botMessage: boolean
      idleMessage: boolean
    }
    messageId?: string
  }
  createdAt: string
  updatedAt?: string
  payloadType: MessagePayloadType
  ticketId: string
  messageId: string
  correlationId: string
  clientMessageId: string
  author?: {
    id: string
    name: string
  }
  isSending: boolean
  isFailed: boolean
  isRetry: boolean
}

type MessageTypeFromClient = {
  fromClient: true
}

type MessageTypeFromAgent = {
  fromClient: false
  author: {
    id: string
    name: string
  }
}

type SystemMessageType = {
  payload?: {
    rating?: number
    agentId?: string
    assigned?: {
      agentId?: string
    }
  }
}

export type MessageType = BaseMessageType &
  SystemMessageType &
  (MessageTypeFromAgent | MessageTypeFromClient)

export type BannerResponseType = {
  text: string
  updateTime: string
  version: number
  id: string
}

export type TicketsResponseType = {
  assigned?: AgentId
  bot: boolean
  createdAt?: string
  id: string
  language: string
  unread: number
  readOnly: boolean
  updatedAt: string
  banner?: BannerResponseType
  lastMessage?: MessageType
  title?: string
  state: TicketStatus
}
