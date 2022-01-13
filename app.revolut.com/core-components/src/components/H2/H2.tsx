import { FC } from 'react'

import { StyledH2 } from './styled'

export const H2: FC = ({ children, ...restProps }) => (
  <StyledH2
    fontWeight="bold"
    fontSize={{ _: 'headerMobile', tablet: 'header' }}
    lineHeight={{ _: 'headerMobile', tablet: 'header' }}
    {...restProps}
  >
    {children}
  </StyledH2>
)
