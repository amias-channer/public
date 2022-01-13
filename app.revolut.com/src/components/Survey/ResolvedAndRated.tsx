import React, { useEffect } from 'react'
import { H2, Text, Box } from '@revolut/ui-kit'
import { FormattedMessage } from 'react-intl'

import { useSendChatEvent } from '../../providers'
import { AnalyticsEvent } from '../../constants/analytics'
import { AnimationIcon } from '../AnimationIcon'

import { ResolvedAndRatedWrapper } from './styles'

export const ResolvedAndRated = () => {
  const sendChatEvent = useSendChatEvent()

  useEffect(() => {
    sendChatEvent({ type: AnalyticsEvent.SURVEY_SUCCESS_SCREEN })
  }, [sendChatEvent])

  return (
    <ResolvedAndRatedWrapper
      height='100%'
      alignItems='flex-start'
      justifyContent='center'
      px='2.5rem'
    >
      <AnimationIcon name='checkmark' color='primary' width='7.5rem' />
      <Box mt='2rem' mb='0.5rem'>
        <H2>
          <FormattedMessage
            id='supportChat.survey.thanks'
            defaultMessage='Thank you!'
          />
        </H2>
      </Box>
      <Text color='grey-35'>
        <FormattedMessage
          id='supportChat.survey.becomeBetter'
          defaultMessage="You've just helped us become better"
        />
      </Text>
    </ResolvedAndRatedWrapper>
  )
}
