import { isEmpty } from 'lodash'
import { FC, useState } from 'react'

import { Popup, Header, TextWidget, Box, Text, Button } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'

import { useTranslation } from '../../hooks'
import { I18nNamespace, MAX_DOCUMENT_COUNT, MAX_DOCUMENT_SIZE } from '../../utils'
import { DocumentsUpload } from '../Documents/DocumentsUpload'

export type DocumentRequestModalProps = {
  title?: string
  description?: string
  message?: string
  isSubmitting?: boolean
  isOpen?: boolean
  onClose: VoidFunction
  onSubmit: (files: File[]) => void
}

export const DocumentRequestModal: FC<DocumentRequestModalProps> = ({
  title,
  description,
  message,
  isSubmitting = false,
  isOpen = false,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation(I18nNamespace.ComponentsModals)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const [documents, setDocuments] = useState<File[]>([])

  const handleDocumentsRemove = (name: string) => {
    const newDocuments = documents.filter((document: File) => {
      return document.name !== name
    })

    setDocuments(newDocuments)
  }

  const handleSubmit = () => {
    onSubmit(documents)
  }

  const isDisabled = isEmpty(documents)

  return (
    <Popup isOpen={isOpen} onExit={onClose} variant="modal-view">
      <Header variant="form">
        <Header.CloseButton aria-label="Close" />
        <Header.Title>{title ?? t('DocumentRequestModal.title')}</Header.Title>
        {description && <Header.Description>{description}</Header.Description>}
      </Header>

      {message && (
        <>
          <TextWidget>
            <TextWidget.Content color="pink">{message}</TextWidget.Content>
          </TextWidget>
          <Spacer h="s-16" />
        </>
      )}

      <DocumentsUpload
        documents={documents}
        onDocumentsChange={setDocuments}
        onDocumentsRemove={handleDocumentsRemove}
      />

      <Box pt="s-16">
        <Text use="p" textAlign="center" variant="caption" color="grey-tone-50">
          {tCommon('documentsUpload.hint', {
            count: MAX_DOCUMENT_COUNT,
            size: MAX_DOCUMENT_SIZE,
          })}
        </Text>
      </Box>

      <Popup.Actions>
        <Button
          pending={isSubmitting}
          disabled={isDisabled}
          onClick={handleSubmit}
          elevated
        >
          {t('DocumentRequestModal.button.title')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
