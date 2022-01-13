import React, { useEffect, useState } from "react"
import { useMedia } from "react-use"
import styled from "styled-components"
import { IS_PRODUCTION } from "../../constants"
import UnstyledButton from "../../design-system/UnstyledButton"
import { useCallbackRef } from "../../hooks/useCallbackRef"
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll"
import { useTranslations } from "../../hooks/useTranslations"
import Tr from "../../i18n/Tr.react"
import Router from "../../lib/helpers/router"
import { $nav_height } from "../../styles/variables"
import Icon from "../common/Icon.react"
import { BREAKPOINTS_PX, maxWidthBreakpoint } from "../common/MediaQuery.react"
import NavItem from "./NavItem.react"
import navMenus from "./navMenus"
import UserMenu from "./UserMenu"

interface Props {
  onClose: () => unknown
  openWallet: () => unknown
}

type View = "main" | "accountSettings" | keyof typeof navMenus

export const NavMobile = ({ onClose, openWallet }: Props) => {
  const [view, setView] = useState<View>("main")
  const { tr } = useTranslations()
  const [containerRef, setRef] = useCallbackRef<HTMLDivElement>()

  const isVisible = useMedia(
    maxWidthBreakpoint(BREAKPOINTS_PX.mobileNavbar),
    false,
  )
  useLockBodyScroll(isVisible, containerRef)

  useEffect(() => {
    const unsub = Router.onChange(onClose)
    return () => {
      unsub()
    }
  }, [onClose])

  const ViewNav = ({
    children,
    href,
    view,
    onClick,
  }: {
    children: React.ReactNode
    href?: string
    view?: View
    onClick?: () => unknown
  }) => (
    <NavItem href={href} onClick={onClick || (view && (() => setView(view)))}>
      {children}
      {view ? (
        <Icon className="NavMobile--submenu-icon" value="chevron_right" />
      ) : null}
    </NavItem>
  )

  return (
    <DivContainer ref={setRef}>
      {view === "main" ? (
        <ul className="NavMobile--menu">
          <ViewNav view="marketplace">{tr("Marketplace")}</ViewNav>
          <ViewNav view="stats">{tr("Stats")}</ViewNav>
          <ViewNav view="resources">{tr("Resources")}</ViewNav>
          <ViewNav view="account">{tr("Account")}</ViewNav>
          <ViewNav onClick={openWallet}>{tr("My Wallet")}</ViewNav>
          {IS_PRODUCTION ? null : (
            <ViewNav view="language">
              <Icon value="language" />
            </ViewNav>
          )}
        </ul>
      ) : (
        <>
          <UnstyledButton
            className="NavMobile--menu-header"
            onClick={() =>
              setView(view === "accountSettings" ? "account" : "main")
            }
          >
            <Icon value="chevron_left" />
            {view
              ? tr(
                  view === "marketplace"
                    ? "Marketplace"
                    : view === "resources"
                    ? "Resources"
                    : view === "stats"
                    ? "Stats"
                    : view === "account"
                    ? "Account"
                    : view === "accountSettings"
                    ? "My Account Settings"
                    : view === "language"
                    ? "Language"
                    : "",
                )
              : null}
          </UnstyledButton>
          <ul className="NavMobile--menu">
            {view === "accountSettings" ? <UserMenu /> : navMenus[view]}
            {view === "account" ? (
              <>
                <ViewNav view="accountSettings">
                  {tr("My Account Settings")}
                </ViewNav>
                <NavItem
                  isHidden={({ wallet }) => !wallet.activeAccount}
                  key="logout"
                  onClick={async ({
                    context: { logout },
                    showSuccessMessage,
                  }) => {
                    await logout()
                    showSuccessMessage("You have been logged out successfully.")
                  }}
                >
                  <Tr>Log Out</Tr>
                </NavItem>
              </>
            ) : null}
          </ul>
        </>
      )}
    </DivContainer>
  )
}

export default NavMobile

const DivContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  font-size: 16px;
  height: calc(100vh - ${$nav_height});
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  width: 100vw;

  .NavMobile--menu {
    background: ${props => props.theme.colors.surface};
    height: 100%;
    margin: 0;

    .NavMobile--submenu-icon {
      margin-left: auto;
    }
  }

  .NavMobile--menu-header {
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.withOpacity.text.on.background.heavy};
    display: flex;
    font-weight: 600;
    height: 70px;
    padding: 0 8px;
  }
`
