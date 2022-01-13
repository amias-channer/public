import { FC, ReactNode } from 'react'

import { IconComponentType } from '@revolut/icons'
import { PhotoHeader as UiKitPhotoHeader, Color } from '@revolut/ui-kit'

type HeaderProps = {
  onBack?: VoidFunction
  image?: string
  status?: ReactNode
  useStatusIcon?: IconComponentType
  bg?: Color
}

export const PhotoHeader: FC<HeaderProps> = ({
  onBack,
  useStatusIcon,
  image,
  status,
  children,
  bg = Color.BLUE,
}) => {
  return (
    <UiKitPhotoHeader image={image} bg={bg}>
      {onBack && <UiKitPhotoHeader.BackButton aria-label="Back" onClick={onBack} />}
      {status && (
        <UiKitPhotoHeader.Status useIcon={useStatusIcon}>
          {status}
        </UiKitPhotoHeader.Status>
      )}
      <UiKitPhotoHeader.Title>{children}</UiKitPhotoHeader.Title>
    </UiKitPhotoHeader>
  )
}
