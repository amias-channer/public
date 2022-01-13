import { defineMessages, useIntl } from 'react-intl'

import { TicketStatus } from '../api/ticketTypes'

const ticketStatusTitle = defineMessages({
  [TicketStatus.OPEN]: {
    id: 'supportChat.tickets.lookingForAgent',
    defaultMessage: 'Looking for an agent...',
  },
  [TicketStatus.ASSIGNED]: {
    id: 'supportChat.tickets.inProgress',
    defaultMessage: 'In progress',
  },
  [TicketStatus.AWAITING_RESPONSE]: {
    id: 'supportChat.tickets.inProgress',
    defaultMessage: 'In progress',
  },
  [TicketStatus.RESOLVED]: {
    id: 'supportChat.tickets.rateYourExperience',
    defaultMessage: 'Rate your experience',
  },
  [TicketStatus.CLOSED]: {
    id: 'supportChat.tickets.resolved',
    defaultMessage: 'Resolved',
  },
  [TicketStatus.CLOSED_AND_RATED]: {
    id: 'supportChat.tickets.resolved',
    defaultMessage: 'Resolved',
  },
})

export const useTicketStatusTitle = (
  status: TicketStatus,
  isReadOnly?: boolean
) => {
  const { formatMessage } = useIntl()

  if (status === TicketStatus.OPEN && isReadOnly) {
    return formatMessage({
      id: 'supportChat.tickets.submitted',
      defaultMessage: 'Submitted',
    })
  }

  return ticketStatusTitle[status]
    ? formatMessage(ticketStatusTitle[status])
    : ''
}
