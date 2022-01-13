import { FC } from 'react'
import { IconComponentType } from '@revolut/icons'
import { DropdownItemProps as UiKitDropdownItemProps } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

import { DropdownItemText } from './DropdownItemText'
import { DropdownIconContainer, DropdownItemContainer } from './styled'

type DropdownItemProps = {
  color?: string
  iconColor?: string
  Icon?: IconComponentType
  isUDS?: boolean
} & UiKitDropdownItemProps

export const DropdownItem: FC<DropdownItemProps> = ({
  children,
  color = 'dropdownOptionText',
  iconColor,
  Icon,
  ...rest
}) => (
  <DropdownItemContainer {...rest}>
    {Icon && (
      <DropdownIconContainer>
        <Icon size={IconSize.Medium} color={iconColor || color} />
      </DropdownIconContainer>
    )}
    <DropdownItemText color={color}>{children}</DropdownItemText>
  </DropdownItemContainer>
)
