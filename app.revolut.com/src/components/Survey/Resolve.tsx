import React from 'react'
import { TextBox } from '@revolut/ui-kit'
import { useSelector } from 'react-redux'

import { ResolutionOptionsAction } from '../../api/types'
import { ActionButton } from '../ActionButton'
import { useSendChatEvent } from '../../providers'
import { resolutionOptionsSelector } from '../../redux/selectors/resolutionOptions'
import { AnalyticsEvent } from '../../constants/analytics'

import { SurveyRateWrapper } from './styles'

export const TEST_ID_SURVEY_RESOLVE = 'TEST_ID_SURVEY_RESOLVE'

type Props = {
  onResolve: () => void
  onCancel: () => void
}

export const Resolve: React.FC<Props> = ({ onResolve, onCancel }: Props) => {
  const resolutionOptions = useSelector(resolutionOptionsSelector)
  const sendChatEvent = useSendChatEvent()

  if (resolutionOptions === null) {
    return null
  }

  const handleResolve = () => {
    onResolve()
    sendChatEvent({ type: AnalyticsEvent.SURVEY_RATE })
  }

  const handleCancel = () => {
    onCancel()
    sendChatEvent({ type: AnalyticsEvent.REOPEN })
  }

  const actionButtonVariant: Record<
    ResolutionOptionsAction,
    'primary' | 'secondary'
  > = {
    finish: 'primary',
    continue: 'secondary',
  }

  const actionButtonOnClick: Record<ResolutionOptionsAction, () => void> = {
    finish: handleResolve,
    continue: handleCancel,
  }

  return (
    <SurveyRateWrapper
      data-testid={TEST_ID_SURVEY_RESOLVE}
      p={2}
      mb={1}
      bg='white'
    >
      <TextBox py={1} px={2} textAlign='center' fontWeight={500}>
        {resolutionOptions.question.content}
      </TextBox>
      {resolutionOptions.question.answers.map((answer) => (
        <ActionButton
          key={answer.content}
          mt={2}
          variant={actionButtonVariant[answer.action]}
          onClick={actionButtonOnClick[answer.action]}
        >
          {answer.content}
        </ActionButton>
      ))}
    </SurveyRateWrapper>
  )
}
