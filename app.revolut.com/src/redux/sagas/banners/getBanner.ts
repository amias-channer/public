import { call, put } from 'redux-saga/effects'

import { getTicketBanner } from '../../../api/API'
import * as ticketActions from '../../reducers/tickets'

export function* getBannerSaga(ticketId: string) {
  const banner = yield call(getTicketBanner, ticketId)
  yield put(
    ticketActions.patchTicket({
      ticketId,
      payload: {
        banner,
      },
    })
  )
}
