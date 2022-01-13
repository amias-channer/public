import * as Icons from '@revolut/icons'
import { TicketStatus } from '../api/ticketTypes'

const TicketStatusIcon = {
  [TicketStatus.OPEN]: Icons.Chat,
  [TicketStatus.ASSIGNED]: Icons.Chat,
  [TicketStatus.AWAITING_RESPONSE]: Icons.Chat,
  [TicketStatus.RESOLVED]: Icons.StarFilled,
  [TicketStatus.CLOSED]: Icons.CheckSuccess,
  [TicketStatus.CLOSED_AND_RATED]: Icons.CheckSuccess,
}

const TicketStatusColor = {
  [TicketStatus.OPEN]: 'primary',
  [TicketStatus.ASSIGNED]: 'primary',
  [TicketStatus.AWAITING_RESPONSE]: 'primary',
  [TicketStatus.RESOLVED]: 'warning',
  [TicketStatus.CLOSED]: 'success',
  [TicketStatus.CLOSED_AND_RATED]: 'success',
}

export const useStatusIconAssets = (
  status: TicketStatus,
  isReadOnly?: boolean
) => {
  if (status === TicketStatus.OPEN && isReadOnly) {
    return {
      icon: Icons.Time,
      color: 'grey-50',
    }
  }

  if (status === TicketStatus.ASSIGNED && isReadOnly) {
    return {
      icon: Icons.Time,
      color: 'warning',
    }
  }

  return {
    icon: TicketStatusIcon[status],
    color: TicketStatusColor[status],
  }
}
