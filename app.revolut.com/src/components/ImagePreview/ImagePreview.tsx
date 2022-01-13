import * as React from 'react'
import { OutlineCircleButton, TextButton } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { ImageBase, PreviewButtonWrapper } from './styles'

type Props = {
  src: string
  onClose: () => void
}

export const ImagePreview = ({ src, onClose }: Props) => {
  const [zoom, setZoom] = React.useState(false)

  return (
    <>
      <PreviewButtonWrapper p={['1rem', '1rem', '2rem']} key='closeButton'>
        <OutlineCircleButton hide='*-md' onClick={onClose}>
          <Icons.NavigationClose size={24} />
        </OutlineCircleButton>
        <TextButton variant='default' hide='md-*' onClick={onClose}>
          <Icons.NavigationClose size={24} color='grey-50' />
        </TextButton>
      </PreviewButtonWrapper>
      <ImageBase
        key='image'
        src={src}
        zoom={zoom}
        onClick={() => setZoom(!zoom)}
      />
    </>
  )
}
