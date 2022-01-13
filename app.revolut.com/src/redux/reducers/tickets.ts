import * as R from 'ramda'
import { createAction, createReducer } from 'redux-act'

import { TicketLoadingState } from '../../constants/loading'
import { MessageType, TicketsResponseType } from '../../api/ticketTypes'
import { MessageTypes, TicketOptions } from '../../api/types'
import { StructuredMessage } from '../../constants/structuredMessage'

import { logout } from './auth'
import { patchMessage } from './messages'

type ReducerStateType = Record<string, TicketsResponseType>
const tickets = createReducer<ReducerStateType>({}, {})

export const initNewTicket = createAction(
  'TICKET/INIT_NEW',
  (
    uuid: string,
    content: string | StructuredMessage | FormData,
    options: TicketOptions,
    isStructured: boolean
  ) => ({
    uuid,
    content,
    options,
    isStructured,
  })
)

export const addTicket = createAction<Partial<TicketsResponseType>>(
  'TICKET/ADD_TICKET'
)
export const setTicketLoading = createAction(
  'TICKET/SET_LOADING',
  (ticketId: string, payload: TicketLoadingState) => ({
    ticketId,
    payload,
  })
)
export const addTickets = createAction<TicketsResponseType[]>(
  'TICKET/ADD_TICKETS'
)
export const patchTicket = createAction<{
  ticketId: string
  payload?: Partial<TicketsResponseType>
  onSuccess?: () => void
}>('TICKET/PATCH_TICKET')
export const fetchTicketsList = createAction('TICKET/FETCH_TICKETS')
export const fetchTicket = createAction(
  'TICKET/FETCH_TICKET',
  (ticketId: string) => ({
    ticketId,
  })
)
export const readTicket = createAction(
  'TICKET/READ',
  (ticketId: string, unread: number) => ({
    ticketId,
    unread,
  })
)

export const resolveTicket = createAction(
  'TICKET/RESOLVE_TICKET',
  (ticketId: string) => ({ ticketId })
)

export const changeTicketLanguageToEnglish = createAction(
  'TICKET/CHANGE_TICKET_LANGUAGE_TO_ENGLISH',
  (ticketId: string, onSuccess: () => void) => ({ ticketId, onSuccess })
)

export const checkTicketLanguageAvailability = createAction(
  'TICKET/CHECK_TICKET_LANGUAGE_AVAILABILITY',
  (ticketId: string) => ({ ticketId })
)

export const setTicketLanguageAvailability = createAction(
  'TICKET/SET_TICKET_LANGUAGE_AVAILABILITY',
  (ticketId: string, payload: object) => ({ ticketId, payload })
)

tickets.on(logout, () => ({}))

tickets.on(setTicketLoading, (state, { ticketId, payload }) => {
  if (!ticketId) {
    return state
  }

  if (!state[ticketId]) {
    return R.assoc(
      ticketId,
      {
        id: ticketId,
        loading: payload,
      },
      state
    )
  }

  return R.assocPath([ticketId, 'loading'], payload, state)
})

tickets.on(patchTicket, (state, { ticketId, payload }) => {
  const ticket = R.prop(ticketId, state)

  if (!ticket) {
    return state
  }

  return R.assoc(ticketId, R.mergeDeepLeft(payload, ticket), state)
})

tickets.on(addTickets, (state, payload) =>
  R.mergeDeepLeft(
    payload.reduce(
      (acc, ticket) => ({
        ...acc,
        ...(ticket.id && { [ticket.id]: ticket }),
      }),
      {}
    ),
    state
  )
)

tickets.on(addTicket, (state, payload) => {
  const ticketId = payload.id

  if (!ticketId) {
    return state
  }

  return R.assoc(ticketId, payload, state)
})

type PatchMessageType = {
  correlationId: string
  ticketId: string
  payload: object
}
tickets.on(
  patchMessage,
  (state, { correlationId, ticketId, payload }: PatchMessageType) => {
    if (!state[ticketId]) {
      return state
    }

    const message = state[ticketId].lastMessage

    if (
      !message ||
      (message.id !== correlationId && message.correlationId !== correlationId)
    ) {
      return state
    }

    const patchedMessage = R.mergeDeepLeft(payload, message)

    return R.assocPath([ticketId, 'lastMessage'], patchedMessage, state)
  }
)

tickets.on(
  [
    MessageTypes.MESSAGE_TEXT,
    MessageTypes.MESSAGE_UPLOAD,
    MessageTypes.MASS_TEXT,
  ] as any,
  (state, { message }: { message: MessageType }) => {
    const ticket = state[message.ticketId]

    let unread = (ticket && ticket.unread) || 0
    if (!message.fromClient) {
      unread += 1
    }

    return R.pipe(
      R.assocPath([message.ticketId, 'unread'], unread),
      R.assocPath([message.ticketId, 'lastMessage'], message)
    )(state)
  }
)

tickets.on(setTicketLanguageAvailability, (state, { ticketId, payload }) => {
  if (!ticketId) {
    return state
  }

  if (!state[ticketId]) {
    return R.assoc(
      ticketId,
      {
        id: ticketId,
        languageAvailability: payload,
      },
      state
    )
  }

  return R.assocPath([ticketId, 'languageAvailability'], payload, state)
})
export default tickets
