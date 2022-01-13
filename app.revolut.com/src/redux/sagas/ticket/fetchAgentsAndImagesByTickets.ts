import { put, select, spawn } from 'redux-saga/effects'

import { TicketsResponseType } from '../../../api/ticketTypes'
import { agentByIdSelector } from '../../selectors/agents'
import * as agentActions from '../../reducers/agents'
import { ACCEPTED_UPLOAD_TYPES } from '../../../constants/upload'
import { uniqAgentsFromTickets } from '../../../helpers/utils'
import { fetchFileSaga } from '../file'

export function* fetchTicketsAdditionalInformation(
  tickets: TicketsResponseType[]
) {
  const agents = uniqAgentsFromTickets(tickets)

  for (const i in agents) {
    if (agents[i]) {
      const hasAgent = yield select(agentByIdSelector(agents[i]))
      if (!hasAgent) {
        yield put(agentActions.fetchAgent(agents[i]))
      }
    }
  }

  for (const i in tickets) {
    if (tickets[i]) {
      const { lastMessage } = tickets[i]
      if (
        lastMessage &&
        ACCEPTED_UPLOAD_TYPES.test(lastMessage.payload.mediaType as string)
      ) {
        yield spawn(fetchFileSaga, { payload: lastMessage }, true)
      }
    }
  }
}
