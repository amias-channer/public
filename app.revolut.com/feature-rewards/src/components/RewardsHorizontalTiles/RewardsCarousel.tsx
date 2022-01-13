import { FC, Children } from 'react'
import { BoxProps } from '@revolut/ui-kit'

import { StyledCarousel } from './styles'
import { RewardTileVariant } from './types'

type Props = {
  tilesVariant?: RewardTileVariant
  wrapperCardProps?: BoxProps
}

export const RewardsCarousel: FC<Props> = ({
  tilesVariant,
  children,
  wrapperCardProps,
}) => {
  return (
    <StyledCarousel
      align={tilesVariant === RewardTileVariant.Regular ? 'center' : 'side'}
      {...wrapperCardProps}
    >
      {Children.map(children, (child) => (
        <StyledCarousel.Item>{child}</StyledCarousel.Item>
      ))}
    </StyledCarousel>
  )
}
