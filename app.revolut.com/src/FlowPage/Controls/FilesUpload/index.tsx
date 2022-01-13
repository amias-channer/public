import React, { FC, useMemo } from 'react'
import { Group } from '@revolut/ui-kit'

import { CameraImageSource, FlowViewItemType } from '../../../appConstants'
import { FileItem, FilesValue } from '../../../types'
import { CameraControl, FileList } from '../common'
import FileSelectControl from './FileSelectControl'
import { useFileUpload } from './useFileUpload'
import { useUploadFailedPopup } from './UploadFailedPopup'

type Props = {
  value?: FilesValue
  disabled: boolean
  defaultSource?: CameraImageSource
  type: FlowViewItemType
  buttonTitle: string
  captureHint: string
  takePhotoHint: string
  retakePhotoHint: string
  confirmPhotoHint: string
  switchCameraHint: string
  changeValue: (payload: FilesValue) => void
  setDataFetching: (fetching: boolean) => void
}

const FilesUpload: FC<Props> = ({
  changeValue,
  defaultSource = CameraImageSource.Front,
  disabled,
  type,
  value,
  buttonTitle,
  captureHint,
  takePhotoHint,
  retakePhotoHint,
  confirmPhotoHint,
  switchCameraHint,
  setDataFetching,
}) => {
  const [{ uploadFailedPopup }, { openUploadFailedPopup }] = useUploadFailedPopup()
  const isFileUpload = type === FlowViewItemType.FilesUpload

  const [
    { files },
    { uploadFiles, addSnapshot, deleteFile, suggestRetryUploadFile },
  ] = useFileUpload(value?.files, changeValue, setDataFetching, openUploadFailedPopup)

  const filenames = useMemo(() => files.map((file: FileItem) => file.name), [files])

  return (
    <Group>
      {isFileUpload && (
        <FileSelectControl
          onChange={uploadFiles}
          disabled={disabled}
          buttonTitle={buttonTitle}
        />
      )}
      <CameraControl
        addSnapshot={addSnapshot}
        defaultSource={defaultSource}
        filenames={filenames}
        buttonTitle={captureHint}
        takePhotoHint={takePhotoHint}
        confirmPhotoHint={confirmPhotoHint}
        retakePhotoHint={retakePhotoHint}
        switchCameraHint={switchCameraHint}
      />
      <FileList
        files={files}
        deleteFile={deleteFile}
        retryUploadFile={suggestRetryUploadFile}
      />
      {uploadFailedPopup}
    </Group>
  )
}

export default FilesUpload
