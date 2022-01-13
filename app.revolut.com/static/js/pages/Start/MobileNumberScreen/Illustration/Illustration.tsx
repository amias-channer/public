import { FC } from 'react'

import { IllustrationAsset, IllustrationAssetId } from '@revolut/rwa-core-components'

import { IllustrationDescription } from './Description'
import { ContainerStyled } from './styled'

export const Illustration: FC = () => (
  <ContainerStyled asset={IllustrationAsset[IllustrationAssetId.GetStarted_V2]}>
    <IllustrationDescription />
  </ContainerStyled>
)
