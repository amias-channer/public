import React, { useCallback, useEffect, useState, useMemo, useContext } from 'react'
import { Text, Item, ButtonBase, Spinner, Avatar } from '@revolut/ui-kit'
import styled from 'styled-components'
import * as Icons from '@revolut/icons'

import { ImagePreviewCacheContext } from '../../../../../providers'
import { UploadState } from '../../../../../appConstants'
import { FileItem } from '../../../../../types'

export const PreviewImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
`

type Props = {
  file: FileItem
  onDelete: () => void
  onRetryUpload: () => void
}
export const MEDIA_ICON_TESTID = 'file-button-media-icon-testid'
export const IMAGE_PREVIEW_TESTID = 'file-button-image-preview-testid'
export const REMOVE_FILE_TESTID = 'file-button-remove-file-testid'

const FileCard: React.FC<Props> = ({ file, onDelete, onRetryUpload }) => {
  const { imagePreviewCache, cacheImage } = useContext(ImagePreviewCacheContext)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const onFileLoadCallback = useCallback(
    e => {
      const preview: string = e.target?.result
      setFilePreview(preview)
      cacheImage(file.name, preview)
    },
    [cacheImage, file.name],
  )

  useEffect(() => {
    const cachedImagePreview = imagePreviewCache.get(file.name)
    if (cachedImagePreview) {
      setFilePreview(cachedImagePreview)
    } else if (file?.source?.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = onFileLoadCallback
      reader.readAsDataURL(file.source)
    }
  }, [file, imagePreviewCache, onFileLoadCallback])

  const secondaryLabel = useMemo(() => {
    switch (file?.uploadState) {
      case UploadState.UploadFailed:
        // TODO: Translate.
        return 'Upload failed'

      case UploadState.Uploading:
        // TODO: Translate.
        return 'Uploading'

      default:
        return file?.source?.size ? `${Math.round(file.source.size / 1000)} KB` : ''
    }
  }, [file])

  const action = useMemo(() => {
    switch (file?.uploadState) {
      case UploadState.UploadFailed:
        return <Icons.ExclamationMarkOutline size={24} color="error" />

      case UploadState.Uploading:
        return <Spinner size={24} color="blue" />

      default:
        return (
          <ButtonBase data-testid={REMOVE_FILE_TESTID} title="Remove" onClick={onDelete}>
            <Icons.Delete size={24} color="primary" />
          </ButtonBase>
        )
    }
  }, [file, onDelete])

  return (
    <Item
      use={file?.uploadState === UploadState.UploadFailed ? 'button' : 'div'}
      onClick={file?.uploadState === UploadState.UploadFailed ? onRetryUpload : undefined}
    >
      <Item.Avatar>
        {filePreview ? (
          <Avatar data-testid={IMAGE_PREVIEW_TESTID} image={filePreview} />
        ) : (
          <Avatar data-testid={MEDIA_ICON_TESTID} useIcon={Icons.Document} />
        )}
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{file.name}</Item.Title>
        <Item.Description>
          <Text
            variant="secondary"
            color="grey-50"
            style={{ textTransform: 'capitalize' }}
          >
            {secondaryLabel}
          </Text>
        </Item.Description>
      </Item.Content>
      <Item.Side>{action}</Item.Side>
    </Item>
  )
}

export default FileCard
