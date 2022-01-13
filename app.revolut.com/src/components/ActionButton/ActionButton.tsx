import React from 'react'
import { Button, Box, Text } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

type ButtonProps = React.ComponentProps<typeof Button>

type ActionButtonProps = {
  useIcon?: Icons.UiKitIconComponentType | false
  children: React.ReactNode
  variant: 'primary' | 'secondary'
} & ButtonProps

export const ActionButton = ({
  useIcon: Icon = false,
  children,
  ...props
}: ActionButtonProps) => (
  <Button py={2} width='100%' {...props}>
    {Icon && (
      <Box pr={1}>
        <Icon size={24} />
      </Box>
    )}
    <Text fontWeight={500} whiteSpace='nowrap'>
      {children}
    </Text>
  </Button>
)
