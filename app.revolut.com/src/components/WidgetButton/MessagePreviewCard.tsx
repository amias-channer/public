import * as React from 'react'
import { Media, Box, Text, TextBox, Tooltip } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { FormattedMessage } from 'react-intl'

import {
  InlineButton,
  MessagePreviewsCardWrapper,
  CloseButtonWrapper,
} from '../styles'
import { TicketStatus, TicketsResponseType } from '../../api/ticketTypes'
import { AnalyticsContext } from '../../providers'
import { SendChatEvent } from '../../helpers/types'
import { MessageMarkdown } from '../Message'
import { AnalyticsEvent } from '../../constants/analytics'

type Props = {
  ticket: TicketsResponseType
  onView: (id: string) => void
  onClose: () => void
}

export const MessagePreviewCard = ({ ticket, onView, onClose }: Props) => {
  const sendChatEvent: SendChatEvent = React.useContext(AnalyticsContext)
  if (!ticket || !ticket.lastMessage) {
    return null
  }

  const { id: ticketId, state } = ticket
  const { author, payload } = ticket.lastMessage
  const isResolved = state === TicketStatus.RESOLVED

  if (!payload) {
    return null
  }

  const message = isResolved ? (
    <FormattedMessage
      id='supportChat.survey.didWeSolve'
      defaultMessage='Did we solve your issue?'
    />
  ) : (
    <MessageMarkdown isPreview>{payload.text}</MessageMarkdown>
  )

  return (
    <MessagePreviewsCardWrapper
      onClick={() => {
        onView(ticketId)
        sendChatEvent({ type: AnalyticsEvent.OPEN_MESSAGE_PREVIEW })
      }}
    >
      <Media>
        <Media.Content p='1.5rem' width='100%' flex='0 1 auto'>
          <Box mb={1}>
            {author && (
              <Text variant='secondary' fontWeight={500}>
                {ticket.unread > 1 ? (
                  <FormattedMessage
                    id='supportChat.tickets.unreadMessagesFrom'
                    defaultMessage='{unread} messages from {authorName}'
                    values={{
                      unread: ticket.unread,
                      authorName: author.name,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id='supportChat.tickets.chatMessageFrom'
                    defaultMessage='Chat message from {authorName}'
                    values={{ authorName: author.name }}
                  />
                )}
              </Text>
            )}
            {!author && (
              <Text variant='secondary' fontWeight={500}>
                <FormattedMessage
                  id='supportChat.previewCard.chatMessage'
                  defaultMessage='Chat message'
                />
              </Text>
            )}
          </Box>
          <Tooltip message={message}>
            <Box mb={1}>
              <TextBox color='grey-50' variant='secondary' ellipsis>
                {message}
              </TextBox>
            </Box>
          </Tooltip>
          <Box>
            <InlineButton variant='link' p={0} mt={2} color='primary'>
              <Text variant='secondary'>
                <FormattedMessage
                  id='supportChat.previewCard.viewFull'
                  defaultMessage='View full conversation'
                />
              </Text>
            </InlineButton>
          </Box>
        </Media.Content>
        <Media.Side>
          <CloseButtonWrapper>
            <InlineButton
              variant='default'
              height='auto'
              pr='0.75rem'
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                onClose()
                e.stopPropagation()
                sendChatEvent({ type: AnalyticsEvent.CLOSE_MESSAGE_PREVIEW })
              }}
            >
              <Icons.Cross color='grey-90' />
            </InlineButton>
          </CloseButtonWrapper>
        </Media.Side>
      </Media>
    </MessagePreviewsCardWrapper>
  )
}
