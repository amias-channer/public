import { FC } from 'react'
import { ButtonProps, Spinner } from '@revolut/ui-kit'

import { StyledButton } from './styled'

export type PrimaryButtonProps = {
  isLoading?: boolean
  hasElevation?: boolean
} & ButtonProps

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  isLoading,
  hasElevation = true,
  ...rest
}) => (
  <StyledButton variant="primary" bg="primary" elevation={hasElevation} {...rest}>
    {isLoading ? <Spinner /> : children}
  </StyledButton>
)
