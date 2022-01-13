import { FC, ReactNode } from 'react'
import { Flex, Box } from '@revolut/ui-kit'

import { HeaderWrapper } from './HeaderWrapper'
import { Scrollable } from './styled'

type HeaderProps = {
  actions?: ReactNode
  picture?: ReactNode
  info?: ReactNode
  left?: ReactNode
  right?: ReactNode
  mainProps?: React.ComponentPropsWithoutRef<typeof Flex>
} & React.ComponentPropsWithoutRef<typeof Flex>

export const Header: FC<HeaderProps> = ({
  actions,
  picture,
  info,
  left,
  right,
  mainProps = {},
  ...rest
}) => (
  <HeaderWrapper
    left={left}
    right={right}
    width="100%"
    pt={{ all: 0, md: 0 }}
    pb={actions ? 2 : 0}
    {...rest}
  >
    <Flex flexDirection="column">
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="start"
        {...mainProps}
      >
        {info && <Box width="100%">{info}</Box>}
        {picture && <Box>{picture}</Box>}
      </Flex>
      {actions && <Scrollable pt={{ all: 2, md: 3 }}>{actions}</Scrollable>}
    </Flex>
  </HeaderWrapper>
)
