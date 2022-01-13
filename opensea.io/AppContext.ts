import { createContext, ContextType } from "react"
import { GraphQLTaggedNode } from "react-relay"
import { MutationConfig, MutationParameters } from "relay-runtime"
import { ChainIdentifier, Language } from "./constants"
import type { ToastT } from "./design-system/Toast"
import Wallet from "./lib/chain/wallet"
import { announcementBannerQueryResponse } from "./lib/graphql/__generated__/announcementBannerQuery.graphql"
import { OrderedSet } from "./lib/helpers/array"
import Publisher from "./lib/helpers/publisher"
import { Theme } from "./styles/styled"

export class MutationOptions<TOperation extends MutationParameters> {
  shouldAuthenticate?: boolean
  /* Useful for callbacks that need to execute after login and before mutation, e.g. optimistic updates */
  before?: (() => Promise<unknown>) | (() => unknown)
  updater?: MutationConfig<TOperation>["updater"]
}

export interface AppContextProps {
  collectionSlug?: string
  isDesktop?: boolean
  isEmbedded?: boolean
  announcementBanner?: announcementBannerQueryResponse
  isMobile?: boolean
  isPageNotFound?: boolean
  isWebPSupported?: boolean
  language: Language
  refetchPublisher: Publisher
  showBanner?: boolean
  theme: Theme // TODO: remove this once no more class component references to theme are needed
  ipCountry?: string
  toasts: OrderedSet<ToastT, string>
  updateContext: <K extends keyof Omit<AppContextProps, "updateContext">>(
    context: Pick<AppContextProps, K>,
  ) => Promise<void>
  wallet: Wallet
  isAuthenticated: boolean
  login: () => Promise<boolean>
  logout: () => Promise<void>
  mutate: <TOperation extends MutationParameters>(
    mutation: GraphQLTaggedNode,
    variables: TOperation["variables"],
    options?: MutationOptions<TOperation>,
  ) => Promise<TOperation["response"]>
  chain: ChainIdentifier | undefined
}

export const DEFAULT_APP_CONTEXT: AppContextProps = {
  language: "en",
  refetchPublisher: new Publisher(),
  theme: "light",
  toasts: new OrderedSet(t => t.key),
  updateContext: async () => {
    // noop
  },
  wallet: new Wallet(),
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  mutate: async () => {
    return {}
  },
  chain: undefined, // Legacy --> migrate to useWallet
}

export const AppContext = createContext(DEFAULT_APP_CONTEXT)

export type AppContextType = ContextType<typeof AppContext>
