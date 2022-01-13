import { FC } from 'react'
import { useHistory, generatePath } from 'react-router-dom'

import { TextWidget, Layout, Button } from '@revolut/ui-kit'
import { Spacer, useModal } from '@revolut/rwa-core-components'

import {
  Header,
  IncomeSourceAmountItem,
  Main,
  SubmissionSubmitSuccessModal,
} from '../../components'
import { Url, I18nNamespace } from '../../utils'
import {
  LatestSubmission,
  IncomeSourceSide,
  MoreInfoSide,
  useIncomeSourceSide,
} from '../../widgets'
import { useSubmissionConfigs, useSubmissionLatest, useTranslation } from '../../hooks'

import { useContinue } from './hooks'

export const Verify: FC = () => {
  const { t } = useTranslation(I18nNamespace.PageVerify)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const history = useHistory()
  const { openSide, evidenceData, closeSide } = useIncomeSourceSide()
  const [openModal, { onRequestClose: closeModal, isOpen: isOpenModal }] = useModal()
  const [openInfoModal, { onRequestClose: closeInfoModal, isOpen: isOpenInfoModal }] =
    useModal()

  const { submissionLatest } = useSubmissionLatest()
  const { submissionConfigs, isLoading } = useSubmissionConfigs()
  const { onContinue, isSubmitting, isRequest, action, allowContinue } = useContinue({
    submissionLatest,
    onSuccessSubmit: openModal,
  })

  const {
    declaredTotalTopupInPercentage,
    topupLeftToDeclare,
    hasEnoughTopup,
    hasEnoughDeclaredTopup,
  } = submissionConfigs ?? {}

  const goToAddForm = () => {
    const path = generatePath(Url.SowVerificationFormIncomeSource, {
      actionToDoId: action?.id,
    })
    history.push(path)
  }

  const goBack = () => {
    history.push(Url.SowVerification)
  }

  const handleModalClose = () => {
    closeModal()
    history.push(Url.SowVerification)
  }

  return (
    <>
      <Main isLoading={isLoading}>
        <Header onInfo={openInfoModal} onBack={goBack} description={t('subtitle')}>
          {t('title')}
        </Header>

        {isRequest && (
          <>
            <TextWidget>
              <TextWidget.Content color="pink">{action?.message}</TextWidget.Content>
            </TextWidget>

            <Spacer h="s-16" />
          </>
        )}

        {hasEnoughTopup && !hasEnoughDeclaredTopup && (
          <IncomeSourceAmountItem
            title={t('AmountToVerify.title')}
            declaredPercentage={declaredTotalTopupInPercentage}
            topupLeft={topupLeftToDeclare}
          />
        )}

        <Spacer h="s-16" />

        <LatestSubmission
          submissionLatest={submissionLatest}
          onOpenSide={openSide}
          onAdd={goToAddForm}
          withAdd
        />
      </Main>

      <Layout.Actions>
        {allowContinue && (
          <Button onClick={onContinue} pending={isSubmitting} elevated>
            {tCommon('continue')}
          </Button>
        )}
      </Layout.Actions>

      <Layout.Side>
        {evidenceData.isOpen && (
          <IncomeSourceSide
            onExit={closeSide}
            isOpen={evidenceData.isOpen}
            evidence={evidenceData.evidence}
            allowDelete={allowContinue}
          />
        )}

        {isOpenInfoModal && (
          <MoreInfoSide isOpen={isOpenInfoModal} onExit={closeInfoModal} />
        )}
      </Layout.Side>

      <SubmissionSubmitSuccessModal isOpen={isOpenModal} onExit={handleModalClose} />
    </>
  )
}
