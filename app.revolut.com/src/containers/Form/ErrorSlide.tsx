import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, H3, Button, Absolute, Text } from '@revolut/ui-kit'

import { AnimationIcon } from '../../components/AnimationIcon'

type Props = {
  errorText: string
  onRetry: () => void
}

export const ErrorSlide = ({ onRetry, errorText }: Props) => (
  <Flex
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    px={4}
    pb={7}
    height='100%'
  >
    <AnimationIcon color='primary' name='cross' width='6rem' />
    <H3 pt='1.5rem' textAlign='center'>
      <FormattedMessage id='chat.ticket.error' defaultMessage='Error' />
    </H3>
    <Text color='grey-35' pt='1.5rem'>
      {errorText}
    </Text>
    <Absolute width='100%' px={2} pb='1.5rem' bottom={0}>
      <Button elevation variant='secondary' onClick={onRetry}>
        <FormattedMessage id='chat.ticket.retry' defaultMessage='Retry' />
      </Button>
    </Absolute>
  </Flex>
)
