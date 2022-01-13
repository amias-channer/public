import type { ServerResponse } from "http"
import React from "react"
import { noop } from "lodash"
import { NextComponentType, NextPageContext } from "next"
import App, { AppContext } from "next/app"
import NProgress from "nprogress"
import { GraphQLTaggedNode } from "react-relay"
import { Environment, MutationParameters, OperationType } from "relay-runtime"
import AccountActions from "../actions/accounts"
import { AppContextProvider } from "../AppComponent.react"
import {
  AppContextProps,
  DEFAULT_APP_CONTEXT,
  MutationOptions,
} from "../AppContext"
import {
  ChainIdentifier,
  DEFAULT_CACHE_MAX_AGE_SECONDS,
  IS_PRODUCTION,
  IS_SERVER,
  Language,
  TESTNET_CHAIN_IDENTIFIERS,
} from "../constants"
import AppProviders from "../containers/AppProviders"
import { ToastsContainer } from "../design-system/Toast"
import I18n from "../i18n/i18n"
import {
  captureCriticalError,
  captureNoncriticalError,
  initSentry,
} from "../lib/analytics/analytics"
import API from "../lib/api"
import Auth, { getValidSession } from "../lib/auth"
import chain, { AccountKey } from "../lib/chain/chain"
import Ethereum from "../lib/chain/networks/ethereum"
import Wallet from "../lib/chain/wallet"
import { announcementBannerQueryResponse } from "../lib/graphql/__generated__/announcementBannerQuery.graphql"
import {
  createServerEnvironment,
  getEnvironment,
  RelayCache,
} from "../lib/graphql/environment"
import { setCacheEntry } from "../lib/graphql/environment/middlewares/cacheMiddleware"
import { handleError, hasGraphQLResponseError } from "../lib/graphql/error"
import { fetch, mutateGlobal } from "../lib/graphql/graphql"
import { GraphQLRenderer } from "../lib/graphql/GraphQLRenderer"
import { loadAnnouncementBanner } from "../lib/helpers/announcementBanner"
import {
  clientIsDesktop,
  isMobileDeviceClient,
  isMobileDeviceSSR,
} from "../lib/helpers/layout"
import Router from "../lib/helpers/router"
import { consoleMethods } from "../lib/logging"
import QP from "../lib/qp/qp"
import {
  authRequiredRoutes,
  walletRequiredRoutes,
  walletRoutes,
} from "../lib/routes"
import { dispatch, getIsTestnet, getState, setIsTestnet } from "../store"
import "../styles/app.scss"
import { Theme } from "../styles/styled"
import { getThemeFromCookie } from "../styles/themes"
import ErrorPage from "./_error"

// TODO: Try to use babel-plugin-transform-remove-console to reduce client bundle size
if (IS_PRODUCTION && !IS_SERVER) {
  consoleMethods.forEach(method => {
    // We want errors so users can report them to us
    if (method !== "error") {
      console[method] = noop
    }
  })
}

Router.onStart((url: string) => {
  console.info(`Starting route change to: ${url}`)
  NProgress.start()
})
Router.onChange(() => NProgress.done())
Router.onError(() => NProgress.done())

// Init sentry first, so we can track errors
initSentry()

interface Props<T extends OperationType> {
  chainIdentifier: ChainIdentifier
  collectionSlug?: string
  getNextPageContext?: () => NextPageContext
  ssrData?: T["response"]
  isDesktop: boolean
  announcementBanner: announcementBannerQueryResponse | undefined
  isMobile: boolean
  isPageNotFound?: boolean
  isTestnet: boolean
  language?: Language
  pageProps: {
    cacheMaxAge?: number
    variables?: object
    ssrEnvironment?: Environment
  }
  relayCache?: RelayCache
  isWebPSupported: boolean
  isAuthenticated: boolean
  theme: Theme
  ipCountry?: string
}

type State = AppContextProps

export default class OpenSeaApp<T extends OperationType> extends App<
  Props<T>,
  unknown,
  State
