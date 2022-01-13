import { FC, useState, useEffect, ComponentType } from 'react'
import { Avatar, AvatarProps } from '@revolut/ui-kit'
import { IconProps } from '@revolut/icons'

type Props = {
  imageSrc: string
  icon: ComponentType<IconProps>
  avatarProps?: AvatarProps
}

export const ImageOrIconAvatar: FC<Props> = ({
  icon,
  imageSrc,
  avatarProps,
  children,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const onLoadSuccess = () => {
    setIsImageLoaded(true)
  }

  const onError = () => {
    setIsImageLoaded(false)
  }

  useEffect(() => {
    const img = new Image()
    img.src = imageSrc
    img.onload = onLoadSuccess
    img.onerror = onError

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageSrc])

  return (
    <Avatar
      image={isImageLoaded ? imageSrc : undefined}
      useIcon={isImageLoaded ? undefined : icon}
      {...avatarProps}
    >
      {children}
    </Avatar>
  )
}
