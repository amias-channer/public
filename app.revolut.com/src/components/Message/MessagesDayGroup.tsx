import * as React from 'react'
import { Box } from '@revolut/ui-kit'
import { FormattedMessage } from 'react-intl'
import { isSameDay } from 'date-fns'

import { MessageType } from '../../api/ticketTypes'
import { HandleFailedMessagePropType } from '../../containers/Chat/Chat'
import { getMessageUniqKey } from '../../helpers/utils'
import { ChatDate } from '../ChatDate'

import { MessagesBlockGroup } from './MessagesBlockGroup'
import { ChatDateTitle } from './styles'

type Props = {
  messageGroups: MessageType[][]
  onDeleteMessage: (props: HandleFailedMessagePropType) => void
  onRetryMessage: (props: HandleFailedMessagePropType) => void
  onRequestFullImage: (props: MessageType) => void
}
export const MessagesDayGroup = ({
  messageGroups = [],
  onDeleteMessage,
  onRetryMessage,
  onRequestFullImage,
}: Props) => {
  if (messageGroups.length === 0) {
    return null
  }

  const firstDayMessage = messageGroups[0][0]
  const createdAt = firstDayMessage?.createdAt
  const day = isSameDay(Date.now(), createdAt) ? (
    <FormattedMessage id='supportChat.message.today' defaultMessage='Today' />
  ) : (
    <ChatDate date={createdAt} />
  )

  return (
    <Box key={createdAt} width='100%'>
      <ChatDateTitle>{day}</ChatDateTitle>
      {messageGroups.map((group) => {
        const [first] = group
        const key = getMessageUniqKey(first)

        return (
          <MessagesBlockGroup
            key={key}
            messagesGroup={group}
            onDeleteMessage={onDeleteMessage}
            onRetryMessage={onRetryMessage}
            onRequestFullImage={onRequestFullImage}
          />
        )
      })}
    </Box>
  )
}
