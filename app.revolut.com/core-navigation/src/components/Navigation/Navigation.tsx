import { FC, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import {
  SideNav,
  Box,
  BottomNav,
  Flex,
  Fixed,
  Absolute,
  useMatchBreakpoint,
} from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { useLocale } from '@revolut/rwa-core-i18n'
import { browser, Url, useEventListener } from '@revolut/rwa-core-utils'

import { LanguageSelector } from '../LanguageSelector'
import { LoggedOutSideBanner } from '../LoggedOutBanner'
import { UserMenu } from '../Sidebar/UserProfile/UserMenu'
import { UserAvatar } from '../UserAvatar'
import { useMainMenuItems } from './useMainMenuItems'

const ARIA_CURRENT_PAGE = 'page'

const isActiveRoute = (route: { pathname: Url }) =>
  browser.getPathname().includes(route.pathname)

const renderChevronIcon = (isUserMenuOpen: boolean) => {
  return isUserMenuOpen ? (
    <Box mt={3} ml={7}>
      <Icons.ShevronUpSmall />
    </Box>
  ) : (
    <Box mt={3} ml={7}>
      <Icons.ShevronDownSmall />
    </Box>
  )
}

export const Navigation: FC = () => {
  const { user } = useAuthContext()
  const isAbsoluteLanguageSelector = useMatchBreakpoint('xxl')

  const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false)
  const mainMenuItems = useMainMenuItems()

  const userName = user ? `${user.firstName} ${user.lastName}` : ''
  const { locale, setNewLocale } = useLocale()

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

  const LanguageItem = useCallback(
    () => (
      <Flex alignItems="center" justifyContent="center" flex="1 1 auto">
        <LanguageSelector locale={locale} onChange={setNewLocale} />
      </Flex>
    ),
    [locale, setNewLocale],
  )

  if (!user) {
    return (
      <>
        <SideNav hide="*-md" data-testid="sideNav" pt={0}>
          <LoggedOutSideBanner />
          <Fixed bottom="2rem" left="2rem">
            <LanguageSelector locale={locale} onChange={setNewLocale} isUDS />
          </Fixed>
        </SideNav>
        <BottomNav role="tablist" hide="md-*" data-testid="bottom-navigation">
          <BottomNav.Item use={LanguageItem} />
        </BottomNav>
      </>
    )
  }

  return (
    <>
      <SideNav hide="*-md" data-testid="sideNav">
        <SideNav.Header onClick={handleSideNavHeaderClick} data-testid="sidenav-header">
          <SideNav.Avatar>
            <UserAvatar size={32} userId={user.id} userName={userName} />
            <UserMenu isOpen={isUserMenuOpen} isUDS />
          </SideNav.Avatar>

          <SideNav.Title>
            <Flex>
              {userName}
              {user && renderChevronIcon(isUserMenuOpen)}
            </Flex>
          </SideNav.Title>
        </SideNav.Header>

        <SideNav.Items>
          {mainMenuItems.map(({ id, text, icon, route }) => (
            <SideNav.Item
              key={id}
              to={route}
              use={NavLink}
              useIcon={icon}
              aria-current={isActiveRoute(route) ? ARIA_CURRENT_PAGE : undefined}
            >
              {text}
            </SideNav.Item>
          ))}
        </SideNav.Items>

        {!isAbsoluteLanguageSelector && (
          <Fixed bottom="2rem" left="2rem">
            <LanguageSelector locale={locale} onChange={setNewLocale} isUDS />
          </Fixed>
        )}
      </SideNav>

      <BottomNav role="tablist" hide="md-*" data-testid="bottom-navigation">
        {mainMenuItems.map(({ id, icon, route }) => (
          <BottomNav.Item
            key={id}
            use={NavLink}
            to={route}
            data-testid={`mobile-menu-item-${id}`}
            hasDot={false}
            useIcon={icon}
            aria-current={isActiveRoute(route) ? ARIA_CURRENT_PAGE : undefined}
          />
        ))}
      </BottomNav>

      {isAbsoluteLanguageSelector && (
        <Absolute bottom="2rem" left="2rem">
          <LanguageSelector locale={locale} onChange={setNewLocale} isUDS />
        </Absolute>
      )}
    </>
  )
}
