import { all, call, put, select, spawn } from 'redux-saga/effects'

import { TICKET_LOADING_STATE } from '../../../constants/loading'
import { getTicket, getHistory } from '../../../api/API'
import * as messageActions from '../../reducers/messages'
import * as ticketActions from '../../reducers/tickets'
import * as agentActions from '../../reducers/agents'
import { ticketLoadingStateSelector } from '../../selectors/tickets'
import { fetchFileSaga, fetchStructuredMessageFilesSaga } from '../file'
import { getBannerSaga } from '../banners/getBanner'
import { getError } from '../helpers'
import { PayloadType, ServiceType } from '../../../api/types'
import { TicketStatus } from '../../../api/ticketTypes'
import { MESSAGES_LENGTH } from '../../../constants/utils'

import { feedbackSaga } from './feedback'
import { ticketResolutionOptionsSaga } from './resolutionOptions'

export function* getTicketSaga({
  payload: { ticketId },
}: {
  payload: { ticketId: string }
}) {
  try {
    const loadingState = yield select(ticketLoadingStateSelector(ticketId))

    if (loadingState === TICKET_LOADING_STATE.COMPLETE) {
      return null
    }

    yield put(
      ticketActions.setTicketLoading(ticketId, TICKET_LOADING_STATE.LOADING)
    )

    const [ticketInfo, data] = yield all([
      call(getTicket, ticketId),
      call(getHistory, ticketId, new Date().toISOString(), MESSAGES_LENGTH),
    ])

    yield spawn(getBannerSaga, ticketId)
    yield spawn(feedbackSaga, ticketId)

    if (ticketInfo.state === TicketStatus.RESOLVED) {
      yield spawn(ticketResolutionOptionsSaga, ticketId)
    }

    yield put(agentActions.fetchAgent(ticketInfo.assigned))
    yield put(
      ticketActions.patchTicket({
        ticketId: ticketInfo.id,
        payload: ticketInfo,
      })
    )
    yield put(
      ticketActions.setTicketLoading(ticketId, TICKET_LOADING_STATE.COMPLETE)
    )
    yield put(
      messageActions.putTicketMessageHistory({ payload: data, ticketId })
    )
    for (const i in data) {
      if (Object.prototype.hasOwnProperty.call(data, i)) {
        const item = data[i]
        if (item) {
          if (item.payload.type === PayloadType.UPLOAD) {
            yield spawn(fetchFileSaga, { payload: item }, true)
          } else if (item.payload.type === PayloadType.STRUCTURE) {
            yield spawn(fetchStructuredMessageFilesSaga, { payload: item })
          } else if (
            [ServiceType.ASSIGNED, ServiceType.ESCALATED].includes(
              item.payload.type
            )
          ) {
            const agentId =
              item.payload?.assigned?.agentId || item.payload?.agentId
            yield put(agentActions.fetchAgent(agentId))
          }
        }
      }
    }
  } catch (error) {
    yield put(
      ticketActions.setTicketLoading(ticketId, TICKET_LOADING_STATE.FAILED)
    )
    yield getError(error)
  }
}
