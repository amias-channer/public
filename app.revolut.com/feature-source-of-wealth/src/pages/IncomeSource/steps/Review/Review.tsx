import { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { map, isEmpty } from 'lodash'
import { Button, Layout } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { formatMoney, getCurrentIntlLocale } from '@revolut/rwa-core-utils'

import { useTranslation } from '../../../../hooks'
import {
  Header,
  Main,
  Details,
  EntityBlock,
  DocumentGroupItem,
  SubmissionCreateSuccessModal,
  SubmissionCreateErrorModal,
  SubmissionPrimarySourceModal,
  SubmissionAmountModal,
} from '../../../../components'
import { I18nNamespace, Url } from '../../../../utils'
import { SOWDocumentTypeType } from '../../../../types'

import { StepComponentCommonProps, ReviewModal } from '../../types'
import { IncomeSourceContext } from '../../providers'

export const Review: FC<StepComponentCommonProps> = ({ onBack, onReset }) => {
  const history = useHistory()
  const { t } = useTranslation(I18nNamespace.FormsReview)
  const { t: tIncomeSource } = useTranslation(I18nNamespace.WidgetIncomeSourceSide)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)

  const {
    evidenceForm,
    documents,
    onSubmit,
    isSubmitting,
    closeSubmitPopup,
    openedModal,
    submissionMeta,
  } = useContext(IncomeSourceContext)

  const onExit = () => {
    closeSubmitPopup()
    history.push(Url.SowVerificationVerify)
  }

  const onAdd = () => {
    closeSubmitPopup()
    onReset()
  }

  const commonModalProps = {
    onExit,
    onAdd,
  }

  const details = [
    {
      title: tIncomeSource('details.source_of_income'),
      value: submissionMeta?.evidenceTitle,
    },
    {
      title: tIncomeSource('details.frequency'),
      value: submissionMeta?.frequencyTypes?.[evidenceForm.incomeFrequency]?.title,
    },
    {
      title: tIncomeSource('details.amount'),
      value:
        evidenceForm.minorAmount && evidenceForm.minorAmount
          ? formatMoney(
              evidenceForm.minorAmount,
              evidenceForm.currency,
              getCurrentIntlLocale(),
            )
          : 0,
    },
  ]

  return (
    <>
      <Main>
        <Header onBack={onBack} description={t('description')}>
          {t('title')}
        </Header>

        <Details details={details} />

        <Spacer h="s-16" />

        <EntityBlock title={t('Documents.title')}>
          {map(documents, (list, key: SOWDocumentTypeType) => (
            <DocumentGroupItem
              key={key}
              description={t('Documents.description', { count: list?.length })}
            >
              {submissionMeta?.documentsTypes?.[key]?.title}
            </DocumentGroupItem>
          ))}
        </EntityBlock>
      </Main>

      <Layout.Actions>
        <Button
          disabled={isEmpty(documents)}
          pending={isSubmitting}
          type="button"
          onClick={onSubmit}
          elevated
        >
          {tCommon('confirm')}
        </Button>
      </Layout.Actions>

      <SubmissionCreateSuccessModal
        isOpen={openedModal === ReviewModal.General}
        {...commonModalProps}
      />
      <SubmissionAmountModal
        isOpen={openedModal === ReviewModal.Amount}
        {...commonModalProps}
      />
      <SubmissionPrimarySourceModal
        isOpen={openedModal === ReviewModal.PrimarySource}
        {...commonModalProps}
      />
      <SubmissionCreateErrorModal
        isOpen={openedModal === ReviewModal.Error}
        onExit={onExit}
      />
    </>
  )
}
