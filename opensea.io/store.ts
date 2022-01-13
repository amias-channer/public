import {
  Action as ReduxAction,
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
} from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunkMiddleware, { ThunkAction } from "redux-thunk"
import { SET_IS_TESTNET } from "./actions"
import {
  ChainIdentifier,
  MAINNET_CHAIN_IDENTIFIERS,
  TESTNET_CHAIN_IDENTIFIERS,
} from "./constants"
import deprecate from "./lib/helpers/deprecate"
import account, { Account } from "./reducers/accounts"
import assets, { Assets } from "./reducers/assetlist"
import asset, { Asset } from "./reducers/assets"
import auctions, { Auctions } from "./reducers/auctionlist"
import auction, { EscrowAuction } from "./reducers/auctions"
import bundle, { Bundle } from "./reducers/bundles"
import error, { Error } from "./reducers/errors"
import exchange, { ExchangeState } from "./reducers/exchange"
import fetching, { Fetching } from "./reducers/fetching"
import notice, { Notice } from "./reducers/notices"
import referrals, { Referrals } from "./reducers/referrallist"
import referral, { PendingReferral } from "./reducers/referrals"
import tokens, { Tokens } from "./reducers/tokenlist"
import token, { Token } from "./reducers/tokens"
import user, { User } from "./reducers/users"

export type Action = AnyAction

export interface App {
  account: Account
  asset: Asset
  assets: Assets
  auction: EscrowAuction
  auctions: Auctions
  bundle: Bundle
  error: Error
  exchange: ExchangeState
  fetching: Fetching
  history: History
  notice: Notice
  referral: PendingReferral
  referrals: Referrals
  token: Token
  tokens: Tokens
  user: User
}

const mainReducer = combineReducers<App>({
  account,
  asset,
  assets,
  auction,
  auctions,
  bundle,
  error,
  exchange,
  fetching,
  notice,
  referral,
  referrals,
  token,
  tokens,
  user,
})

const initState = {
  isTestnet: false,
  main: mainReducer({} as any, { type: undefined }),
  testnet: mainReducer({} as any, { type: undefined }),
}

const networkSwitchReducer = (state = initState, action: AnyAction) => {
  const { isTestnet: isTestnet, main, testnet: testnet } = state
  if (action.type === SET_IS_TESTNET) {
    return { ...state, isTestnet: action.value }
  }
  return isTestnet
    ? { ...state, testnet: mainReducer(testnet, action) }
    : { ...state, main: mainReducer(main, action) }
}

const Store = createStore<App>(
  // @ts-expect-error: intentional type hack to avoid retyping createStore
  networkSwitchReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
)

const originalDispatch = Store.dispatch.bind(Store)
const originalGetState = Store.getState.bind(
  Store,
) as unknown as () => typeof initState
const originalSubscribe = Store.subscribe.bind(Store)

export const getIsTestnet = (): boolean => originalGetState().isTestnet

export const setIsTestnet = (value: boolean): void => {
  if (getIsTestnet() === value) {
    // Optimize React tree renderings
    return
  }
  originalDispatch({ type: SET_IS_TESTNET, value })
}

export const getState = (): App => {
  const { isTestnet: isTestnet, main, testnet: testnet } = originalGetState()
  return isTestnet ? testnet : main
}

export type AsyncAction<
  R = void,
  A extends ReduxAction = AnyAction,
  E = undefined,
> = ThunkAction<Promise<R>, App, E, A>

type Dispatch<T> = (
  action: T,
) => T extends ReduxAction
  ? T
  : T extends AsyncAction<infer R>
  ? Promise<R>
  : never

const patchedDispatch = (action: any) =>
  originalDispatch(
    typeof action === "function" ? () => action(dispatch, getState) : action,
  )
export const dispatch = <T>(action: T) =>
  action && (patchedDispatch as Dispatch<T>)(action)

/**
 * Dispatch asynchronous actions in parallel.
 */
export async function dispatchAsync<R0, R1, R2, R3, R4, R5, R6, R7>(
  action0?: AsyncAction<R0>,
  action1?: AsyncAction<R1>,
  action2?: AsyncAction<R2>,
  action3?: AsyncAction<R3>,
  action4?: AsyncAction<R4>,
  action5?: AsyncAction<R5>,
  action6?: AsyncAction<R6>,
  action7?: AsyncAction<R7>,
): Promise<[R0, R1, R2, R3, R4, R5, R6, R7]> {
  return Promise.all([
    dispatch(action0),
    dispatch(action1),
    dispatch(action2),
    dispatch(action3),
    dispatch(action4),
    dispatch(action5),
    dispatch(action6),
    dispatch(action7),
  ])
}

export const subscribe = (subscription: () => void) =>
  originalSubscribe(subscription)

const deprecateStoreMethod = <T extends (...args: any[]) => any>(method: T) =>
  deprecate(
    method,
    `Store.${method.name}() is deprecated. Use the getState(), dispatch(), and subscribe() methods from store.ts instead.`,
  )
Store.getState = deprecateStoreMethod(getState)
// @ts-expect-error TODO: description
Store.dispatch = deprecateStoreMethod(dispatch)
Store.subscribe = deprecateStoreMethod(subscribe)

export const getChainIdentifiers = (): ChainIdentifier[] =>
  getIsTestnet() ? TESTNET_CHAIN_IDENTIFIERS : MAINNET_CHAIN_IDENTIFIERS

export default Store
