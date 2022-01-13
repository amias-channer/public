import React, { useState } from 'react'
import { Box, Modal } from '@revolut/ui-kit'

import { MessageWrapper, ImageBase, FileLoad, TextMessage } from '../styles'
import { ImagePreview } from '../../ImagePreview'

type Props = {
  className: string
  fileName?: string
  src?: string
  isRetry?: boolean
  onPreview?: () => void
}

export const ImageMessage = ({
  className,
  fileName,
  src,
  isRetry = false,
  onPreview = () => {},
}: Props) => {
  const [isOpen, setPreviewState] = useState(false)
  const [isLoaded, setLoadState] = React.useState(false)

  return (
    <MessageWrapper
      bg='white'
      p={0}
      withImage
      isRetry={isRetry}
      className={className}
    >
      {!isLoaded && (
        <FileLoad>
          <Box>
            <TextMessage>{fileName}</TextMessage>
          </Box>
        </FileLoad>
      )}
      <ImageBase
        src={src}
        onClick={() => {
          onPreview()
          setPreviewState(true)
        }}
        onLoad={() => setLoadState(true)}
        hide={!isLoaded}
      />
      <Modal
        zIndex={10000}
        isOpen={isOpen}
        onRequestClose={() => setPreviewState(false)}
      >
        {src && (
          <ImagePreview src={src} onClose={() => setPreviewState(false)} />
        )}
      </Modal>
    </MessageWrapper>
  )
}
