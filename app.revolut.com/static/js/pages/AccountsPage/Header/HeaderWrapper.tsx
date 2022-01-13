import { FC, ReactNode } from 'react'
import { Flex, Box } from '@revolut/ui-kit'

type HeaderWrapperProps = React.ComponentPropsWithoutRef<typeof Flex> & {
  left?: ReactNode
  right?: ReactNode
}

export const HeaderWrapper: FC<HeaderWrapperProps> = ({
  children,
  left,
  right,
  ...props
}) => (
  <Flex {...props}>
    <Box flex="1">{left}</Box>
    <Flex width="100%" maxWidth="60rem" flexDirection="column">
      {children}
    </Flex>
    <Box flex="1">{right}</Box>
  </Flex>
)
