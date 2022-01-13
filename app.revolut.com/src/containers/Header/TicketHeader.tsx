import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Text, H3, Flex } from '@revolut/ui-kit'

import {
  useChatTitle,
  useTicketStatusTitle,
  useStatusIconAssets,
} from '../../hooks'
import { currentTicketSelector } from '../../redux/selectors/tickets'

export const TicketHeader = () => {
  const ticket = useSelector(currentTicketSelector)
  const title = useChatTitle(ticket)
  const statusIconAssets = useStatusIconAssets(ticket?.state, ticket?.readOnly)
  const statusTitle = useTicketStatusTitle(ticket?.state, ticket?.readOnly)

  const StatusIcon = statusIconAssets.icon
  const color = statusIconAssets.color

  if (!StatusIcon) {
    return null
  }

  return (
    <Box px={2}>
      <H3>{title}</H3>
      <Flex alignItems='center'>
        <StatusIcon size={16} color={color} />
        <Text color='grey-50' ml={1}>
          {statusTitle}
        </Text>
      </Flex>
    </Box>
  )
}
