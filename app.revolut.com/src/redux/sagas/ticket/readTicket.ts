import { call, spawn } from 'redux-saga/effects'

import { postReadTicket } from '../../../api/API'
import {
  setItemToLocalStorage,
  LocalStorage,
  getItemFromLocalStorage,
} from '../../../constants/storage'
import { getActiveTicketsSaga } from './getTicketsList'

export function* readTicketSaga({
  payload,
}: {
  payload: { ticketId: string; unread: number }
}) {
  const lastRead =
    (getItemFromLocalStorage(LocalStorage.CHAT_LAST_READ) as object) || {}

  setItemToLocalStorage(LocalStorage.CHAT_LAST_READ, {
    ...lastRead,
    [payload.ticketId]: Date.now(),
  })

  if (payload.unread > 0) {
    yield call(postReadTicket, payload.ticketId)
    yield spawn(getActiveTicketsSaga)
  }
}
