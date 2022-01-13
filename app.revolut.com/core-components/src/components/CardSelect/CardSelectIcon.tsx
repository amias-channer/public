import { FC } from 'react'
import { UiKitIconComponentType } from '@revolut/icons'
import { Circle } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

type CardSelectIconProps = {
  Icon: UiKitIconComponentType
}

export const CardSelectIcon: FC<CardSelectIconProps> = ({ Icon }) => (
  <Circle bg="iconBg" size="components.CardSelect.icon.size">
    <Icon color="icon" size={IconSize.Medium} />
  </Circle>
)
