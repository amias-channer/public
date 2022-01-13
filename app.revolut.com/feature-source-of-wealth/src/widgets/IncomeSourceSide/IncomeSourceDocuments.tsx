import { FC, useCallback, useState } from 'react'

import { Spacer, ImagePdfViewer, useModal } from '@revolut/rwa-core-components'

import { UUID } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import {
  SOWLatestSubmissionDocuments,
  SOWReviewState,
  SOTLatestSubmissionDocuments,
  SOTReviewState,
} from 'types'

import {
  EntityBlock,
  DocumentGroupItem,
  DocumentPagesModal,
  DocumentRequestModal,
} from '../../components'
import { useCreateDocuments, useTranslation } from '../../hooks'
import { isReasked, I18nNamespace } from '../../utils'
import { useDocumentViewer } from './useDocumentViewer'

type IncomeSourceDocumentsProps = {
  evidenceId: UUID
  documents: SOWLatestSubmissionDocuments[] | SOTLatestSubmissionDocuments[]
  reviewState: SOWReviewState | SOTReviewState
  requestTitle?: string
  isRequest?: boolean
  onOpenRequest: VoidFunction
  onExit: VoidFunction
}

export const IncomeSourceDocuments: FC<IncomeSourceDocumentsProps> = ({
  documents = [],
  evidenceId,
  reviewState,
  requestTitle,
  isRequest,
  onOpenRequest,
  onExit,
}) => {
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const [document, setDocument] = useState<
    SOWLatestSubmissionDocuments | SOTLatestSubmissionDocuments
  >({})

  const [
    openDocumentsModal,
    { isOpen: isOpenDocumentsModal, onRequestClose: closeDocumentsModal },
  ] = useModal()
  const [openPagesModal, { isOpen: isOpenPagesModal, onRequestClose: closePagesModal }] =
    useModal()

  const { createDocuments, isLoading: isDocumentLoading } = useCreateDocuments({
    onSuccess: () => {
      closeDocumentsModal()
      onExit()
    },
  })

  const { actionToDo = {}, type, pages } = document
  const { message, id: actionToDoId } = actionToDo

  const handleSetActionDocument = (
    passedDocument: SOWLatestSubmissionDocuments | SOTLatestSubmissionDocuments,
  ) => {
    const isReask = isReasked(passedDocument?.actionToDo?.action)

    setDocument(passedDocument)

    if (isReask) {
      openDocumentsModal()
    } else {
      openPagesModal()
    }
  }

  const handleCloseModal = () => {
    setDocument({})
    closeDocumentsModal()
  }

  const handleDocumentsCreate = useCallback(
    (passedDocuments: File[]) => {
      const docType = checkRequired(type?.type, 'Document type is required')

      if (docType) {
        createDocuments({
          actionToDoId,
          documents: {
            [docType]: passedDocuments,
          },
          evidenceId,
        })
      }
    },
    [actionToDoId, createDocuments, evidenceId, type],
  )

  const {
    isDocViewerOpened,
    setIsDocViewerOpened,
    docPagesLoaderOpen,
    setDocPagesLoaderOpen,
    base64Docs,
    currentSumbission,
    openViewer,
  } = useDocumentViewer(pages ?? [])

  return (
    <>
      <Spacer h="s-16" />

      <EntityBlock title={tCommon('documents')}>
        {isRequest && (
          <DocumentGroupItem reviewState={reviewState} onClick={onOpenRequest}>
            {requestTitle}
          </DocumentGroupItem>
        )}

        {documents?.map(
          (doc: SOWLatestSubmissionDocuments | SOTLatestSubmissionDocuments) => (
            <DocumentGroupItem
              key={doc.id}
              reviewState={doc.reviewState}
              onClick={() => handleSetActionDocument(doc)}
            >
              {doc.type?.title}
            </DocumentGroupItem>
          ),
        )}
      </EntityBlock>

      <DocumentRequestModal
        isOpen={isOpenDocumentsModal}
        isSubmitting={isDocumentLoading}
        title={type?.title}
        description={type?.description}
        message={message}
        onClose={handleCloseModal}
        onSubmit={handleDocumentsCreate}
      />

      <DocumentPagesModal
        isOpen={isOpenPagesModal}
        title={type?.title}
        pages={pages}
        loaderOpened={docPagesLoaderOpen}
        onClick={(page) => {
          setDocPagesLoaderOpen(true)
          openViewer(page)
        }}
        onClose={closePagesModal}
      />

      {isDocViewerOpened && (
        <ImagePdfViewer
          images={base64Docs}
          currentImage={currentSumbission ?? base64Docs[0]}
          onClose={() => setIsDocViewerOpened(false)}
        />
      )}
    </>
  )
}
