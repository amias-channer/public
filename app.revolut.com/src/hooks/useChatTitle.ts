import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'

import { agentByIdSelector } from '../redux/selectors/agents'
import { TicketsResponseType } from '../api/ticketTypes'

export const useChatTitle = (ticket: TicketsResponseType) => {
  const { formatMessage } = useIntl()
  const agent = useSelector(agentByIdSelector(ticket?.assigned))
  const ticketTitle = ticket?.title

  if (ticketTitle) {
    return ticketTitle
  }

  if (agent && agent.name) {
    return formatMessage(
      {
        id: 'supportChat.tickets.chatWithAgent',
        defaultMessage: 'Chat with {agentName}',
      },
      {
        agentName: agent.name,
      }
    )
  }

  return formatMessage({
    id: 'supportChat.tickets.chatWithUs',
    defaultMessage: 'Chat with us',
  })
}
