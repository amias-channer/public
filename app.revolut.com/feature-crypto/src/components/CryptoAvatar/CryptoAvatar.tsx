import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { AvatarProps } from '@revolut/ui-kit'

import { getAsset, AssetProject } from '@revolut/rwa-core-utils'

import { ImageOrIconAvatar } from './ImageOrIconAvatar'

type Props = {
  avatarProps?: AvatarProps
  cryptoCode: string
}

export const CryptoAvatar: FC<Props> = ({ avatarProps, cryptoCode, children }) => {
  return (
    <ImageOrIconAvatar
      imageSrc={getAsset(`cryptos/${cryptoCode}.svg`, AssetProject.Assets)}
      icon={Icons.Coins}
      avatarProps={avatarProps}
    >
      {children}
    </ImageOrIconAvatar>
  )
}
