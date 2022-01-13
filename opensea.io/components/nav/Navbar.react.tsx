import React, { createRef } from "react"
import styled, { css } from "styled-components"
import {
  IS_PRODUCTION,
  OPENSEA_LOGO_IMG,
  SUPPORTED_LANGUAGES,
} from "../../constants"
import { Z_INDEX } from "../../constants/zIndex"
import Block from "../../design-system/Block"
import Dropdown from "../../design-system/Dropdown"
import Flex from "../../design-system/Flex"
import Tooltip from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import LanguagePicker from "../../i18n/LanguagePicker.react"
import {
  trackCloseSidebarWallet,
  trackOpenSidebarWallet,
} from "../../lib/analytics/events/walletEvents"
import { NavbarQuery } from "../../lib/graphql/__generated__/NavbarQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import {
  LinkArray,
  marketPlaceLinks,
  myAccountLinks,
  resourcesLinks,
  statLinks,
} from "../../lib/helpers/links"
import Router from "../../lib/helpers/router"
import { selectClassNames } from "../../lib/helpers/styling"
import { NAVBAR_OVERLAYS } from "../../reducers/categories"
import { themeVariant } from "../../styles/styleUtils"
import { HUES } from "../../styles/themes"
import { $nav_height } from "../../styles/variables"
import Icon, { MaterialIcon } from "../common/Icon.react"
import Image from "../common/Image.react"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"
import NavSearch from "../common/NavSearch.react"
import { BANNER_HEIGHT } from "../layout/home-page/AnnouncementBanner.react"
import OpenSeaLetters from "../svgs/OpenSeaLetters.react"
import NavItem from "./NavItem.react"
import { SocialsItem } from "./navMenus"
import NavMobile from "./NavMobile"
import TestnetNotice from "./TestnetNotice"
import WalletSidebar from "./WalletSidebar"

interface Props {
  activeCollectionSlug?: string
  searchQuery?: string
  setSearchQuery?: (query?: string) => unknown
  setCollectionSlug?: (slug?: string) => unknown
  showRinkebyTooltip: boolean
  isBannerShown?: boolean
}

interface State {
  isMobileMenuVisible?: boolean
  isWalletSidebarOpen: boolean
}

class Navbar extends GraphQLComponent<NavbarQuery, Props, State> {
  walletNavItemRef = createRef<HTMLLIElement>()

  state: State = {
    isWalletSidebarOpen: false,
  }

  openWalletSidebar = () => {
    this.setState({ isWalletSidebarOpen: true })
    trackOpenSidebarWallet()
  }

  closeWalletSidebar = () => {
    this.setState({ isWalletSidebarOpen: false })
    trackCloseSidebarWallet()
  }

  onWalletSidebarClickAway = (e: MouseEvent | TouchEvent) => {
    const node = e.target as HTMLElement
    if (this.walletNavItemRef.current?.contains(node)) {
      return
    }

    //  We should not close wallet sidebar on click away if there is a modal open. There might be a cleaner way to do this.
    if (
      node.closest('div[role="dialog"]') ||
      node.querySelector('div[role="dialog"]')
    ) {
      return
    }
    this.closeWalletSidebar()
  }

  toggleWalletSidebar = () => {
    this.setState(prev => {
      const isWalletSidebarOpen = !prev.isWalletSidebarOpen
      if (isWalletSidebarOpen) {
        trackOpenSidebarWallet()
      } else {
        trackCloseSidebarWallet()
      }

      return { isWalletSidebarOpen }
    })
  }

  closeNavMobile = () => {
    this.setState({
      isMobileMenuVisible: false,
      isWalletSidebarOpen: false,
    })
  }

  renderNavbarDropdown = ({
    items,
    title,
    icon,
    href,
    extra,
  }: {
    items: LinkArray
    title?: React.ReactNode
    icon?: MaterialIcon
    href: string
    extra?: {
      content?: React.ReactNode
      onClick?: () => unknown
      label?: string
    }
  }) => {
    const { theme } = this.context
    return (
      <Dropdown
        className="Navbar--dropdown"
        content={({ close, List, Item }) => (
          <List>
            {items.map(item => (
              <Item href={item.url} key={item.url} onClick={close}>
                {item.image ? (
                  <Image
                    className="Navbar--dropdown-image"
                    size={24}
                    url={`${item.image}-${theme}.svg`}
                  />
                ) : null}
                <Item.Content>
                  <Item.Title fontSize="16px">{item.label}</Item.Title>
                </Item.Content>
              </Item>
            ))}
            {extra ? (
              <Item onClick={extra.onClick}>
                {extra.content ? (
                  extra.content
                ) : (
                  <Item.Content>
                    <Item.Title fontSize="16px">{extra.label}</Item.Title>
                  </Item.Content>
                )}
              </Item>
            ) : null}
          </List>
        )}
        trigger="mouseenter focus"
      >
        <NavItem href={href} icon={icon} iconVariant="outlined" isRoot>
          {title}
        </NavItem>
      </Dropdown>
    )
  }

