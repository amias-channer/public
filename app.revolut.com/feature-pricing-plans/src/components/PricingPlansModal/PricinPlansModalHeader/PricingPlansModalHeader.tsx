import { FC } from 'react'
import { Box, NavBar } from '@revolut/ui-kit'

import { PricingPlansModalHeaderBase } from './styled'

type PricingPlansModalHeaderProps = {
  onCloseClick: VoidFunction
}

export const PricingPlansModalHeader: FC<PricingPlansModalHeaderProps> = ({
  children,
  onCloseClick,
}) => (
  <PricingPlansModalHeaderBase
    mt={{ _: '-1rem', md: '-1.5rem' }}
    mx="-1.5rem"
    px="1.5rem"
  >
    <Box py="0.375rem">
      <NavBar>
        <NavBar.CloseButton aria-label="Close" onClick={onCloseClick} />
        <NavBar.Title>{children}</NavBar.Title>
      </NavBar>
    </Box>
  </PricingPlansModalHeaderBase>
)
