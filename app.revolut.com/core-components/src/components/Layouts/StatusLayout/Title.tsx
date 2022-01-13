import { FC } from 'react'
import { Box } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

import { H2 } from '../../H2'
import { StatusIcon, StatusIconType } from '../../Icons'
import { Spacer } from '../../Spacer'

type StatusLayoutTitleProps = {
  iconType: StatusIconType
  iconColor?: string
  title: string
}

export const StatusLayoutTitle: FC<StatusLayoutTitleProps> = ({
  iconType,
  iconColor,
  title,
}) => (
  <Box>
    <Spacer h="px88" />
    <StatusIcon type={iconType} color={iconColor} size={IconSize.ExtraLarge} />
    <Spacer h="px32" />
    <H2>{title}</H2>
  </Box>
)