  renderNavbar() {
    const { data } = this.props
    const { isWalletSidebarOpen } = this.state
    const { wallet, logout } = this.context
    const accountImageUrl = data?.account?.imageUrl
    const NavbarDropdown = this.renderNavbarDropdown

    return (
      <ul className="Navbar--items">
        <NavbarDropdown
          href="/assets"
          items={marketPlaceLinks}
          title="Marketplace"
        />
        <NavbarDropdown href="/rankings" items={statLinks} title="Stats" />
        <NavbarDropdown
          extra={{ content: <SocialsItem /> }}
          href=""
          items={resourcesLinks}
          title="Resources"
        />
        <Block marginLeft="24px">
          <NavbarDropdown
            extra={
              wallet.activeAccount
                ? {
                    label: "Log Out",
                    onClick: async () => {
                      await logout()
                      this.showSuccessMessage(
                        "You have been logged out successfully.",
                      )
                    },
                  }
                : undefined
            }
            href="/account"
            icon={!accountImageUrl ? "account_circle" : undefined}
            items={myAccountLinks}
            title={
              accountImageUrl ? (
                <Image
                  alt="Account"
                  className="Navbar--account-image"
                  size={32}
                  sizing="cover"
                  url={accountImageUrl}
                />
              ) : undefined
            }
          />
        </Block>
        <NavItem
          icon="account_balance_wallet"
          iconTitle="Wallet"
          iconVariant="outlined"
          isActive={isWalletSidebarOpen}
          isRoot
          ref={this.walletNavItemRef}
          onClick={this.toggleWalletSidebar}
        />

        {IS_PRODUCTION ? null : (
          <Dropdown
            className="Navbar--dropdown"
            content={({ close, List, Item }) => (
              <List>
                {SUPPORTED_LANGUAGES.map(language => (
                  <LanguagePicker
                    as={Item}
                    key={language}
                    language={language}
                    onClose={close}
                  />
                ))}
              </List>
            )}
          >
            <NavItem icon="language" isRoot />
          </Dropdown>
        )}
      </ul>
    )
  }

  render() {
    const {
      activeCollectionSlug,
      searchQuery,
      setSearchQuery,
      setCollectionSlug,
      showRinkebyTooltip,
      isBannerShown,
    } = this.props
    const { isMobileMenuVisible, isWalletSidebarOpen } = this.state
    const { showBanner, theme } = this.context
    const { collectionSlug } = Router.getPathParams() || {}
    const navbarOverlayImageUrl =
      collectionSlug && NAVBAR_OVERLAYS[collectionSlug]

    return (
      <>
        <DivContainer className={selectClassNames("Navbar", { isBannerShown })}>
          <nav className="Navbar--main">
            <div className="Navbar--left">
              <Link className="Navbar--brand" href="/">
                <Image alt="Logo" size={40} url={OPENSEA_LOGO_IMG} />
                <OpenSeaLetters
                  className="Navbar--brand-name"
                  fill={theme === "light" ? HUES.charcoal : HUES.white}
                  width={100}
                />
                {showRinkebyTooltip ? (
                  <Tooltip
                    content={
                      <>
                        You are on the OpenSea test network
                        (testnets.opensea.io). Go to{" "}
                        <a href="https://opensea.io">OpenSea.io</a> to hop off
                        the test network.
                      </>
                    }
                    placement="right"
                  >
                    <span className="Navbar--brand-testnets"> Testnets</span>
                  </Tooltip>
                ) : null}
              </Link>
              <UnstyledButton
                className="Navbar--mobile-toggle"
                onClick={() =>
                  this.setState(prev => {
                    const isMobileMenuVisible = !prev.isMobileMenuVisible
                    return {
                      isMobileMenuVisible,
                      isWalletSidebarOpen: !isMobileMenuVisible
                        ? false
                        : prev.isWalletSidebarOpen,
                    }
                  })
                }
              >
                <Icon
                  title={isMobileMenuVisible ? "Show less" : "Show more"}
                  value={isMobileMenuVisible ? "expand_less" : "expand_more"}
                />
              </UnstyledButton>
            </div>
            <Flex width="100%" onClick={this.closeNavMobile}>
              <NavSearch
                activeCollectionSlug={activeCollectionSlug}
                isBannerShown={isBannerShown}
                key={searchQuery}
                query={searchQuery || ""}
                setCollectionSlug={setCollectionSlug}
                setQuery={setSearchQuery}
              />
            </Flex>
            {this.renderNavbar()}
          </nav>
          {isMobileMenuVisible ? (
            <div className="Navbar--mobile-menu">
              <NavMobile
                openWallet={this.openWalletSidebar}
                onClose={this.closeNavMobile}
              />
            </div>
          ) : null}
          {showBanner ? <TestnetNotice /> : null}
          {navbarOverlayImageUrl ? (
            <Image className="Navbar--overlay" url={navbarOverlayImageUrl} />
          ) : null}
        </DivContainer>
        <WalletSidebar
          close={this.closeWalletSidebar}
          isBannerShown={isBannerShown}
          isOpen={isWalletSidebarOpen}
          onWalletSidebarClickAway={this.onWalletSidebarClickAway}
        />
      </>
    )
  }
}

