import { FC } from 'react'
import { Button, ButtonProps } from '@revolut/ui-kit'

type SuggestionButtonProps = ButtonProps & {
  isActive: boolean
}

export const SuggestionButton: FC<SuggestionButtonProps> = ({
  isActive,
  children,
  ...buttonProps
}) => (
  <Button size="sm" variant={isActive ? 'primary' : 'secondary'} {...buttonProps}>
    {children}
  </Button>
)
