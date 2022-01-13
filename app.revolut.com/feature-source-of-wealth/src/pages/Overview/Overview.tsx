import { FC } from 'react'
import { useHistory } from 'react-router-dom'

import { LockClosed } from '@revolut/icons'
import { Spacer } from '@revolut/rwa-core-components'
import { Url as CoreAppUrl } from '@revolut/rwa-core-utils'

import {
  EntityBlock,
  PhotoHeader,
  ListItem,
  Main,
  IncomeSourceItemLink,
} from '../../components'
import { Progress } from '../../widgets'
import { Url, I18nNamespace } from '../../utils'
import { useSowState, useTranslation, useSubmissionLatest } from '../../hooks'

import { getHeaderInformation } from './utils'

import { OverviewTestId } from './constants'

export const Overview: FC = () => {
  const { t } = useTranslation(I18nNamespace.PageOverview)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const history = useHistory()

  const { isLoading, sowState } = useSowState()
  const { submissionLatest, isLoading: isSubmissionLoading } = useSubmissionLatest()

  const isRestricted = sowState?.isRestricted
  const restrictions = sowState?.restrictions

  const handleBack = () => {
    history.push(CoreAppUrl.Home)
  }

  const goToReview = () => {
    history.push(Url.SowVerificationVerify)
  }

  const state = submissionLatest?.state
  const reviewType = submissionLatest?.reviewState?.type

  const { image, title, subtitle } = getHeaderInformation(t, state, reviewType)

  return (
    <Main isLoading={isLoading || isSubmissionLoading}>
      <PhotoHeader
        onBack={handleBack}
        image={image}
        useStatusIcon={isRestricted ? LockClosed : undefined}
        status={isRestricted ? t('restricted.sub_title') : undefined}
      >
        {title}
      </PhotoHeader>

      <Spacer h="s-16" />

      <Progress submissionLatest={submissionLatest} subtitle={subtitle} />

      <Spacer h="s-16" />

      <EntityBlock title={tCommon('toDo')}>
        <IncomeSourceItemLink
          reviewState={submissionLatest?.reviewState}
          onClick={goToReview}
          defaultTitle={t('button.unrestricted')}
        >
          {t('link.title')}
        </IncomeSourceItemLink>
      </EntityBlock>

      <Spacer h="s-16" />

      {isRestricted && (
        <EntityBlock
          title={t('Restrictions.title')}
          data-testid={OverviewTestId.Restrictions}
        >
          {restrictions?.map((restriction) => (
            <ListItem icon={LockClosed} key={restriction}>
              {restriction}
            </ListItem>
          ))}
        </EntityBlock>
      )}
    </Main>
  )
}
