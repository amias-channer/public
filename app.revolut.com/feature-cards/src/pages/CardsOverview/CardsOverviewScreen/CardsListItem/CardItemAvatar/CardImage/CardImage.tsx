import { useState, VFC } from 'react'
import { Image } from '@revolut/ui-kit'

import { CardBrand, CardCode } from '@revolut/rwa-core-types'

import { getCardsListItemDesignImage } from '../../../../../../helpers'

const GENERIC_CARD_IMAGE_NAME = 'generic'

type Props = {
  brand: CardBrand
  design: CardCode
}

export const CardImage: VFC<Props> = ({ brand, design }) => {
  const [imageSrc, setImageSrc] = useState(getCardsListItemDesignImage(brand, design))

  return (
    <Image
      borderRadius="2px"
      src={imageSrc}
      onError={() =>
        setImageSrc(getCardsListItemDesignImage(brand, GENERIC_CARD_IMAGE_NAME))
      }
    />
  )
}
