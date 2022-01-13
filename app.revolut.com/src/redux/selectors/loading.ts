import { createSelector } from 'reselect'
import * as R from 'ramda'

export const getLoading = R.prop('loading')

export const getTicketsListLoading = createSelector(
  getLoading,
  R.prop('loading')
)

export const getTicketLoading = createSelector(
  getLoading,
  R.path(['ticketIsLoading'])
)

export const getLoadingTickets = createSelector(getLoading, R.path(['tickets']))
