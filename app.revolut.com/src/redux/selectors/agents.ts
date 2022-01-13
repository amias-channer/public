import * as R from 'ramda'
import { createSelector } from 'reselect'

import { GetAgentInfoResponseType } from '../../api/types'

import { currentTicketSelector } from './tickets'

export const agentsSelector = R.prop('agents')

export const agentByIdSelector = (agentId?: string) =>
  createSelector(
    agentsSelector,
    (agents: Record<string, GetAgentInfoResponseType>) =>
      agentId && agents[agentId]
  )

export const currentTicketAgentSelector = createSelector(
  agentsSelector,
  currentTicketSelector,
  (agents: Record<string, GetAgentInfoResponseType>, ticket) => {
    if (!ticket || !ticket.assigned) {
      return null
    }

    return agents[ticket.assigned]
  }
)
