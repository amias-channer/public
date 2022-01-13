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
import { I18nNamespace } from '../../utils'
import { useSowState, useTranslation, useSotSubmissionLatest } from '../../hooks'
import { getHeaderInformation } from '../Overview/utils'

import { OverviewTestId } from '../Overview/constants'

export const SotOverview: FC = () => {
  const { t } = useTranslation(I18nNamespace.PageOverview)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const history = useHistory()

  const { isLoading, sowState } = useSowState()
  const { submissionLatest } = useSotSubmissionLatest()

  const isRestricted = sowState?.isRestricted
  const restrictions = sowState?.restrictions

  const handleBack = () => {
    history.push(CoreAppUrl.Home)
  }

  const state = submissionLatest?.state
  const reviewType = submissionLatest?.reviewState?.type

  const { image, title, subtitle } = getHeaderInformation(t, state, reviewType)

  return (
    <Main isLoading={isLoading}>
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
