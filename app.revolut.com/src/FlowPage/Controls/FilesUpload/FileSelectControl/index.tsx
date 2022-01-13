import React, { ChangeEvent, ChangeEventHandler, FC, useCallback, useRef } from 'react'
import ActionCard from '../../common/Cards/ActionCard'

export const FILE_SELECT_CONTROL = 'file-select-control'

type Props = {
  disabled: boolean
  buttonTitle?: string
  onChange: (fileList: FileList) => void
}

const FileSelectControl: FC<Props> = ({ disabled, onChange, buttonTitle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadFileClick = useCallback(() => {
    if (fileInputRef.current instanceof HTMLInputElement) {
      fileInputRef.current.click()
    }
  }, [])

  const handleUpload = useCallback<ChangeEventHandler>(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target

      if (files) {
        onChange(files)
      }
    },
    [onChange],
  )

  // When a new file is the same onChange won't call.
  // The solution below will reset the selected file after every new file/s choosing.
  const resetFileValue = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.value = ''
  }

  return (
    <>
      <input
        multiple
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        disabled={disabled}
        onChange={handleUpload}
        onClick={resetFileValue}
        data-testid={FILE_SELECT_CONTROL}
      />
      <ActionCard
        text={buttonTitle || 'Upload file'}
        icon="Plus"
        onClick={handleUploadFileClick}
      />
    </>
  )
}

export default FileSelectControl
