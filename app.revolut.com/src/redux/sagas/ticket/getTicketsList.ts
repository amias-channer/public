import * as R from 'ramda'
import { all, call, put, take, spawn } from 'redux-saga/effects'

import { getTickets, getTicketsHistoryBefore } from '../../../api/API'
import { MAX_NUM_TICKETS_OBTAIN } from '../../../constants/api'
import { setLoading } from '../../reducers/loading'
import * as authActions from '../../reducers/auth'
import * as ticketActions from '../../reducers/tickets'
import { getCommonBannerSaga } from '../banners/getCommonBanner'
import { getError } from '../helpers'
import { TicketsResponseType } from '../../../api/ticketTypes'

import { fetchTicketsAdditionalInformation } from './fetchAgentsAndImagesByTickets'

function* getHistoryTickets() {
  try {
    const tickets = []
    let beforeTime: string | undefined = new Date().toISOString()
    let loadTickets = true

    while (loadTickets && beforeTime) {
      const loadedTickets = yield call(getTicketsHistoryBefore, beforeTime)
      tickets.push(...loadedTickets)

      const last = R.last(loadedTickets) as TicketsResponseType
      if (loadedTickets.length === MAX_NUM_TICKETS_OBTAIN) {
        beforeTime = last.createdAt
      } else {
        loadTickets = false
      }
    }

    yield put(ticketActions.addTickets(tickets))
    yield call(fetchTicketsAdditionalInformation, tickets)
  } catch (error) {
    yield getError(error)
  }
}

export function* getActiveTicketsSaga() {
  try {
    const tickets = yield call(getTickets)
    yield put(ticketActions.addTickets(tickets))
    yield call(fetchTicketsAdditionalInformation, tickets)
  } catch (error) {
    yield getError(error)
  }
}

export function* getTicketsSaga() {
  yield put(setLoading(true))

  yield all([call(getActiveTicketsSaga), call(getHistoryTickets)])
  yield spawn(getCommonBannerSaga)

  yield put(setLoading(false))

  yield take(authActions.logout)
}
