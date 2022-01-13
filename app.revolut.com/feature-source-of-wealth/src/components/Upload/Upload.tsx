import { FC, useRef, ChangeEvent } from 'react'

import { MimeType } from '../../utils'
import { EntityAdd } from '../Common'
import { File } from './styled'

const DEFAULT_ACCEPT_MIME_TYPES = [
  MimeType.ImagePng,
  MimeType.ApplicationPdf,
  MimeType.ImageJpeg,
]

type UploadProps = {
  onChange: (file: FileList | null) => void
  name: string
  accept?: MimeType[]
}

export const Upload: FC<UploadProps> = ({
  onChange,
  name,
  accept = DEFAULT_ACCEPT_MIME_TYPES,
  children,
}) => {
  const fileInput = useRef<HTMLInputElement>(null)

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    onChange(input.files)

    input.value = ''
  }

  const onClickUpload = () => {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }

  return (
    <EntityAdd color="primary" onClick={onClickUpload}>
      {children}
      <File
        multiple
        accept={accept.join(' ')}
        name={name}
        data-testid={name}
        type="file"
        ref={fileInput}
        onChange={handleUpload}
      />
    </EntityAdd>
  )
}
