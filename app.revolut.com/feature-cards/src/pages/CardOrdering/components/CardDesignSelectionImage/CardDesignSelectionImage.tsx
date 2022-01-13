import { FC } from 'react'

import { ImageLoader } from '@revolut/rwa-core-components'

import {
  CardDesignSelectionImageContainer,
  CardDesignSelectionImageStyled,
} from './styled'

type CardDesignSelectionImageProps = {
  imgSrc: string
}

export const CardDesignSelectionImage: FC<CardDesignSelectionImageProps> = ({
  imgSrc,
}) => (
  <CardDesignSelectionImageContainer>
    <ImageLoader src={imgSrc}>
      <CardDesignSelectionImageStyled src={imgSrc} />
    </ImageLoader>
  </CardDesignSelectionImageContainer>
)
