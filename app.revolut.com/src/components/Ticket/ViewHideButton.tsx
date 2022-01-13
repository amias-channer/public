import React, { useContext } from 'react'
import { Flex, Box, Text, AvatarCircle } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { FormattedMessage } from 'react-intl'
import { ThemeContext } from 'styled-components'
import { rgba } from 'polished'

import { SendChatEvent, SideEffect } from '../../helpers/types'
import { AnalyticsContext } from '../../providers'

import { ButtonFlexContainer } from './styles'

type Props = {
  onClick: SideEffect
  tickets: number
  isHideAction: boolean
}

const ToggleIcon = () => {
  const theme = useContext(ThemeContext)

  return (
    <AvatarCircle variant='filled' bg={rgba(theme?.colors['primary'], 0.1)}>
      <Icons.Ellipsis size={24} color='primary' />
    </AvatarCircle>
  )
}

export class ViewHideButton extends React.Component<Props> {
  onClick = (sendChatEvent: SendChatEvent) => (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    const { onClick } = this.props

    onClick()
    sendChatEvent({
      type: this.props.isHideAction ? 'hide all chats' : 'view all chats',
    })
  }

  render() {
    return (
      <AnalyticsContext.Consumer>
        {(sendChatEvent) => (
          <ButtonFlexContainer
            p='1rem'
            justifyContent='space-between'
            onClick={this.onClick(sendChatEvent)}
          >
            <Flex>
              <Box mr='1rem'>
                <ToggleIcon />
              </Box>
              <Box mr='1rem' maxWidth='100%'>
                <Flex height='100%' alignItems='center'>
                  <Text color='black'>
                    {this.props.isHideAction ? (
                      <FormattedMessage
                        id='supportChat.button.hide'
                        defaultMessage='Hide resolved requests'
                      />
                    ) : (
                      <FormattedMessage
                        id='supportChat.button.view'
                        defaultMessage='View all {tickets} requests'
                        values={{
                          tickets: this.props.tickets,
                        }}
                      />
                    )}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </ButtonFlexContainer>
        )}
      </AnalyticsContext.Consumer>
    )
  }
}
