import React from "react"
import { AmplitudeClient } from "amplitude-js"
import _ from "lodash"
import { NextPageContext } from "next"
import { withRouter, NextRouter } from "next/router"
import FullStory from "react-fullstory"
import ReactGA from "react-ga"
import { RRNLRequestError } from "react-relay-network-modern"
import { FULLSTORY_ORG_ID, IS_PRODUCTION, IS_SERVER } from "../../constants"
import { getActiveChain } from "../../containers/WalletProvider.react"
import { getState } from "../../store"
import { getThemeFromCookie } from "../../styles/themes"
import chain from "../chain/chain"
import { CHAIN_IDENTIFIER_BY_NETWORK_ID } from "../chain/networks/ethereum"
import Web3EvmProvider from "../chain/providers/web3EvmProvider"
import Wallet from "../chain/wallet"
import { getDeviceType } from "../helpers/layout"
import { keys } from "../helpers/object"
import { init as SentryInit } from "../sentry"
import analyticsV2 from "./analyticsV2"

const googleAnalyticsId = "UA-111688253-1"

type SentryModule = ReturnType<typeof SentryInit>
let Sentry: SentryModule["Sentry"]
let captureException: SentryModule["captureException"]

export async function initSentry() {
  const sentryModule = SentryInit()
  Sentry = sentryModule.Sentry
  captureException = sentryModule.captureException
}

export const captureCriticalError = (
  error: Error,
  extra?: NextPageContext | RRNLRequestError,
) => {
  // Severity.Critical doesn't work for some reason
  captureException(error, Sentry.Severity.Fatal, extra)
  console.error(error)
}

export const captureNoncriticalError = (
  error: Error,
  ctx?: NextPageContext | RRNLRequestError,
) => {
  captureException(error, Sentry.Severity.Error, ctx)
  console.error(error)
}

export const captureWarning = (
  error: Error,
  ctx?: NextPageContext | RRNLRequestError,
) => {
  captureException(error, Sentry.Severity.Warning, ctx)
  console.warn(error)
}

export const trackEventWithClient = async (
  amplitude: AmplitudeClient,
  eventName: string,
  params: object = {},
) => {
  const balance = getState().account.etherBalance
  const accountKey = Wallet.wallet?.getActiveAccountKey()
  const provider = await Wallet.wallet?.getProvider()
  const activeChain = getActiveChain()
  const web3Info = {
    web3Present: chain.providers.some(
      provider => provider instanceof Web3EvmProvider,
    ),
    web3Unlocked: !!Wallet.wallet?.activeAccount,
    web3Network: keys(CHAIN_IDENTIFIER_BY_NETWORK_ID).find(
      id => CHAIN_IDENTIFIER_BY_NETWORK_ID[id] === activeChain,
    ),
    web3Wallet: provider?.getName(),
    walletBalance: balance ? balance.toNumber() : undefined,
  }
  const walletInfo = {
    accountPresent: !!accountKey,
    chain: activeChain,
    providerName: provider?.getName(),
    providerPresent: !!provider,
  }

  const userAgent = window.navigator.userAgent
  const clientInfo = {
    userAgent,
    cookiesEnabled: window.navigator.cookieEnabled,
    connectionSpeed: window.navigator.connection?.effectiveType,
    device: getDeviceType(userAgent),
  }

  const themeInfo = {
    theme: getThemeFromCookie(),
  }

  if (!IS_PRODUCTION) {
    console.info(`Not logging event ${eventName} with params`)
    console.info(
      params,
      { ...web3Info, ...walletInfo, ...themeInfo },
      clientInfo,
    )
    return
  }
  // Fix amplitude log
  const eventParams = _.omitBy(
    { ...params, ...web3Info, ...walletInfo, ...clientInfo, ...themeInfo },
    _.isNil,
  )
  console.log(eventParams)

  await new Promise(resolve =>
    amplitude.logEvent(eventName, eventParams, resolve),
  )
  const identify = new amplitude.Identify()
  identify.setOnce("firstEvent", { ...eventParams, eventName })
  amplitude.identify(identify)
}

interface Props {
  router: NextRouter
}

class Analytics extends React.Component<Props> {
  static firstTimeMounting = true

  constructor(props: Props) {
    super(props)
    if (IS_SERVER || !Analytics.firstTimeMounting) {
      return
    }
    Analytics.firstTimeMounting = false
    ReactGA.initialize(googleAnalyticsId, { debug: !IS_PRODUCTION })
  }

  componentDidMount() {
    this.sendPageChange()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.router.asPath !== prevProps.router.asPath) {
      this.sendPageChange()
    }
  }

  sendPageChange(url?: string) {
    if (!IS_PRODUCTION) {
      return
    }

    const page = url || this.props.router.asPath
    ReactGA.set({ page })
    ReactGA.pageview(page)
  }

  render() {
    return (
      <>
        <FullStory org={FULLSTORY_ORG_ID} />
      </>
    )
  }
}

export async function trackUser(userOrAccountData: any) {
  if (!userOrAccountData) {
    // Logging out
    Sentry.setUser(null)
    return
  }
  Sentry.setUser({
    email: userOrAccountData.email,
    username: userOrAccountData.username,
    publicUsername: userOrAccountData.publicUsername,
    address: userOrAccountData.address,
    id: userOrAccountData.id,
  })

  if (!IS_SERVER) {
    const traits = {
      username: userOrAccountData.username,
      publicUsername: userOrAccountData.publicUsername,
      email: userOrAccountData.email,
      address: userOrAccountData.address,
      os_id: userOrAccountData.id,
    }
    analyticsV2.identify(userOrAccountData.address, traits)
  }
}

export default withRouter(Analytics)
