import { FC, ReactNode } from 'react'
import { Box, Subheader, Group, BoxProps } from '@revolut/ui-kit'

export type EntityBlockProps = {
  title?: ReactNode
} & BoxProps

export const EntityBlock: FC<EntityBlockProps> = ({ children, title, ...boxProps }) => {
  return (
    <Box {...boxProps}>
      {title && (
        <Subheader>
          <Subheader.Title>{title}</Subheader.Title>
        </Subheader>
      )}
      <Group>{children}</Group>
    </Box>
  )
}
