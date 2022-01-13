import React, { useRef } from "react"
import { QueryClientProvider, QueryClient } from "react-query"
import { Hydrate } from "react-query/hydration"
import { RelayEnvironmentProvider } from "react-relay"
import { Environment } from "relay-runtime"
import { ThemeProvider } from "../design-system/Context/ThemeContext"
import { MediaContextProvider } from "../design-system/Media"
import Wallet from "../lib/chain/wallet"
import { GlobalStyle } from "../styles/global"
import { Theme } from "../styles/styled"
import { WalletProvider } from "./WalletProvider.react"

type BasePageProps<DS> = {
  dehydratedState?: DS
}

type Props<DS, PP extends BasePageProps<DS>> = {
  pageProps: PP
  children: React.ReactNode
  theme: Theme
  environment: Environment
  wallet: Wallet
}

export const AppProviders = <DS, PP extends BasePageProps<DS>>({
  pageProps,
  children,
  theme,
  environment,
  wallet,
}: Props<DS, PP>) => {
  const queryClientRef = useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }

  return (
    <MediaContextProvider>
      <RelayEnvironmentProvider environment={environment}>
        <QueryClientProvider client={queryClientRef.current}>
          <Hydrate state={pageProps.dehydratedState}>
            <ThemeProvider theme={theme}>
              <GlobalStyle />
              <WalletProvider wallet={wallet}>{children}</WalletProvider>
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </RelayEnvironmentProvider>
    </MediaContextProvider>
  )
}

export default AppProviders
