import React, { useCallback, useMemo, useState } from 'react'

import { UploadFailedPopup } from './UploadFailedPopup'

export type OpenUploadFailedPopupProps = {
  isMultiUpload?: boolean
  onRetry: () => void
  onDelete: () => void
}

type Values = { uploadFailedPopup: JSX.Element }
type Actions = { openUploadFailedPopup: (props: OpenUploadFailedPopupProps) => void }

export const useUploadFailedPopup = (): [Values, Actions] => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMultiUpload, setIsMultiUpload] = useState(false)
  const [onRetry, setOnRetry] = useState(() => () => {})
  const [onDelete, setOnDelete] = useState(() => () => {})

  const uploadFailedPopup = useMemo(
    () => (
      <UploadFailedPopup
        isOpen={isOpen}
        isMultiUpload={isMultiUpload}
        onExit={() => setIsOpen(false)}
        onRetry={() => {
          onRetry()
          setIsOpen(false)
        }}
        onDelete={() => {
          onDelete()
          setIsOpen(false)
        }}
      />
    ),
    [isMultiUpload, isOpen, onDelete, onRetry],
  )

  const openUploadFailedPopup = useCallback(
    (props: OpenUploadFailedPopupProps) => {
      setOnRetry(() => props.onRetry)
      setOnDelete(() => props.onDelete)
      setIsMultiUpload(Boolean(props.isMultiUpload))
      setIsOpen(true)
    },
    [setIsOpen],
  )

  return useMemo(() => [{ uploadFailedPopup }, { openUploadFailedPopup }], [
    uploadFailedPopup,
    openUploadFailedPopup,
  ])
}
