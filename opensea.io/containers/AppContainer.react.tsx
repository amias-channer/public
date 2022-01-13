import React from "react"
import localForage from "localforage"
import { WithRouterProps } from "next/dist/client/with-router"
import { withRouter } from "next/router"
import qs from "qs"
import styled from "styled-components"
import * as ActionTypes from "../actions"
import ReferralActions from "../actions/referrals"
import UserActions from "../actions/users"
import AppComponent from "../AppComponent.react"
import Error from "../components/Error.react"
import Footer from "../components/layout/Footer.react"
import Head from "../components/layout/Head.react"
import AnnouncementBanner from "../components/layout/home-page/AnnouncementBanner.react"
import PoweredByOpenSeaNotice from "../components/layout/PoweredByOpenSeaNotice.react"
import Navbar from "../components/nav/Navbar.react"
import Notice from "../components/Notice.react"
import { IS_SERVER } from "../constants"
import Block from "../design-system/Block"
import FlexVertical from "../design-system/FlexVertical"
import Analytics from "../lib/analytics/analytics"
import { trackLoadApp } from "../lib/analytics/events/appEvents"
import { trackRedirect } from "../lib/analytics/events/redirectEvents"
import chain from "../lib/chain/chain"
import Router from "../lib/helpers/router"
import { changeBackgroundClass } from "../lib/helpers/styling"
import Network from "../lib/network"
import { prefetchAll } from "../lib/prefetching"
import { dispatch, getIsTestnet, getState, subscribe } from "../store"
import { $nav_height, $network_banner_height } from "../styles/variables"

if (!IS_SERVER) {
  // For testing
  const query = qs.parse(window.location.search.substr(1))
  if (query && query.embed) {
    changeBackgroundClass({ "html-theme": query.embed as string })
  }
}

type Props = {
  activeCollectionSlug?: string
  className?: string
  hideFooter?: boolean
  isLanding?: boolean
  isPageAnnouncementShown?: boolean
  searchQuery?: string
  setCollectionSlug?: (slug?: string) => unknown
  setSearchQuery?: (query?: string) => unknown
} & WithRouterProps

class AppContainer extends AppComponent<Props> {
  static firstTimeMounting = true

  async componentDidMount() {
    if (!window.location.hash) {
      // Autoscroll unless an anchor is present
      scroll(0, 0)
    }
    if (AppContainer.firstTimeMounting) {
      AppContainer.firstTimeMounting = false
      await this.firstTimeMount()
    }
    await this.processQueryParams()
  }

  async processQueryParams() {
    const { enableSells, enableBundles, ref, tokenAddress, tokenId } =
      this.props.router.query
    if (ref) {
      const refAddress = await ReferralActions.parseReferrer(ref as string)
      if (refAddress) {
        dispatch(
          ReferralActions.setReferrerAddress(refAddress, {
            tokenAddress,
            tokenId,
          }),
        )
      }
    }
    if (enableSells) {
      localForage.setItem("OS_sells_enabled", enableSells)
    }
    if (enableBundles) {
      localForage.setItem("OS_bundles_enabled", enableBundles)
    }
  }

  async firstTimeMount() {
    // TODO: Move to _app
    const { router } = this.props
    const w = window as any
    w.OSlogout = () => {
      dispatch(UserActions.logout())
    }
    w.OSdispatch = dispatch
    w.OSgetState = getState
    w.OSsubscribe = subscribe
    w.OSactions = ActionTypes
    w.OSstorage = localForage
    w.OSNetwork = Network
    w.OSRouter = Router
    w.OSchain = chain

    trackRedirect(router.query as Record<string, string>)
    await dispatch(UserActions.loadCached())
    // Log result for Sentry breadcrumbs
    try {
      await prefetchAll()
      console.info("Prefetched data loaded")
    } catch (e) {
      console.warn("Prefetched data failed:", e)
    }
    // Track event after checking web3
    trackLoadApp({
      path: window.location.pathname,
      queryString: window.location.search,
    })

    // Re-enable this once we fix the issue where cloud wallets pop up on every screen.
    // Enable cloud wallets immediately
    // const lastWalletType = user.lastWalletType
    // if (
    //   lastWalletType &&
    //   CLOUD_WALLET_TYPES.includes(lastWalletType) &&
    //   // Calling enableWallet when Authereum is the lastWalletType causes irregular behavior.
    //   // When you get to /wallet and `enableWallet` is called, you're automatically redirected to Authereum.
    //   lastWalletType !== WALLET_NAME.Authereum
    // ) {
    //   await dispatch(NetworkActions.enableWallet(lastWalletType))
    // } else {
    //   // Prefetch wallet page in case auth fails later
    //   Router.prefetch("/wallet")
    // }

    // Prefetch wallet page in case auth fails later
    Router.prefetch("/wallet")
  }

  render() {
    const {
      activeCollectionSlug,
      children,
      isLanding,
      isPageAnnouncementShown,
      searchQuery,
      setCollectionSlug,
      setSearchQuery,
      hideFooter,
    } = this.props
    const { isEmbedded, isMobile, announcementBanner, updateContext } =
      this.context
    const isTestnet = getIsTestnet()

    const announcement = announcementBanner?.announcementBanner
    const isAnnouncementGlobal = announcement?.displayMode == "ALL_PAGES"

    const main = (
      <FlexVertical as="main" flex="1">
        {isAnnouncementGlobal || isPageAnnouncementShown ? (
          <Block marginTop="56px" />
        ) : null}
        <span>{isLanding ? null : <Error />}</span>
        <span>{isLanding ? null : <Notice />}</span>
        <FlexVertical className={this.props.className} flex="1" height="100%">
          {children}
        </FlexVertical>
      </FlexVertical>
    )

    return (
      <DivContainer className="App">
        <Head />
        {isEmbedded ? (
          <>
            <div className="AppContainer--embed-container">{main}</div>
            <PoweredByOpenSeaNotice />
          </>
        ) : (
          <>
            {isAnnouncementGlobal && announcement && (
              <AnnouncementBanner
                ctaText={announcement.ctaText}
                heading={announcement.heading}
                headingMobile={announcement.headingMobile}
                text={announcement.text}
                url={announcement.url ?? ""}
                onClose={() => updateContext({ announcementBanner: undefined })}
              />
            )}
            <Navbar
              activeCollectionSlug={activeCollectionSlug}
              isBannerShown={isAnnouncementGlobal || isPageAnnouncementShown}
              searchQuery={searchQuery}
              setCollectionSlug={setCollectionSlug}
              setSearchQuery={setSearchQuery}
              showRinkebyTooltip={isTestnet && !isMobile}
              variables={{ searchQuery }}
            />
            {main}
            {!hideFooter && <Footer />}
          </>
        )}
        <Analytics />
      </DivContainer>
    )
  }
}

export default withRouter(AppContainer)

const DivContainer = styled(FlexVertical)`
  min-height: 100%;
  background-color: ${props => props.theme.colors.background};

  .AppContainer--embed-container {
    max-height: calc(100vh - ${$nav_height});
  }

  .AppContainer--mainWrapper {
    height: calc(100% - ${$nav_height});
  }

  .AppContainer--showBanner {
    position: relative;
    top: ${$network_banner_height};
  }
`
