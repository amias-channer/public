import { FC } from 'react'
import { UiKitIconComponentType } from '@revolut/icons'
import { Box, Text, ButtonProps } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

import { ButtonStyled } from './styled'

export enum ActionButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

type ActionButtonProps = {
  useIcon?: UiKitIconComponentType | false
  variant?: ActionButtonVariant
  buttonProps?: ButtonProps
  textColor?: string
}

export const ActionButton: FC<ActionButtonProps> = ({
  useIcon: Icon,
  children,
  variant = ActionButtonVariant.Secondary,
  buttonProps,
  textColor,
}) => (
  <ButtonStyled variant={variant} {...buttonProps}>
    {Icon && (
      <Box pr={1} color={textColor}>
        <Icon size={IconSize.Small} />
      </Box>
    )}
    <Text fontWeight="bolder" variant="secondary" whiteSpace="nowrap" color={textColor}>
      {children}
    </Text>
  </ButtonStyled>
)
