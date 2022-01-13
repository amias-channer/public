import * as R from 'ramda'
import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'

import { TicketsResponseType, TicketStatus } from '../../api/ticketTypes'
import { TabsEnum } from '../../constants/routerPaths'
import { sortByUpdatedDate } from '../../helpers/utils'

export const ticketsSelector = R.prop('tickets')
export const allTicketsSelector = createSelector(ticketsSelector, R.values)

export const groupedTicketsSelector = createSelector(
  allTicketsSelector,
  R.pipe(R.sortBy(sortByUpdatedDate), R.groupBy(R.prop('state')))
)

export const assignedTicketsSelector = createSelector(
  groupedTicketsSelector,
  (tickets) => tickets[TicketStatus.ASSIGNED] || []
)

export const awaititngResponseTicketsSelector = createSelector(
  groupedTicketsSelector,
  (tickets) => tickets[TicketStatus.AWAITING_RESPONSE] || []
)

export const resolvedTicketsSelector = createSelector(
  groupedTicketsSelector,
  (tickets) => tickets[TicketStatus.RESOLVED] || []
)

export const openTicketsSelector = createSelector(
  groupedTicketsSelector,
  (tickets) => tickets[TicketStatus.OPEN] || []
)

export const closedTicketsSelector = createSelector(
  groupedTicketsSelector,
  (tickets) => tickets[TicketStatus.CLOSED] || []
)

export const closedAndRatedTicketsSelector = createSelector(
  groupedTicketsSelector,
  (tickets) => tickets[TicketStatus.CLOSED_AND_RATED] || []
)

export const oldTicketsSelector = createSelector(
  closedTicketsSelector,
  closedAndRatedTicketsSelector,
  (closed, closedAndRated) =>
    R.sortBy(sortByUpdatedDate, [...closed, ...closedAndRated])
)

export const ticketIdSelector = createSelector(
  createMatchSelector(`${TabsEnum.CHAT}/:ticketId`),
  R.path(['params', 'ticketId'])
)

export const currentTicketSelector = createSelector(
  ticketsSelector,
  ticketIdSelector,
  (tickets: { [key: string]: TicketsResponseType }, ticketId: string) =>
    tickets[ticketId]
)

export const ticketLoadingStateSelector = (ticketId: string) =>
  createSelector(ticketsSelector, R.pathOr(null, [ticketId, 'loading']))

export const currentTicketLoadingStateSelector = createSelector(
  ticketsSelector,
  ticketIdSelector,
  (tickets, ticketId: string) => R.pathOr(null, [ticketId, 'loading'], tickets)
)

export const currentTicketLanguageAvailabilitySelector = createSelector(
  ticketsSelector,
  ticketIdSelector,
  (tickets, ticketId: string) =>
    R.pathOr(null, [ticketId, 'languageAvailability'], tickets)
)

export const unreadMessagesSelector = createSelector(
  allTicketsSelector,
  R.reduce((acc, { unread }) => acc + Number(unread), 0)
)

export const unreadTicketsSelector = createSelector(
  allTicketsSelector,
  (elements) =>
    elements.filter(
      ({ unread, state }) => unread > 0 || state === TicketStatus.RESOLVED
    )
)

export const lastUnreadTicketSelector = createSelector(
  unreadTicketsSelector,
  R.last
)

export const awaitingTicketSelector = createSelector(
  allTicketsSelector,
  (elements) =>
    elements.filter(
      ({ state }) =>
        ![
          TicketStatus.CLOSED,
          TicketStatus.CLOSED_AND_RATED,
          TicketStatus.RESOLVED,
        ].includes(state)
    )
)
