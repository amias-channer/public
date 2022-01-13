import React, { useContext } from 'react'
import { FormattedMessage, FormattedTime, useIntl } from 'react-intl'
import {
  Flex,
  Box,
  Text,
  Badge,
  Media,
  Tooltip,
  AvatarCircle,
} from '@revolut/ui-kit'
import { rgba } from 'polished'
import { isSameDay } from 'date-fns'
import { ThemeContext } from 'styled-components'

import { TicketsResponseType, TicketStatus } from '../../api/ticketTypes'
import { EllipsisText } from '../styles'
import { decodeHtmlEntities } from '../../helpers/utils'
import { ChatDate } from '../ChatDate'
import { MessageMarkdown } from '../Message'
import {
  useChatTitle,
  useTicketStatusTitle,
  useStatusIconAssets,
} from '../../hooks'

import { ButtonFlexContainer, TicketContentBlock } from './styles'

type Props = {
  ticket: TicketsResponseType
  onClick: () => void
}

export const Ticket: React.FC<Props> = ({ onClick, ticket }: Props) => {
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)
  const title = useChatTitle(ticket)
  const statusIconAssets = useStatusIconAssets(ticket?.state, ticket?.readOnly)
  const statusTitle = useTicketStatusTitle(ticket?.state, ticket?.readOnly)

  const getIcon = () => {
    const StatusIcon = statusIconAssets.icon
    const statusColor = theme?.colors[statusIconAssets.color]

    if (!StatusIcon) {
      return null
    }

    return (
      <AvatarCircle variant='filled' bg={rgba(statusColor, 0.1)}>
        <StatusIcon size={24} color={statusColor} />
      </AvatarCircle>
    )
  }

  const getLastMessage = () => {
    const { lastMessage } = ticket

    if (!lastMessage) {
      return null
    }

    const fromClientLabel = lastMessage.fromClient
      ? formatMessage({
          id: 'supportChat.tickets.fromClientLabel',
          defaultMessage: 'You: ',
        })
      : ''
    const decodedHtmlEntities = decodeHtmlEntities(lastMessage.payload?.text!)
    const markdownText = (
      <MessageMarkdown isPreview>{decodedHtmlEntities}</MessageMarkdown>
    )
    return (
      <>
        {fromClientLabel} {markdownText}
      </>
    )
  }

  const getTicketText = () => {
    if (
      ticket?.title &&
      (ticket?.state !== TicketStatus.ASSIGNED || ticket?.readOnly)
    ) {
      return statusTitle
    }

    return getLastMessage()
  }

  const getContent = () => {
    const { lastMessage } = ticket

    if (ticket.state !== TicketStatus.OPEN && !lastMessage) {
      return null
    }

    const text = getTicketText()

    return (
      <>
        {title && (
          <Box>
            <Text fontWeight={500} color='black' mb='0.25rem'>
              {title}
            </Text>
          </Box>
        )}
        <Tooltip message={text} usePortal={false}>
          <EllipsisText variant='secondary' color='grey-50'>
            {text}
          </EllipsisText>
        </Tooltip>
      </>
    )
  }

  const getUnread = () => {
    const { unread } = ticket

    if (unread === 0) {
      return null
    }

    return <Badge>{unread}</Badge>
  }

  const getInfo = () => {
    switch (ticket.state) {
      case TicketStatus.OPEN:
      case TicketStatus.RESOLVED:
      case TicketStatus.CLOSED_AND_RATED:
      case TicketStatus.CLOSED:
      case TicketStatus.AWAITING_RESPONSE:
      case TicketStatus.ASSIGNED: {
        const { lastMessage } = ticket

        if (!lastMessage) {
          return null
        }

        const createdAt = lastMessage.createdAt
        const time = isSameDay(Date.now(), createdAt) ? (
          <FormattedTime value={createdAt} />
        ) : (
          <ChatDate date={createdAt} />
        )

        return (
          <>
            <Box height='1.25rem'>
              {ticket.state === TicketStatus.RESOLVED ? (
                <Text variant='secondary' color='accent' whiteSpace='nowrap'>
                  <FormattedMessage
                    id='supportChat.tickets.rateMe'
                    defaultMessage='Rate me'
                  />
                </Text>
              ) : (
                getUnread()
              )}
            </Box>
            <Box>
              <Text variant='secondary' color='lightGrey' whiteSpace='nowrap'>
                {time}
              </Text>
            </Box>
          </>
        )
      }
      default:
        return null
    }
  }

  return (
    <Box>
      <ButtonFlexContainer
        pt='15px'
        pb='14px'
        px='1rem'
        justifyContent='space-between'
        onClick={onClick}
      >
        <Media>
          <TicketContentBlock flex='1'>
            <Media>
              <Media.Side mr='1rem' mt='1px'>
                {getIcon()}
              </Media.Side>
              <TicketContentBlock flex='0 1 auto' mr='1rem'>
                <Flex
                  flexDirection='column'
                  justifyContent='flex-end'
                  height='100%'
                >
                  {getContent()}
                </Flex>
              </TicketContentBlock>
            </Media>
          </TicketContentBlock>
          <Media.Side flex='0'>
            <Flex
              alignItems='flex-end'
              height='100%'
              flexDirection='column'
              justifyContent='flex-end'
            >
              {getInfo()}
            </Flex>
          </Media.Side>
        </Media>
      </ButtonFlexContainer>
    </Box>
  )
}
