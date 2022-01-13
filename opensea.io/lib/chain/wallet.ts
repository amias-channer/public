import { NextPageContext } from "next"
import { FragmentRef } from "react-relay"
import { Buffer } from "safe-buffer"
import {
  ChainIdentifier,
  CHAIN_IDENTIFIERS_TO_NAMES,
  MainnetChainIdentifier,
  MAINNET_CHAIN_IDENTIFIERS,
  MAINNET_TO_TESTNET_CHAIN_IDENTIFIERS,
  TestnetChainIdentifier,
  TESTNET_CHAIN_IDENTIFIERS,
  TESTNET_TO_MAINNET_CHAIN_IDENTIFIERS,
  WALLET_NAME,
} from "../../constants"
import { getIsTestnet } from "../../store"
import { trackConnectWallet } from "../analytics/events/walletEvents"
import Auth from "../auth"
import { IdentityKey } from "../auth/types"
import Cookie from "../cookie"
import { IdentityInputType } from "../graphql/__generated__/accountQuery.graphql"
import { ClientSignatureStandard } from "../graphql/__generated__/trader_sign_and_post.graphql"
import { wallet_accountKey } from "../graphql/__generated__/wallet_accountKey.graphql"
import { walletAssetQuery } from "../graphql/__generated__/walletAssetQuery.graphql"
import { walletBalanceBySymbolQuery } from "../graphql/__generated__/walletBalanceBySymbolQuery.graphql"
import { walletBalanceQuery } from "../graphql/__generated__/walletBalanceQuery.graphql"
import {
  walletQuery,
  walletQueryResponse,
} from "../graphql/__generated__/walletQuery.graphql"
import { clearCache } from "../graphql/environment/middlewares/cacheMiddleware"
import { fetch, graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"
import { addressesEqual } from "../helpers/addresses"
import { first, OrderedSet } from "../helpers/array"
import memoize from "../helpers/memoize"
import { BigNumber, bn } from "../helpers/numberUtils"
import Publisher from "../helpers/publisher"
import Router from "../helpers/router"
import chain, { AccountKey } from "./chain"
import Provider, { Transaction, TransactionId } from "./provider"
const COOKIE_KEY = "wallet"
const TESTNET_COOKIE_KEY = "wallet-testnet"

export type Account = NonNullable<walletQueryResponse["account"]>

interface WalletData {
  accounts: ReadonlyArray<Account>
  activeAccount?: Account
  installedProviderNames?: ReadonlyArray<WALLET_NAME>
}

type AccountKeyHash = string

export interface SignOptions {
  clientSignatureStandard: ClientSignatureStandard
}

export default class Wallet {
  static wallet: Wallet | undefined

  static toAccountKey = ({ address }: { address: string }): IdentityKey => ({
    address,
  })

  get isStaff(): boolean {
    return !!this.activeAccount?.user?.isStaff
  }

  private static readAccountKey = inlineFragmentize<
    wallet_accountKey,
    IdentityKey
  >(
    graphql`
      fragment wallet_accountKey on AccountType @inline {
        address
      }
    `,
    Wallet.toAccountKey,
  )

  static getAccount = async (address: string): Promise<Account | undefined> => {
    const { account } = await fetch<walletQuery>(
      graphql`
        query walletQuery($identity: IdentityInputType!) {
          account(identity: $identity) {
            address
            imageUrl
            nickname
            relayId
            user {
              isStaff
              relayId
              username
              publicUsername
              hasAffirmativelyAcceptedOpenseaTerms
              email
            }
          }
        }
      `,
      { identity: { address } },
      { isBatched: true },
    )
    return account || undefined
  }

  /**
   * IMPORTANT: This is meant for use by infrastructural libraries such as `trader`, `cacheMiddleware`, etc.
   * If you're writing a React component, you should instead have it extend `AppComponent`, then use the `wallet` instance in `this.context`.
   *
   * @returns The previously set `Wallet` singleton instance. If unset, an error is thrown.
   */
  static UNSAFE_get = (): Wallet => {
    if (Wallet.wallet) {
      return Wallet.wallet
    }
    throw new Error("Wallet not initialized.")
  }

  static set = (w: Wallet): void => {
    Wallet.wallet = w
  }

  static toHash = (address: string): AccountKeyHash =>
    JSON.stringify({ address: address.toLowerCase() })

  private _accounts: OrderedSet<Account, AccountKeyHash> = new OrderedSet(a =>
    Wallet.toHash(a.address),
  )

  private cookie: Cookie<WalletData>

  private installedProviderNames: Set<WALLET_NAME> = new Set()

  private publisher: Publisher = new Publisher()

  private fetchAssetChain = memoize(async (assetId: string) => {
    const assetData = await fetch<walletAssetQuery>(
      graphql`
        query walletAssetQuery($assetId: AssetRelayID!) {
          asset(asset: $assetId) {
            assetContract {
              chain
            }
          }
        }
      `,
      { assetId },
    )
    return assetData.asset.assetContract.chain
  })

  activeAccount?: Account

  get accounts(): ReadonlyArray<Account> {
    return this._accounts.elements
  }

  get address(): string | undefined {
    return this.activeAccount?.address
  }

  constructor(context?: NextPageContext, isTestnet?: boolean) {
    this.cookie = new Cookie(
      isTestnet ?? getIsTestnet() ? TESTNET_COOKIE_KEY : COOKIE_KEY,
    )
    this.load(context)
  }

  onChange = (onChange: (wallet: Wallet) => unknown): (() => void) =>
    this.publisher.subscribe(() => onChange(this))

  getActiveAccountKey = (): IdentityKey | undefined =>
    this.activeAccount && {
      address: this.activeAccount.address,
    }

  isActiveAccount = (account: FragmentRef<wallet_accountKey>): boolean => {
    const activeAccountKey = this.getActiveAccountKey()
    if (!activeAccountKey) {
      return false
    }
    const { address } = Wallet.readAccountKey(account)
    return addressesEqual(activeAccountKey.address, address)
  }

  isCurrentIdentity = (identity: IdentityInputType) => {
    if (!this.activeAccount) {
      return false
    }

    if (
      identity.address &&
      addressesEqual(identity.address, this.activeAccount.address)
    ) {
      return true
    }

    if (
      identity.username &&
      identity.username === this.activeAccount.user?.username
    ) {
      return true
    }

    return false
  }

  hasActiveUser = (): boolean => !!this.activeAccount?.user

  hasRegisteredUser = (): boolean => {
    return !!this.activeAccount?.user?.publicUsername
  }

  save = async (): Promise<void> => {
    this.cookie.set({
      accounts: this._accounts.elements,
      activeAccount: this.activeAccount,
      installedProviderNames: Array.from(this.installedProviderNames),
    })
    Auth.getValidSession(this.activeAccount)
    this.publisher.publish()
  }

  load = (context?: NextPageContext): void => {
    const data = this.cookie.get(context)
    this._accounts = new OrderedSet(this._accounts.getKey, data?.accounts)
    this.activeAccount = data?.activeAccount
    this.installedProviderNames = new Set(data?.installedProviderNames)
  }

  loadProviders = async (): Promise<void> => {
    await Promise.all(
      Array.from(this.installedProviderNames)
        .filter(walletName => !chain.getProvider(walletName))
        .map(this.install),
    )
  }

  refresh = async (): Promise<void> => {
    await Promise.all(
      this._accounts.elements.map(async acc => {
        const account = await Wallet.getAccount(acc.address)
        if (account) {
          this._accounts = this._accounts.add(account)
          if (
            this.activeAccount &&
            this._accounts.getKey(this.activeAccount) ===
              this._accounts.getKey(account)
          ) {
            this.activeAccount = account
          }
        }
      }),
    )
    this.save()
  }

  find = ({ address }: IdentityKey): Account | undefined => {
    return this._accounts.find(Wallet.toHash(address))
  }

  select = async (key: AccountKey): Promise<Account | undefined> => {
    console.log("Selecting wallet", key)
    const account = await this.add(key)
    if (account) {
      this.activeAccount = account
      this.save()
    }
    return account
  }

  add = async (key: AccountKey): Promise<Account | undefined> => {
    if (getIsTestnet() !== TESTNET_CHAIN_IDENTIFIERS.includes(key.chain)) {
      console.info(`Incompatible test network: ${key.chain}`)
      return undefined
    }
    const account = this.find(key)
    if (account) {
      return account
    }
    const newAccount = await Wallet.getAccount(key.address)
    if (newAccount) {
      this._accounts = this._accounts.add(newAccount)
      if (!this.activeAccount) {
        this.activeAccount = newAccount
      }
      this.save()
    }
    return newAccount
  }

  delete = (key: AccountKey): void => {
    const account = this.find(key)
    if (account) {
      this._accounts = this._accounts.delete(Wallet.toHash(key.address))
      if (this.activeAccount === account) {
        this.activeAccount = undefined
      }
      this.save()
    }
  }

  clear = (): void => {
    this.activeAccount = undefined
    this._accounts = this._accounts.clear()
    this.installedProviderNames.clear()
    this.save()
  }

  sign = async (
    message: string | Buffer,
    options?: SignOptions,
  ): Promise<string> => {
    const { accountKey, provider } =
      await this.UNSAFE_getActiveAccountAndProviderOrRedirect()
    return provider.sign(message, accountKey.address, options)
  }

  signTypedData = async (
    message: string | Buffer,
    options?: SignOptions,
  ): Promise<string> => {
    const { accountKey, provider } =
      await this.UNSAFE_getActiveAccountAndProviderOrRedirect()
    return provider.signTypedData(message, accountKey.address, options)
  }

  transact = async (
    transaction: Omit<Transaction, "source">,
  ): Promise<TransactionId> => {
    const { accountKey, provider } =
      await this.UNSAFE_getActiveAccountAndProviderOrRedirect()
    return provider.transact({
      ...transaction,
      source: accountKey.address,
    })
  }

  install = async (walletName: WALLET_NAME): Promise<void> => {
    const provider = await chain.addProvider(walletName)
    if (!provider) {
      return
    }

    try {
      await provider.connect()
      const accounts = await provider.getAccounts()
      const connectedChain = first(accounts)?.chain
      const accountsInNetwork = accounts.filter(
        account =>
          getIsTestnet() === TESTNET_CHAIN_IDENTIFIERS.includes(account.chain),
      )

      if (accounts.length !== accountsInNetwork.length && connectedChain) {
        const isMainnet = MAINNET_CHAIN_IDENTIFIERS.includes(connectedChain)
        const appropriateChain = isMainnet
          ? MAINNET_TO_TESTNET_CHAIN_IDENTIFIERS[
              connectedChain as MainnetChainIdentifier
            ]
          : TESTNET_TO_MAINNET_CHAIN_IDENTIFIERS[
              connectedChain as TestnetChainIdentifier
            ]

        if (appropriateChain) {
          throw new Error(
            `Please connect to the ${CHAIN_IDENTIFIERS_TO_NAMES[appropriateChain]} network.`,
          )
        }
      }

      const firstAccount = first(accountsInNetwork)

      if (firstAccount) {
        this.select(firstAccount)
        trackConnectWallet({ ...firstAccount, walletName })
      }
      await Promise.all(accounts.map(this.add))
    } catch (e) {
      this.installedProviderNames.delete(walletName)
      this.save()

      throw e
    }
    this.installedProviderNames.add(walletName)
    this.save()
  }

  getProvider = async (): Promise<Provider | undefined> => {
    const accountKey = this.getActiveAccountKey()
    if (!accountKey) {
      return undefined
    }
    return chain.findProvider(accountKey)
  }

  getProviderOrRedirect = async (
    context?: NextPageContext,
  ): Promise<Provider | undefined> => {
    const provider = await this.getProvider()
    if (provider) {
      return provider
    }
    const query = {
      referrer: Router.getPathWithMergedQuery({ referrer: undefined }, context),
    }
    if (chain.providers.length) {
      Router.push("/wallet/locked", query)
      console.info("Could not access wallet account")
    } else {
      Router.push("/wallet/install", query)
      console.info("Could not find wallet provider")
    }
    return undefined
  }

  UNSAFE_getActiveAccountAndProviderOrRedirect = async (): Promise<{
    account: Account
    accountKey: IdentityKey
    provider: Provider
  }> => {
    const provider = await this.getProviderOrRedirect()
    const account = this.activeAccount
    const accountKey = this.getActiveAccountKey()
    if (account && accountKey && provider) {
      return { account, accountKey, provider }
    }
    throw new Error("Could not find wallet provider matching current account.")
  }

  getBaseBalance = async (assetId: string): Promise<BigNumber | undefined> => {
    if (!this.activeAccount) {
      return undefined
    }

    const { address } = this.activeAccount

    clearCache()

    const chain = await this.fetchAssetChain(assetId)

    const data = await fetch<walletBalanceQuery>(
      graphql`
        query walletBalanceQuery(
          $assetId: AssetRelayID!
          $identity: IdentityInputType!
        ) {
          blockchain {
            balance(asset: $assetId, identity: $identity)
          }
        }
      `,
      { assetId, identity: { address, chain } },
    )

    return bn(data.blockchain.balance)
  }

  getBalanceBySymbol = async (
    symbol: string,
    chain?: ChainIdentifier,
  ): Promise<BigNumber> => {
    if (!this.activeAccount) {
      return bn(0)
    }
    const { paymentAsset } = await fetch<walletBalanceBySymbolQuery>(
      graphql`
        query walletBalanceBySymbolQuery(
          $symbol: String!
          $chain: ChainScalar
        ) {
          paymentAsset(symbol: $symbol, chain: $chain) {
            asset {
              decimals
              relayId
            }
          }
        }
      `,
      { symbol, chain },
    )
    if (!paymentAsset) {
      return bn(0)
    }
    const {
      asset: { decimals, relayId },
    } = paymentAsset
    const balance = await this.getBaseBalance(relayId)
    return bn(balance || 0, decimals)
  }
}

export class MockWallet extends Wallet {
  constructor(account: Account) {
    super()
    this.activeAccount = account
  }
}
