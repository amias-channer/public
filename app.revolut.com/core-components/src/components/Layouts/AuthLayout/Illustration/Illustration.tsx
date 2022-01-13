import { FC } from 'react'
import { Flex } from '@revolut/ui-kit'

import {
  THEME_ILLUSTRATION_SIZE_KEY,
  IllustrationAsset,
  IllustrationAssetId,
} from './constants'
import { AssetImage } from './styled'

type IllustrationProps = {
  assetId: IllustrationAssetId
}

export const Illustration: FC<IllustrationProps> = ({ assetId }) => {
  return (
    <Flex
      bg="illustrationBg"
      width={THEME_ILLUSTRATION_SIZE_KEY}
      alignItems="center"
      justifyContent="center"
    >
      <AssetImage src={IllustrationAsset[assetId]} alt="" />
    </Flex>
  )
}
