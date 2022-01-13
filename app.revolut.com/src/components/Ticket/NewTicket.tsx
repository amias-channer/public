import * as React from 'react'
import { Flex, Box, Text, AvatarCircle } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { FormattedMessage } from 'react-intl'

import { AnalyticsContext } from '../../providers'
import { SendChatEvent } from '../../helpers/types'
import { AnalyticsEvent } from '../../constants/analytics'

import { ButtonFlexContainer } from './styles'

export const TEST_ID_CHAT_NEW_TICKET = 'TEST_ID_CHAT_NEW_TICKET'

type Props = {
  onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void
  isSupportOnline: boolean
  supportArrivalTime?: string
}

export class NewTicket extends React.Component<Props> {
  onClick = (sendChatEvent: SendChatEvent) => (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    const { onClick } = this.props
    onClick(event)
    sendChatEvent({ type: AnalyticsEvent.START_NEW_CHAT })
  }

  render() {
    const { isSupportOnline, supportArrivalTime } = this.props

    return (
      <AnalyticsContext.Consumer>
        {(sendChatEvent) => (
          <ButtonFlexContainer
            data-testid={TEST_ID_CHAT_NEW_TICKET}
            p='1rem'
            justifyContent='space-between'
            onClick={this.onClick(sendChatEvent)}
          >
            <Flex>
              <Box mr='1rem'>
                <AvatarCircle variant='filled' bg='primary'>
                  <Icons.Message size={24} color='white' />
                </AvatarCircle>
              </Box>
              <Box mr='1rem' maxWidth='100%'>
                <Flex
                  height='100%'
                  flexDirection='column'
                  justifyContent='center'
                >
                  <Box>
                    <Text color='primary'>
                      <FormattedMessage
                        id='supportChat.ticket.startNewTicket'
                        defaultMessage='Start new chat'
                      />
                    </Text>
                  </Box>
                  {!isSupportOnline && (
                    <Box>
                      <Text color='grey-50' variant='secondary'>
                        <FormattedMessage
                          id='supportChat.ticket.supportIsOffline'
                          defaultMessage='Support is offline. We’ll get back online in approximately'
                        />{' '}
                        {supportArrivalTime}.
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Flex>
          </ButtonFlexContainer>
        )}
      </AnalyticsContext.Consumer>
    )
  }
}
