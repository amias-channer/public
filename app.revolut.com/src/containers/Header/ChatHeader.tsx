import * as React from 'react'
import { useSelector } from 'react-redux'
import { TextBox, Flex, Box, TextButton } from '@revolut/ui-kit'
import { RouteComponentProps } from 'react-router'
import { NavigationBack } from '@revolut/icons'
import styled from 'styled-components'

import { TabsEnum } from '../../constants/routerPaths'
import { SendChatEvent } from '../../helpers/types'
import { useChatTitle } from '../../hooks'
import { AnalyticsContext, useIsChatHeaderMinimized } from '../../providers'
import { currentTicketSelector } from '../../redux/selectors/tickets'
import { AnalyticsEvent } from '../../constants/analytics'

export const TEST_ID_BACK_BUTTON = 'TEST_ID_BACK_BUTTON'

const FadeTextBox = styled(TextBox)`
  transition: color 0.2s ease-in-out;
`

export const ChatHeader: React.FC<RouteComponentProps> = ({
  history,
}: RouteComponentProps) => {
  const ticket = useSelector(currentTicketSelector)
  const title = useChatTitle(ticket)
  const isChatHeaderMinimized = useIsChatHeaderMinimized()

  const onClick = (sendChatEvent: SendChatEvent) => (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    history.push(TabsEnum.CHAT)
    sendChatEvent({ type: AnalyticsEvent.BACK_BUTTON })
  }

  return (
    <AnalyticsContext.Consumer>
      {(sendChatEvent: SendChatEvent) => (
        <Flex
          width='100%'
          p={2}
          justifyContent='space-between'
          alignItems='center'
        >
          <TextButton
            data-testid={TEST_ID_BACK_BUTTON}
            color='grey-50'
            onClick={onClick(sendChatEvent)}
          >
            <NavigationBack size={24} color='grey-50' />
          </TextButton>
          <FadeTextBox
            color={isChatHeaderMinimized ? 'black' : 'transparent'}
            variant='secondary'
            fontWeight={500}
          >
            {title}
          </FadeTextBox>
          <Box />
        </Flex>
      )}
    </AnalyticsContext.Consumer>
  )
}
