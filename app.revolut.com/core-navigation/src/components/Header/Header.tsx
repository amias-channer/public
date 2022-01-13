import React, { FC, ReactNode, useCallback, useState } from 'react'
import { Header as UIKitHeader, Box } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { useEventListener } from '@revolut/rwa-core-utils'

import { UserMenu } from '../Sidebar/UserProfile/UserMenu'
import { UserAvatar } from '../UserAvatar'

type Props = {
  title?: ReactNode
  onBack?: VoidFunction
}

export const Header: FC<Props> = ({ title, onBack, children, ...props }) => {
  const { user } = useAuthContext()
  const userName = user ? `${user.firstName} ${user.lastName}` : ''

  const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false)

  const onOutsideClick = useCallback((e: MouseEvent) => {
    if (e.target instanceof Node) {
      setUserMenuOpen(false)
    }
  }, [])

  useEventListener('click', onOutsideClick)

  const handleSideNavHeaderClick = (e: React.MouseEvent<unknown>) => {
    e.stopPropagation()
    setUserMenuOpen(!isUserMenuOpen)
  }

  return (
    <UIKitHeader variant={onBack ? 'form' : 'main'} {...props}>
      {onBack && <UIKitHeader.BackButton aria-label="Back" onClick={onBack} />}

      {title && <UIKitHeader.Title hide="*-md">{title}</UIKitHeader.Title>}

      <Box display="inline-block" hide="md-*">
        <UserAvatar
          size={32}
          userId={user ? user.id : ''}
          userName={userName}
          onClick={handleSideNavHeaderClick}
        />

        <UserMenu isOpen={isUserMenuOpen} isUDS />
      </Box>

      <UIKitHeader.Actions>{children}</UIKitHeader.Actions>
    </UIKitHeader>
  )
}
