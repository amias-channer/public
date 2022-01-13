import { FC } from 'react'
import { isEmpty, noop } from 'lodash'
import { Cash, Delete } from '@revolut/icons'
import {
  Side,
  Button,
  Header,
  Text,
  Avatar,
  SideProps,
  TextWidget,
} from '@revolut/ui-kit'

import { Spacer, AbsoluteLoader, useModal } from '@revolut/rwa-core-components'
import { checkRequired } from '@revolut/rwa-core-utils'

import {
  SOWLatestSubmissionEvidences,
  SOWLatestSubmissionDocuments,
} from '../../types/generated/sow'

import {
  SOTLatestSubmissionEvidences,
  SOTLatestSubmissionDocuments,
} from '../../types/generated/sot'

import { EntityBlock, Details, DocumentRequestModal } from '../../components'
import { useDeleteEvidence, useTranslation, useCreateDocuments } from '../../hooks'
import { I18nNamespace, getBadge, isRequested } from '../../utils'
import { IncomeSourceDocuments } from './IncomeSourceDocuments'

type IncomeSourceSideProps = {
  evidence?: SOWLatestSubmissionEvidences | SOTLatestSubmissionEvidences
  allowDelete?: boolean
} & SideProps

export const IncomeSourceSide: FC<IncomeSourceSideProps> = ({
  evidence,
  isOpen = false,
  onExit = noop,
  allowDelete = false,
}) => {
  const { t } = useTranslation(I18nNamespace.WidgetIncomeSourceSide)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)

  const [openModal, { isOpen: isOpenModal, onRequestClose: closeModal }] = useModal()

  const { createDocuments, isLoading: isDocumentLoading } = useCreateDocuments({
    onSuccess: () => {
      closeModal()
      onExit()
    },
  })
  const { deleteEvidence, isLoading } = useDeleteEvidence({
    onSuccess: () => {
      onExit()
    },
  })

  const {
    actionToDo,
    reviewState,
    id: evidenceId,
    // @ts-expect-error: userNote exists - type incorrect
    userNote,
    documents,
    title,
    description,
    incomeSource,
    incomeFrequency,
    amount,
  } = evidence ?? {}
  const {
    id: actionToDoId,
    entityVariant,
    entityVariantDetails,
    action,
    message,
  } = actionToDo ?? {}

  const isRequest = isRequested(action)

  const { color, icon } = getBadge(reviewState?.type)

  const details = [
    {
      title: t('details.source_of_income'),
      value: incomeSource?.title,
    },

    {
      title: t('details.frequency'),
      value: incomeFrequency?.title,
    },

    {
      title: t('details.amount'),
      value: amount,
    },
  ]

  const handleDeletion = () => {
    deleteEvidence(checkRequired(evidenceId, 'Evidence ID should exist'))
  }

  const handleDocumentsCreate = (passedDocuments: File[]) => {
    const actionEntityVariant = checkRequired(
      entityVariant,
      'Entity variant should exist',
    )

    if (actionEntityVariant) {
      createDocuments({
        actionToDoId,
        documents: {
          [actionEntityVariant]: passedDocuments,
        },
        evidenceId: checkRequired(evidenceId, 'Evidence ID should exist'),
      })
    }
  }

  const documentsExist = !isEmpty(documents)

  return (
    <>
      <Side isOpen={isOpen} onExit={onExit}>
        {evidence ? (
          <>
            <Header variant="item">
              <Header.CloseButton aria-label="Close" />
              <Header.Avatar>
                <Avatar useIcon={Cash} color="deep-grey" size={56}>
                  {icon && (
                    <Avatar.Badge bg={color} position="bottom-right" useIcon={icon} />
                  )}
                </Avatar>
              </Header.Avatar>
              <Header.Title>{title}</Header.Title>
              <Header.Description>{description}</Header.Description>
            </Header>

            {message && (
              <>
                <TextWidget>
                  <TextWidget.Content color="pink">{message}</TextWidget.Content>
                </TextWidget>

                <Spacer h="s-16" />
              </>
            )}

            {allowDelete && (
              <>
                <Button
                  onClick={handleDeletion}
                  pending={isLoading}
                  useIcon={Delete}
                  variant="negative"
                  size="sm"
                >
                  {tCommon('delete')}
                </Button>

                <Spacer h="s-16" />
              </>
            )}

            <Details details={details} />

            {documentsExist && (
              <IncomeSourceDocuments
                requestTitle={entityVariantDetails?.title}
                isRequest={isRequest}
                onOpenRequest={openModal}
                onExit={onExit}
                evidenceId={checkRequired(evidenceId, 'Evidence ID should exist')}
                reviewState={checkRequired(
                  reviewState,
                  'Evidence Review state should exist',
                )}
                documents={
                  documents as
                    | SOWLatestSubmissionDocuments[]
                    | SOTLatestSubmissionDocuments[]
                }
              />
            )}

            {userNote && (
              <>
                <Spacer h="s-16" />

                <EntityBlock title={tCommon('note')}>
                  <Text use="p" p="s-16">
                    {userNote}
                  </Text>
                </EntityBlock>
              </>
            )}
          </>
        ) : (
          <AbsoluteLoader />
        )}
      </Side>

      <DocumentRequestModal
        isOpen={isOpenModal}
        isSubmitting={isDocumentLoading}
        title={entityVariantDetails?.title}
        description={entityVariantDetails?.description}
        onClose={closeModal}
        onSubmit={handleDocumentsCreate}
      />
    </>
  )
}
