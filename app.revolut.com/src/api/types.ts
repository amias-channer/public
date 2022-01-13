/* eslint-disable coherence/no-confusing-enum */
export type MessageId = string
export type Instant = string
export type TicketId = string
export type AgentId = string
export type AgentName = string

export interface AnonymousSigninResponseType {
  clientId?: string
  fromStorage: boolean
  anonymous: boolean
  businessName: string | null
  name: string | null
  phone?: string
  tags?: string[]
}

export interface StorageSigninType {
  fromStorage?: boolean
  anonymous?: boolean
  clientId?: string
}

export enum SupportStatusType {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  UNAVAILABLE = 'Unavailable',
}

export enum ChatRateState {
  NONE = 'none',
  BAD = 'bad',
  GOOD = 'good',
}

export enum MessagePayloadType {
  MESSAGE = 'message',
  SERVICE = 'service',
  MASS = 'mass',
}

export enum PayloadType {
  TEXT = 'text',
  STRUCTURE = 'structure',
  UPLOAD = 'upload',
  RESOLVED = 'resolved',
  ASSIGNED = 'assigned',
}

export enum ServiceType {
  INITIALIZED = 'initialized',
  RESOLVED = 'resolved',
  RATED = 'rated',
  ESCALATED = 'escalated',
  CLOSED = 'closed',
  ASSIGNED = 'assigned',
}

export enum MessageTypes {
  MESSAGE_TEXT = 'message_text',
  MESSAGE_UPLOAD = 'message_upload',
  MASS_TEXT = 'mass_text',
  STRUCTURE = 'structure',
}

export type NewTicketContext = {
  entityRef?: {
    name: string
    id: string
  }
} | null

export type TicketOptions = {
  context?: NewTicketContext
  titleKey?: string
}

type TimeRangeType = {
  from: string
  to: string
}

export type WeekDays =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'

export type WorkHoursType = { [T in WeekDays]: TimeRangeType }

/* GET /api/client/info */
export type ClientInfoResponseType = {
  active: boolean
  canOpenNewTicket: boolean
  language: string
  openAt: string
  status: SupportStatusType
  zoneId: string
  workHours: WorkHoursType
}

/* POST /api/client/tickets/:id/messages/text?correlationId?=UUID */
export type PostMessageRequestType = {
  agentId?: string
  type?: PayloadType
  text: string
}

export type PostMessageResponseType = {
  id: MessageId
  createdAt: Instant
  updatedAt: Instant
  ticketId: TicketId
  fromClient: boolean
  authorId: AgentId
  author?: {
    name: AgentName
  }
  payload: PostMessageRequestType
  payloadType: MessagePayloadType
  correlationId: string
}

/* GET /chat/api/client/agents/:agentId/info */
export type GetAgentInfoResponseType = {
  chats: number
  first_message: string
  first_response: string
  id: string
  name: string
  rating: number
  total_resolution: string
  src?: string
}

export type StatusBannerType = {
  title: string
  content: string
  mainAction?: {
    title: string
    link: string
  }
  secondaryAction?: {
    title: string
    link: string
  }
  image: string
  shouldTrack?: boolean
}

export type ResolutionOptionsAction = 'finish' | 'continue'

export type ResolutionOptionsType = {
  question: {
    content: string
    answers: {
      content: string
      action: ResolutionOptionsAction
    }[]
  }
}

export type DexterSuggestion = {
  title?: string
  titleKey?: string
  content: string
  lang: string
}
