import React, { FC } from 'react'
import { Button, StatusPopup } from '@revolut/ui-kit'

type Props = {
  isOpen: boolean
  isMultiUpload: boolean
  onExit: () => void
  onRetry: () => void
  onDelete: () => void
}

export const UploadFailedPopup: FC<Props> = ({
  isOpen,
  isMultiUpload,
  onExit,
  onRetry,
  onDelete,
}) => (
  <StatusPopup variant="error" onExit={onExit} isOpen={isOpen}>
    <StatusPopup.Title>
      {/* TODO: Translate */}
      Upload failed
    </StatusPopup.Title>
    <StatusPopup.Description>
      {/* TODO: Translate */}
      Do you want to try again?
      <StatusPopup.Actions>
        <Button elevated onClick={onRetry}>
          {/* TODO: Translate */}
          {isMultiUpload ? 'Attempt re-upload all failed uploads' : 'Attempt re-upload'}
        </Button>
        <Button variant="secondary" onClick={onDelete}>
          {/* TODO: Translate */}
          {isMultiUpload ? 'Delete all failed uploads' : 'Delete this upload'}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup.Description>
  </StatusPopup>
)
