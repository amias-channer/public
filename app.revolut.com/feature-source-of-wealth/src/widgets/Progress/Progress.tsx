import format from 'date-fns/format'
import { map } from 'lodash'
import { FC } from 'react'
import {
  Text,
  Media,
  Card,
  ProgressSteps,
  ProgressStep,
  H4,
  Box,
  Color,
} from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'

import { isValid } from 'date-fns'

import { useTranslation } from '../../hooks'
import { I18nNamespace } from '../../utils'
import { DATE_FORMAT, ProgressStep as ProgressStepType } from './constants'
import { ProgressProps } from './types'
import { getSteps, getProgress } from './utils'

export const Progress: FC<ProgressProps> = ({
  submissionLatest,
  subtitle,
  ...cardProps
}) => {
  const { t } = useTranslation(I18nNamespace.ComponentsProgress)

  const state = submissionLatest?.state
  const reviewType = submissionLatest?.reviewState?.type

  const { color = Color.PRIMARY, progress, doneSteps } = getProgress(state, reviewType)

  const steps = getSteps(t, {
    submittedDate: submissionLatest?.submittedDate,
    reviewStartedDate: submissionLatest?.reviewStartedDate,
    approvedDate: submissionLatest?.approvedDate,
  })

  return (
    <Card variant="plain" p="s-16" {...cardProps}>
      <Box>
        <Text variant="caption" color="grey-tone-50">
          {subtitle}
        </Text>
      </Box>

      <Spacer h="s-16" />

      <Media py="s-16">
        <Media.Content>
          <H4>{t('title')}</H4>
        </Media.Content>
        <Media.Side>
          <Text variant="caption">{progress}</Text>
        </Media.Side>
      </Media>

      <Box pb="s-16">
        <ProgressSteps>
          {map(steps, (step, key: ProgressStepType) => {
            const isDone = doneSteps?.includes(key)
            const isInReview = key === ProgressStepType.InReview
            return (
              <ProgressStep
                done={isDone}
                key={key}
                color={isInReview ? color : Color.PRIMARY}
              >
                <ProgressStep.Title>{step.title}</ProgressStep.Title>

                {step.date && isValid(step.date) && (
                  <ProgressStep.Description>
                    {format(step.date, DATE_FORMAT)}
                  </ProgressStep.Description>
                )}
              </ProgressStep>
            )
          })}
        </ProgressSteps>
      </Box>
    </Card>
  )
}
