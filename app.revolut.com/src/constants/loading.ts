export const TICKET_LOADING_STATE = {
  NONE: 0,
  LOADING: 1,
  COMPLETE: 2,
  FAILED: 3,
}

type TicketLoadingStateKeys = keyof typeof TICKET_LOADING_STATE
export type TicketLoadingState = typeof TICKET_LOADING_STATE[TicketLoadingStateKeys]
