import React, { FC } from 'react'
import { Popup, Header, Loader, Flex } from '@revolut/ui-kit'

import { SOWLatestSubmissionPages } from '../../types/generated/sow'
import { SOTLatestSubmissionPages } from '../../types/generated/sot'

import { DocumentGroupItem } from '../Documents/DocumentGroupItem'
import { EntityBlock } from '../Common/EntityBlock'
import { LATEST_SUBMISSION_DOCUMENT_LOADER_ID } from '../../utils'

export type DocumentPagesModalProps = {
  title?: string
  isOpen?: boolean
  pages?: SOWLatestSubmissionPages[] | SOTLatestSubmissionPages[]
  loaderOpened?: boolean
  onClose: VoidFunction
  onClick?: (page: SOWLatestSubmissionPages | SOTLatestSubmissionPages) => void
}

export const DocumentPagesModal: FC<DocumentPagesModalProps> = ({
  title,
  isOpen = false,
  loaderOpened = false,
  pages,
  onClose,
  onClick,
}) => {
  return (
    <Popup isOpen={isOpen} onExit={onClose} variant="modal-view">
      <Header variant="form">
        <Header.CloseButton aria-label="Close" />
        <Header.Title>{title}</Header.Title>
      </Header>

      <EntityBlock>
        {loaderOpened ? (
          <Flex
            p="s-16"
            justifyContent="center"
            data-testid={LATEST_SUBMISSION_DOCUMENT_LOADER_ID}
          >
            <Loader />
          </Flex>
        ) : (
          <>
            {pages?.map((page: SOWLatestSubmissionPages | SOTLatestSubmissionPages) => (
              <DocumentGroupItem
                key={page.id}
                reviewState={page.reviewState}
                onClick={() => onClick?.(page)}
              >
                {page.fileName}
              </DocumentGroupItem>
            ))}
          </>
        )}
      </EntityBlock>
    </Popup>
  )
}
