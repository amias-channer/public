import { FC } from 'react'
import { Text } from '@revolut/ui-kit'

type DropdownItemTextProps = {
  color: string
}

export const DropdownItemText: FC<DropdownItemTextProps> = ({ children, color }) => (
  <Text variant="secondary" fontWeight="bolder" color={color}>
    {children}
  </Text>
)
