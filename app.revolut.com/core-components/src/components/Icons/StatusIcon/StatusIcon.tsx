import { FC } from 'react'

import { IconSize } from '@revolut/rwa-core-utils'

import { ICONS, ICON_TYPE_COLORS, DEFAULT_COLOR, StatusIconType } from './constants'

type StatusIconProps = {
  type: StatusIconType
  size: IconSize
  color?: string
}

export const StatusIcon: FC<StatusIconProps> = ({ type, size, color }) => {
  const iconColor = color ?? ICON_TYPE_COLORS[type] ?? DEFAULT_COLOR
  const IconComponent = ICONS[type]

  return <IconComponent size={size} color={iconColor} />
}
