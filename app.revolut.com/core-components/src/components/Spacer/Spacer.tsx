import * as CSS from 'csstype'
import { FC } from 'react'
import { ResponsiveValue } from 'styled-system'
import { Box, BoxProps } from '@revolut/ui-kit'

type SpacerProps = {
  h: string | ResponsiveValue<CSS.Property.PaddingTop<string>>
} & BoxProps

export const Spacer: FC<SpacerProps> = ({ h, ...rest }) => <Box pt={h} {...rest} />
