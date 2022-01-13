import { FC } from 'react'

import { StyledBox } from './styled'

export const TextBox: FC = ({ children }) => (
  <StyledBox fontSize="default" color="default">
    {children}
  </StyledBox>
)
