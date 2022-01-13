import React, { FC } from 'react'
import { FileItem } from '../../../../types'
import FileCard from '../Cards/FileCard'

type Props = {
  files: FileItem[]
  deleteFile: (index: number) => void
  retryUploadFile: (index: number) => void
}

const FileList: FC<Props> = ({ files, deleteFile, retryUploadFile }) => (
  <>
    {files.map((file, index) => (
      <FileCard
        key={file.id}
        file={file}
        onDelete={() => deleteFile(index)}
        onRetryUpload={() => retryUploadFile(index)}
      />
    ))}
  </>
)

export default FileList
