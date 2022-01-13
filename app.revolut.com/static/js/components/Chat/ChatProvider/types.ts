export type ChatAgent = {
  name: string
  avatar?: string
}

export enum TicketStatus {
  OPEN = 'Open',
  ASSIGNED = 'Assigned',
  AWAITING_RESPONSE = 'AwaitingResponse',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  CLOSED_AND_RATED = 'ClosedAndRated',
}

export type ChatTicket = {
  id?: string
  agent?: ChatAgent
  assigned?: string
  readOnly: boolean
  unread?: number
  title?: string
  state: TicketStatus
  createdAt?: string
  lastMessage?: {
    fromClient: boolean
    payload: {
      text: string
    }
    createdAt: string
  }
}

export type ChatContextState = {
  hideDepth: number
  displayChatButton: boolean
  chatTickets: ChatTicket[]
  chatClientId: string | null
}

export const STATE_RATED = 'ClosedAndRated'

export enum ChatContextAction {
  RegisterHide = 'RegisterHide',
  UnregisterHide = 'UnregisterHide',
  SetChatVisibility = 'SetChatVisibility',
  UpdateChatTickets = 'UpdateChatTickets',
  SignIn = 'SignIn',
}

export type ChatAction =
  | { type: ChatContextAction.RegisterHide | ChatContextAction.UnregisterHide }
  | { type: ChatContextAction.SetChatVisibility; payload: boolean }
  | { type: ChatContextAction.UpdateChatTickets; payload: ChatTicket[] }
  | {
      type: ChatContextAction.SignIn
      payload: string | null
    }
