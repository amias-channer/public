import { FC, useContext } from 'react'
import { isEmpty } from 'lodash'
import { Footnote, Text, Button, Layout } from '@revolut/ui-kit'

import { checkRequired } from '@revolut/rwa-core-utils'

import { useTranslation } from '../../../../hooks'
import { Header, Main, DocumentsUpload } from '../../../../components'
import {
  I18nNamespace,
  getEmptyType,
  MAX_DOCUMENT_COUNT,
  MAX_DOCUMENT_SIZE,
} from '../../../../utils'
import { SOWDocumentTypeType } from '../../../../types/generated/sow'

import { StepComponentCommonProps } from '../../types'
import { IncomeSourceContext } from '../../providers'

export const DocumentUpload: FC<StepComponentCommonProps> = ({
  onForward,
  onAdditional,
  onBack,
}) => {
  const { t } = useTranslation(I18nNamespace.FormsDocumentUpload)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)

  const {
    currentDocumentType,
    documents,
    documentTypes,
    setDocuments,
    removeDocument,
    setCurrentDocumentType,
  } = useContext(IncomeSourceContext)

  const contextDocumentType = checkRequired(
    currentDocumentType,
    'DocumentType should exist',
  )

  const handleDocumentsSet = (files: File[]) => {
    setDocuments(files, contextDocumentType)
  }

  const handleDocumentsRemove = (name: string) => {
    removeDocument(name, contextDocumentType)
  }

  const onContinue = () => {
    const emptyType = getEmptyType(documentTypes, documents)

    if (!emptyType) {
      onForward()
      return
    }

    const isBankStatement = emptyType === SOWDocumentTypeType.BankStatement

    if (isBankStatement) {
      onAdditional()
    } else {
      setCurrentDocumentType(emptyType)
    }
  }

  const documentType = documentTypes?.[contextDocumentType]
  const allDocuments = Array.from(documents?.[contextDocumentType] ?? [])
  const isDisabled = isEmpty(allDocuments)

  return (
    <>
      <Main>
        <Header onBack={onBack} description={documentType?.description}>
          {documentType?.title ?? t('title')}
        </Header>

        <DocumentsUpload
          documents={allDocuments}
          onDocumentsChange={handleDocumentsSet}
          onDocumentsRemove={handleDocumentsRemove}
        />
      </Main>

      <Layout.Actions>
        <Button disabled={isDisabled} type="button" onClick={onContinue} elevated>
          {tCommon('continue')}
        </Button>

        <Footnote>
          <Text use="p" variant="caption">
            {tCommon('documentsUpload.hint', {
              count: MAX_DOCUMENT_COUNT,
              size: MAX_DOCUMENT_SIZE,
            })}
          </Text>
        </Footnote>
      </Layout.Actions>
    </>
  )
}
