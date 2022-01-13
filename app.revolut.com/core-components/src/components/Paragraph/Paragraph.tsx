import { FC } from 'react'
import { Box } from '@revolut/ui-kit'

export const Paragraph: FC = ({ children }) => (
  <Box mt={{ _: 'px8', tablet: 'px16' }}>{children}</Box>
)
