import { fork } from '@redux-saga/core/effects'

import { TicketsResponseType } from '../../../api/ticketTypes'
import { isUploadTypeAcceptable } from '../../../helpers/utils'
import { fetchFileSaga } from '../file'

export function* fetchLastMessage(ticket: TicketsResponseType) {
  const { lastMessage, id: ticketId } = ticket
  if (lastMessage && isUploadTypeAcceptable(lastMessage.payload.mediaType)) {
    yield fork(
      fetchFileSaga,
      {
        payload: {
          ...lastMessage,
          ticketId,
          messageId: lastMessage.id,
        },
      },
      true
    )
  }
}
