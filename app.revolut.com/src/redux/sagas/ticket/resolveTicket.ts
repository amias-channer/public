import { call } from 'redux-saga/effects'

import { resolveTicket } from '../../../api/API'
import { getError } from '../helpers'

export function* resolveTicketSaga({
  payload: { ticketId },
}: {
  payload: { ticketId: string }
}) {
  try {
    yield call(resolveTicket, ticketId)
  } catch (error) {
    yield getError(error)
  }
}
