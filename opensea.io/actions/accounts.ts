import BigNumber from "bignumber.js"
import qs from "qs"
import { IS_SERVER } from "../constants"
import { captureNoncriticalError, trackUser } from "../lib/analytics/analytics"
import Wallet from "../lib/chain/wallet"
import { walletError } from "../lib/helpers/wallet"
import Transport from "../lib/transport"
import { Account, buildAccount } from "../reducers/accounts"
import { Action, AsyncAction } from "../store"
import ErrorActions from "./errors"
import ExchangeActions from "./exchange"
import FetchingActions from "./fetching"
import * as ActionTypes from "./index"
import TokenActions from "./tokens"
import UserActions from "./users"

const PAGE_SIZE = 20
const AccountActions = {
  findCurrent: (): AsyncAction<Account> => async (dispatch, getState) => {
    try {
      const mainAddress = Wallet.wallet?.getActiveAccountKey()?.address
      if (mainAddress) {
        const account = await dispatch(AccountActions.find(mainAddress, true))
        const { user } = getState()
        if (
          account.address &&
          user.account?.address &&
          user.account.address !== account.address
        ) {
          // User has switched accounts since last time
          await dispatch(UserActions.logout())
        }
      } else {
        dispatch(AccountActions.reset())
      }
    } catch (error) {
      dispatch(ErrorActions.show(error))
    }
    return getState().account
  },

  find:
    (address: string, isCurrent = false): AsyncAction<Account> =>
    async (dispatch, getState) => {
      try {
        const proxy = undefined
        // try {
        //   proxy = await ExchangeActions._getProxy(accountAddress)
        // } catch(error) {
        //   // Ignore if wrong network
        // }
        const { data } = await Transport.fetch(`/account/${address}/`)
        await dispatch(AccountActions.receive({ ...data, isCurrent, proxy }))
        if (!IS_SERVER) {
          await dispatch(AccountActions.updateEtherBalance(address))
        }
      } catch (error) {
        captureNoncriticalError(error)
      }
      return getState().account
    },

  // TODO (joshuawu): This should be an AsyncAction.
  _findByUsername: async (publicUsername: string): Promise<Account | void> => {
    const accounts = await AccountActions._findAll({ publicUsername, limit: 1 })
    const account = accounts[0]
    if (
      account &&
      account.user &&
      account.user.publicUsername == publicUsername
    ) {
      return account
    }
  },

  // TODO (joshuawu): This should be an AsyncAction.
  _findAll: async ({
    publicUsername,
    address,
    limit = PAGE_SIZE,
  }: {
    publicUsername: string
    address?: string
    limit?: number
  }): Promise<Account[]> => {
    const query = address
      ? { address }
      : publicUsername
      ? { username: publicUsername }
      : undefined
    if (!query) {
      throw new Error("Invalid account query: no username or address specified")
    }
    const url = "/accounts/?" + qs.stringify({ ...query, limit })
    const data = await Transport.fetch(url)
    return data.accounts.map(buildAccount)
  },

  updateEtherBalance:
    (accountAddress?: string): AsyncAction<BigNumber | undefined> =>
    async (dispatch, getState) => {
      const address = accountAddress || getState().account.address
      if (!address) {
        return undefined
      }
      const etherBalance = await ExchangeActions._getBalance(address)
      dispatch(AccountActions.receiveEtherBalance(etherBalance))
      return etherBalance
    },

  /**
   * Update user's balance of a token
   * TODO deprecate
   * @param tokenAddress address of an ERC20 token. Defaults to first token in tokenlist.ts
   * @param accountAddress address of a wallet. Defaults to state's account address
   */
  updateTokenBalance:
    (
      accountAddress?: string,
      tokenAddress?: string,
    ): AsyncAction<BigNumber | undefined> =>
    async (dispatch, getState) => {
      if (!getState().tokens.tokens.length) {
        await dispatch(TokenActions.findAll())
      }
      const {
        account,
        tokens: { tokens },
      } = getState()
      try {
        const token = tokenAddress
          ? tokens.find(
              t => t.address.toLowerCase() == tokenAddress.toLowerCase(),
            )
          : tokens.find(s => s.symbol == "WETH")
        const address = accountAddress || account.address
        if (!token) {
          console.error("No token found")
          return undefined
        }
        if (!address) {
          throw walletError
        }
        const tokenBalance = await ExchangeActions._getBalance(address, token)
        dispatch(AccountActions.receiveTokenBalance(tokenBalance))
        return tokenBalance
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
      return undefined
    },

  updateSetting:
    (address: string, setting: string, enabled = true): AsyncAction =>
    async dispatch => {
      dispatch(FetchingActions.start(`Updating ${setting} setting...`))

      const url = `/account/${address}/`
      await Transport.sendJSON(url, {
        method: "PUT",
        body: { setting, enabled },
      })

      dispatch(FetchingActions.stop())
    },

  receive:
    (data: {
      address: string
      isCurrent: boolean
      proxy?: string
    }): AsyncAction =>
    async dispatch => {
      dispatch({
        type: ActionTypes.RECEIVE_ACCOUNT,
        data,
      })
      const { address, isCurrent } = data
      if (address && isCurrent) {
        await trackUser({ address })
      }
    },

  reset: (): Action => ({ type: ActionTypes.RESET_ACCOUNT }),

  receiveEtherBalance: (etherBalance: BigNumber | undefined): Action => ({
    type: ActionTypes.RECEIVE_ETHER_BALANCE,
    etherBalance,
  }),

  receiveTokenBalance: (tokenBalance: BigNumber | undefined): Action => ({
    type: ActionTypes.RECEIVE_TOKEN_BALANCE,
    tokenBalance,
  }),
}

export default AccountActions