export default withData<NavbarQuery, Props>(
  Navbar,
  graphql`
    query NavbarQuery {
      account {
        imageUrl
        user {
          publicUsername
          isStaff
        }
      }
    }
  `,
)

const DivContainer = styled.div`
  box-shadow: ${props => props.theme.shadow};
  height: ${$nav_height};
  position: sticky;
  top: 0;
  z-index: ${Z_INDEX.NAVBAR};
  transition: top 0.5s;

  ${props =>
    themeVariant({
      variants: {
        light: {
          backgroundColor: props.theme.colors.background,
        },
        dark: {
          backgroundColor: props.theme.colors.charcoal,
        },
      },
    })}

  &.Navbar--isBannerShown {
    top: ${BANNER_HEIGHT};
  }

  .Navbar--main {
    display: flex;
    height: 100%;
    justify-content: space-between;
    padding: 0 16px;

    .Navbar--left {
      align-items: center;
      display: flex;
      height: 100%;
      padding-right: 16px;

      .Navbar--brand {
        align-items: center;
        display: flex;
        font-size: 20px;
        font-weight: 500;
        height: 100%;
        padding: 8px 0;
        position: relative;

        .Navbar--brand-name {
          display: none;
          margin-left: 10px;
          margin-top: 4px;
        }

        .Navbar--brand-testnets {
          background: ${props => props.theme.colors.warning};
          border-radius: 3px;
          bottom: 6px;
          color: ${props => props.theme.colors.text.on.warning};
          font-size: 10px;
          padding: 2px 4px 0 4px;
          position: absolute;
          right: 0;
        }
      }

      .Navbar--mobile-toggle {
        color: ${props =>
          props.theme.colors.withOpacity.text.on.background.heavy};
        height: 100%;
        padding: 4px;
      }
    }

    .Navbar--dropdown {
      max-height: fit-content;
      top: -10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;

      .Navbar--dropdown-image {
        margin-right: 8px;
      }
    }

    .Navbar--items {
      display: none;
      margin: 0;

      .Navbar--account-image {
        border: 2px solid ${props => props.theme.colors.border};
        border-radius: 16px;
        width: 32px;
      }
    }
  }

  .Navbar--overlay {
    left: -3px;
    pointer-events: none;
    position: absolute;
    top: -7px;
    transition: top 2.5s ease-in-out;
    z-index: 1;

    &.hidden {
      top: -160px;
    }
  }

  ${sizeMQ({
    tabletL: css`
      .Navbar--main {
        .Navbar--left {
          padding-right: 24px;

          .Navbar--brand {
            margin-left: 8px;

            .Navbar--brand-name {
              display: initial;
            }
          }

          .Navbar--mobile-toggle {
            display: none;
          }
        }

        .Navbar--items {
          padding-left: 24px;
          display: flex;
        }
      }

      .Navbar--mobile-menu {
        display: none;
      }
    `,
    navbar: css`
      .Navbar--main {
        .Navbar--left {
          padding-right: 189px;
        }

        .Navbar--items {
          padding-left: 0;
        }
      }
    `,
  })}
`
