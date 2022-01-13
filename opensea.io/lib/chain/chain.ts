import { ChainIdentifier, IS_SERVER, WALLET_NAME } from "../../constants"
import { IdentityKey } from "../auth/types"
import { addressesEqual } from "../helpers/addresses"
import { flatMap } from "../helpers/array"
import { Promiseable } from "../helpers/promise"
import Provider from "./provider"
import createArkaneProvider from "./providers/arkaneProvider"
import createAuthereumProvider from "./providers/authereumProvider"
import createBitskiProvider from "./providers/bitskiProvider"
import BrowserWeb3Provider from "./providers/browserWeb3Provider"
import createFortmaticProvider from "./providers/fortmaticProvider"
import KlaytnEvmProvider from "./providers/klaytnEvmProvider"
import createPortisProvider from "./providers/portisProvider"
import createTorusProvider from "./providers/torusProvider"
import createWalletConnectProvider from "./providers/walletConnectProvider"
import createWalletLinkProvider from "./providers/walletLinkProvider"

export type Address = string

export type AccountKey = {
  chain: ChainIdentifier
  address: Address
}

const PROVIDERS: { [W in WALLET_NAME]?: () => Promiseable<Provider> } = {
  Arkane: createArkaneProvider,
  Authereum: createAuthereumProvider,
  Bitski: createBitskiProvider,
  Fortmatic: createFortmaticProvider,
  Kaikas: () => new KlaytnEvmProvider(),
  Torus: createTorusProvider,
  WalletConnect: createWalletConnectProvider,
  "Coinbase Wallet": createWalletLinkProvider,
  Portis: createPortisProvider,
}

class Chain {
  providers: Provider[] = []

  constructor() {
    if (!IS_SERVER) {
      this.tryAddProvider(() => new BrowserWeb3Provider())
      this.tryAddProvider(() => new KlaytnEvmProvider())
    }
  }

  getProvider(name: WALLET_NAME): Provider | undefined {
    return this.providers.find(p => p.getName() === name)
  }

  isProviderInstalled = (name: WALLET_NAME): boolean => {
    return this.getProvider(name) !== undefined
  }

  async addProvider(name: WALLET_NAME): Promise<Provider | undefined> {
    const provider = this.getProvider(name)
    if (provider) {
      return provider
    }
    const initProvider = PROVIDERS[name]
    if (!initProvider) {
      return undefined
    }
    return await this.tryAddProvider(initProvider)
  }

  async tryAddProvider(
    initProvider: () => Promiseable<Provider>,
  ): Promise<Provider | undefined> {
    try {
      const provider = await initProvider()
      this.providers.push(provider)
      return provider
    } catch (_) {
      // TODO: Show error UI
      return undefined
    }
  }

  deleteProvider(name: WALLET_NAME): void {
    this.providers = this.providers.filter(p => p.getName() !== name)
  }

  async findProvider({ address }: IdentityKey): Promise<Provider | undefined> {
    for (const provider of this.providers) {
      const accounts = await provider.getAccounts()
      if (accounts.some(a => addressesEqual(a.address, address))) {
        return provider
      }
    }
    return undefined
  }

  async getAccounts(): Promise<AccountKey[]> {
    const providerAccounts = await Promise.all(
      this.providers.map(async provider => {
        try {
          return await provider.getAccounts()
        } catch (error) {
          console.info(
            `Error retrieving addresses for ${provider.getName()}:`,
            error,
          )
          return []
        }
      }),
    )
    return flatMap(providerAccounts, a => a)
  }

  onAccountsChange(
    handler: (accounts: AccountKey[]) => unknown,
  ): () => unknown {
    const unsubs = this.providers.map(provider => {
      const unsubAccountsChange = provider.onAccountsChange(handler)
      const unsubChainChange = provider.onChainChange(async () => {
        const accounts = await provider.getAccounts()
        handler(accounts)
      })
      return () => {
        unsubAccountsChange()
        unsubChainChange()
      }
    })
    return () => unsubs.forEach(unsub => unsub())
  }
}

const chain = new Chain()
export default chain