> {
  unsub?: () => unknown

  updateIsAuthenticated = async (wallet: Wallet) => {
    const isAuthenticated = Boolean(
      await Auth.getValidSession(wallet.activeAccount),
    )
    this.setState({ isAuthenticated })
  }

  login = async () => {
    const { wallet } = this.state
    const isAuthenticated = await Auth.login(wallet)
    this.setState({ isAuthenticated })
    return isAuthenticated
  }

  logout = async () => {
    const { wallet } = this.state
    wallet.clear()
    await Auth.logout()
    this.setState({ isAuthenticated: false })
  }

  mutate = async <TOperation extends MutationParameters>(
    mutation: GraphQLTaggedNode,
    variables: TOperation["variables"],
    {
      shouldAuthenticate = false,
      before,
      updater,
    }: MutationOptions<TOperation> = {},
  ) => {
    if (!shouldAuthenticate) {
      await before?.()
      return mutateGlobal(mutation, variables, this.login, this.logout, updater)
    }

    const isAuthenticated = await this.login()
    if (isAuthenticated) {
      await before?.()
      return mutateGlobal(mutation, variables, this.login, this.logout, updater)
    } else {
      throw new Error("Not logged in.")
    }
  }

  state: State = {
    ...DEFAULT_APP_CONTEXT,
    collectionSlug: this.props.collectionSlug,
    isDesktop: this.props.isDesktop,
    isEmbedded: Router.getQueryParams().embed === "true",
    announcementBanner: this.props.announcementBanner,
    isMobile: this.props.isMobile,
    isPageNotFound: this.props.isPageNotFound,
    isWebPSupported: this.props.isWebPSupported,
    language: this.props.language ?? DEFAULT_APP_CONTEXT.language,
    updateContext: context =>
      new Promise(resolve => this.setState(context, resolve)),
    wallet: new Wallet(this.props.getNextPageContext?.(), this.props.isTestnet),
    login: this.login,
    logout: this.logout,
    isAuthenticated: this.props.isAuthenticated,
    mutate: this.mutate,
  }

  static async checkRedirectFromWalletPage(
    wallet: Wallet,
    context?: NextPageContext,
  ): Promise<boolean> {
    if (IS_SERVER) {
      // TODO: Remove after decoupling chain from wallet
      return false
    }
    if (
      walletRoutes.has(Router.getRouteName(context)) &&
      (await wallet.getProvider())
    ) {
      const { referrer } = QP.parse(
        { referrer: QP.Optional(QP.string, "/account") },
        context,
      )
      if (referrer.startsWith("/")) {
        await Router.replace(referrer)
        return true
      }
    }
    return false
  }

  static async checkRedirectToWalletPage(
    wallet: Wallet,
    context?: NextPageContext,
  ): Promise<boolean> {
    if (IS_SERVER) {
      // TODO: Remove after decoupling chain from wallet
      return false
    }
    const routeName = Router.getRouteName(context)
    if (
      walletRequiredRoutes.has(routeName) ||
      authRequiredRoutes.has(routeName)
    ) {
      return !(await wallet.getProviderOrRedirect(context))
    }
    return false
  }

  static setCacheControlMaxAge = (
    context: NextPageContext,
    maxAge?: number,
  ) => {
    // Tell Cloudflare CDN to cache this page.
    if (context.res) {
      context.res.setHeader(
        "Cache-Control",
        `public, max-age=${maxAge ?? DEFAULT_CACHE_MAX_AGE_SECONDS}`,
      )
    }
  }

  static async checkWallet(
    wallet: Wallet,
    login: () => Promise<boolean>,
    context?: NextPageContext,
  ): Promise<{ isWalletRedirect: boolean; isAuthenticated: boolean }> {
    let isAuthenticated = Boolean(await getValidSession(wallet.activeAccount))
    if (await OpenSeaApp.checkRedirectToWalletPage(wallet, context)) {
      return { isWalletRedirect: true, isAuthenticated }
    }

    if (await OpenSeaApp.checkRedirectFromWalletPage(wallet, context)) {
      return { isWalletRedirect: true, isAuthenticated }
    }
    if (!IS_SERVER && wallet.address && (await wallet.getProvider())) {
      if (authRequiredRoutes.has(Router.getRouteName(context))) {
        isAuthenticated = await login()
      }
      if (getState().account.address !== wallet.address) {
        // TODO: Remove account from store
        await dispatch(AccountActions.find(wallet.address, true))
      }
    }
    return { isWalletRedirect: false, isAuthenticated }
  }

  static async getInitialProps<T extends OperationType>({
    Component,
    ctx,
    router,
  }: AppContext): Promise<Props<T>> {
    const announcementBannerPromise = loadAnnouncementBanner()
    Router.set(router)

    const isTestnet = API.doesMatchServerLabel("testnet", ctx.req)
    setIsTestnet(isTestnet)

    const { locale } = QP.parse({ locale: QP.Optional(QP.Language) }, ctx)
    const theme = getThemeFromCookie(ctx)
    const initialProps: Props<T> = {
      chainIdentifier: Ethereum.getChainName(ctx.req),
      getNextPageContext: () => ctx,
      collectionSlug: Router.getPathParams(ctx).collectionSlug,
      isDesktop: clientIsDesktop(ctx.req),
      announcementBanner: undefined,
      isMobile: IS_SERVER
        ? isMobileDeviceSSR(ctx.req!)
        : isMobileDeviceClient(),

      isTestnet,
      language: locale,
      pageProps: {},
      isWebPSupported: !!ctx.req?.headers?.accept?.includes("image/webp"),
      isAuthenticated: false,
      theme,
      ipCountry: ctx.req?.headers?.["cf-ipcountry"] as string | undefined,
    }

    const set404response = async (res: ServerResponse) => {
      res.statusCode = 404
      Component = ErrorPage as NextComponentType<NextPageContext, any, unknown>
      initialProps.isPageNotFound = true
      initialProps.pageProps = (await Component.getInitialProps?.(ctx)) ?? {}
    }

    const { isAuthenticated, isWalletRedirect } = await OpenSeaApp.checkWallet(
      (IS_SERVER ? undefined : Wallet.wallet) ?? new Wallet(ctx),
      Auth.UNSAFE_login,
      ctx,
    )

    const tryLoadAnnouncmentBanner = async () => {
      try {
        initialProps.announcementBanner = await announcementBannerPromise
      } catch (error) {
        captureCriticalError(error, ctx)
      }
    }

    initialProps.isAuthenticated = isAuthenticated
    if (isWalletRedirect) {
      await tryLoadAnnouncmentBanner()
      return initialProps
    }

    try {
      initialProps.pageProps = (await Component.getInitialProps?.(ctx)) ?? {}
    } catch (error) {
      if (
        error instanceof QP.ParamError ||
        hasGraphQLResponseError(error, 404)
      ) {
        if (!IS_PRODUCTION) {
          console.error(error)
        }
        if (ctx.res) {
          await set404response(ctx.res)
        }
      } else {
        captureNoncriticalError(error, ctx)
      }
    }

    OpenSeaApp.setCacheControlMaxAge(
      ctx,
      initialProps.pageProps.cacheMaxAge as number | undefined,
    )

    const query = (Component as any).query as GraphQLTaggedNode | undefined
    if (!IS_SERVER || !query) {
      await tryLoadAnnouncmentBanner()
      return initialProps
    }

    const { environment, relaySSR } = createServerEnvironment()
    initialProps.pageProps.ssrEnvironment = environment

    try {
      const ssrDataPromise = fetch<T>(
        query,
        initialProps.pageProps.variables ?? {},
        { metadata: { wallet: new Wallet(ctx) } },
        environment,
      )

      await tryLoadAnnouncmentBanner()

      const ssrData = await ssrDataPromise
      const relayCache = (await relaySSR.getCache()) as RelayCache

      return { ...initialProps, ssrData, relayCache }
    } catch (error) {
      if (ctx.res && hasGraphQLResponseError(error, 404)) {
        await set404response(ctx.res)
      }
      return initialProps
    }
  }

  setRelayCache = () => {
    const { relayCache } = this.props
    const [rawInfo, response] = (relayCache ?? [])[0] ?? []

    if (rawInfo && response) {
      try {
        const { queryID, variables } = JSON.parse(rawInfo)
        if (queryID && variables) {
          setCacheEntry(queryID, variables, response)
        }
      } catch (_) {
        //ignore
      }
    }
  }

  constructor(props: OpenSeaApp<T>["props"]) {
    super(props)
    if (IS_SERVER) {
      return
    }

    const { wallet } = this.state
    Wallet.set(wallet)

    this.setRelayCache()
  }

  componentDidCatch(error: Error, errorInfo: any) {
    captureCriticalError(error, errorInfo)
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo)
  }

  async componentDidMount() {
    window.addEventListener("unhandledrejection", event => {
      event.preventDefault()
      handleError(event.reason, this.login, this.logout)
    })

    const { refetchPublisher, language, wallet } = this.state
    this.injectToWindow()

    const clientLanguage = I18n.getLanguage()
    if (clientLanguage && clientLanguage !== language) {
      this.setState({ language: clientLanguage })
      Router.updateQueryParams({
        locale:
          clientLanguage === DEFAULT_APP_CONTEXT.language
            ? undefined
            : clientLanguage,
      })
    }

    const validateNetwork = (account: AccountKey) => {
      const isValid =
        getIsTestnet() === TESTNET_CHAIN_IDENTIFIERS.includes(account.chain)
      this.setState({ showBanner: !isValid })
      return isValid
    }
    const addAccounts = (accounts: AccountKey[]) =>
      Promise.all(accounts.filter(validateNetwork).map(wallet.select))

    const accountsKeys = await chain.getAccounts()
    await addAccounts(accountsKeys)

    const unsubChain = chain.onAccountsChange(accounts => {
      addAccounts(accounts)
      this.updateIsAuthenticated(wallet)
    })
    const unsubWallet = wallet.onChange(async () => {
      this.forceUpdate()
      await this.checkWallet()
      refetchPublisher.publish()
    })
    const unsubRouter = Router.onChange(() => {
      const { isPageNotFound } = this.state
      if (isPageNotFound) {
        this.setState({ isPageNotFound: undefined })
      }
    })

    this.unsub = () => {
      unsubChain()
      unsubWallet()
      unsubRouter()
    }

    wallet.refresh()
    await wallet.loadProviders()
    await this.checkWallet()
    refetchPublisher.publish()
  }

  static getDerivedStateFromProps<T extends OperationType>(
    props: Props<T>,
    state: State,
  ): State {
    return {
      ...state,
      isAuthenticated: props.isAuthenticated,
      isMobile: props.isMobile,
      ipCountry: props.ipCountry ?? state.ipCountry,
    }
  }

  checkWallet = async () => {
    const { wallet } = this.state
    const { isAuthenticated } = await OpenSeaApp.checkWallet(wallet, this.login)
    this.setState({ isAuthenticated })
  }

  componentWillUnmount() {
    this.unsub?.()
  }

  injectToWindow() {
    const { wallet } = this.state
    const w = window as any
    w.OSwallet = wallet
  }

  render() {
    const {
      collectionSlug,
      isDesktop,
      isMobile,
      isTestnet,
      pageProps,
      theme,
      ssrData,
    } = this.props

    const { isPageNotFound, wallet } = this.state
    const Component = isPageNotFound
      ? (ErrorPage as NextComponentType<NextPageContext, any, unknown>)
      : this.props.Component
    setIsTestnet(isTestnet)
    const query = (Component as any).query as GraphQLTaggedNode | undefined

    const environment = IS_SERVER
      ? pageProps.ssrEnvironment ?? getEnvironment()
      : getEnvironment()

    return (
      <AppProviders
        environment={environment}
        pageProps={pageProps}
        theme={theme}
        wallet={wallet}
      >
        <AppContextProvider
          value={{
            ...this.state,
            collectionSlug,
            isDesktop,
            isMobile,
          }}
        >
          {query ? (
            <GraphQLRenderer
              component={Component}
              handleError={async (error, login, logout) => {
                if (isPageNotFound) {
                  return
                }
                if (hasGraphQLResponseError(error, 404)) {
                  this.setState({ isPageNotFound: true })
                } else {
                  handleError(error, login, logout)
                }
              }}
              props={isPageNotFound ? { errorCode: 404 } : pageProps}
              query={query}
              ssrData={ssrData}
            />
          ) : (
            <Component {...pageProps} />
          )}
          <ToastsContainer />
        </AppContextProvider>
      </AppProviders>
    )
  }
}
