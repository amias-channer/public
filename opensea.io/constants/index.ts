import qs from "qs"
import { FeatureFlag } from "../components/featureFlag/FeatureFlag.react"
import { SearchSortBy } from "../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { reverse } from "../lib/helpers/object"

export const BUILD_ID = process.env.BUILD_ID || "development"
export const IS_SERVER = typeof window === "undefined"
export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
export const IS_TEST = process.env.NODE_ENV === "test"
export const IS_CI_BUILD = process.env.CIBUILD !== undefined
export const IS_STAGING =
  process.env.HEROKU_BRANCH !== undefined &&
  process.env.HEROKU_PR_NUMBER !== undefined

export const API_URL =
  !process.env.API_URL || process.env.API_URL.startsWith("http")
    ? process.env.API_URL
    : `http://${process.env.API_URL}`

export const FULLSTORY_ORG_ID = "QRBFQ"

export const DEFAULT_CACHE_MAX_AGE_SECONDS = 20

export const POLLING_INTERVAL = 1000 * 60 // 1 minute
export const ENGLISH_AUCTION_POLLING_TIMEFRAME_IN_MINUTES = 30

export const DEFAULT_TITLE =
  "OpenSea: Buy NFTs, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
export const DEFAULT_DESC =
  "A peer-to-peer marketplace for NFTs, rare digital items and crypto collectibles. " +
  "Buy, sell, auction, and discover CryptoKitties, Decentraland, Gods Unchained cards, blockchain game items, and more. " +
  "Over 100,000 collectibles on sale now!"
export const STATIC_ROOT = "https://storage.googleapis.com/opensea-static"
// Use storage root to help Twitter og:card issues
export const DEFAULT_IMG = `${STATIC_ROOT}/og-images/Metadata-Image.png`
export const SEO_MAX_DESC_LENGTH = 230
export const COLLECTION_MAX_DESC_LENGTH = 1000
export const BIO_MAX_DESC_LENGTH = 140
export const MAX_ADDRESS_LENGTH = 6
export const MAX_ASSET_SHORTNAME_LENGTH = 50
export const MAX_TOKEN_INPUT_VALUE = 100000000000000
export const SELL_GAS = 500000
export const INVERSE_BASIS_POINT = 10000
export const OPENSEA_TWITTER_HANDLE = "opensea"
export const API_MESSAGE_404 = "Not found"
export const API_MESSAGE_403 = "Unauthorized"
export const API_MESSAGE_400 = "Invalid request"
export const API_MESSAGE_500 = "Internal server error"

export const ETHEREUM_MAINNET = "https://api.opensea.io/jsonrpc/v1/"
export const ETHEREUM_RINKEBY = "https://testnets-api.opensea.io/jsonrpc/v1/"

export const RINKEBY_ETHERSCAN_HOST = "rinkeby.etherscan.io"
export const RINKEBY_HOST = "testnets.opensea.io"
export const RINKEBY_FAUCET_URL = "https://faucet.rinkeby.io/"
export const WYVERN_PATH_PREFIX = "/wyvern/v1"

export const WYRE_ACCOUNT_ID = "AC_23GRXAHWNQX"
export const WYRE_SUPPORTED_PAYMENT_TOKEN_SYMBOLS = ["ETH", "DAI", "USDC"]
export enum WYRE_REDIRECT_PARAMS {
  DidRedirect = "wyre_redirect",
  DidFailAndRedirect = "wyre_fail_and_redirect",
  // The following data will be passed to the redirectUrl as url query parameters
  TransferId = "transferId",
  OrderId = "orderId",
  AccountId = "accountId",
  Dest = "dest",
  Fees = "fees",
  DestAmount = "destAmount",
}
export const AUTHEREUM_API_KEY = "L4uSjiqJ-8scbR__vdEHwbcuulM8pbnpBaoMbjhay78"
export const BITSKI_CLIENT_ID = "db8ab07f-c15a-44c2-a223-ae34568ecc7e"
export const FORTMATIC_API_KEY = "pk_live_55A076E9A0F5E8CE"
export const FORTMATIC_TESTNET_API_KEY = "pk_test_1E42BD3F09A4CD42"
export const PORTIS_API_KEY = "b3c4d6a3-6452-4ea1-a113-df64da57fc05"

export const OPENSEA_LOGO_IMG = "/static/images/logos/opensea.svg"
export const OPENSEA_WHITE_LOGO_IMG = "/static/images/logos/opensea-white.svg"
export const MOONPAY_LOGO_IMG = "/static/images/logos/moonpay.svg"
export const NO_ASKS_YET_IMG = "/static/images/empty-asks.svg"
export const NO_BIDS_YET_IMG = "/static/images/empty-bids.svg"
export const NO_CHART_DATA_IMG = "/static/images/no-chart-data.svg"
export const NO_HISTORY_DATA_IMG = "/static/images/no-history-data.svg"
export const NO_SIMILAR_ITEMS_IMG = "/static/images/no-similar-items.svg"
export const CARD_TRADE_BG = "/static/images/drawings/card_trade.png"
export const OPENSEA_UNLOCK_IMG = "/static/images/drawings/opensea_unlock.png"
export const UNLOCK_IMG = "/static/images/drawings/unlock.png"
export const AUTHORIZING_IMG = "/static/images/drawings/authorizing.png"
export const AFFILIATE_PROGRAM_IMG =
  "/static/images/drawings/affiliate_program.png"
export const CARD_PACK_IMG = "/static/images/drawings/card_pack.png"
export const BUNDLE_IMG = "/static/images/drawings/bundle_squares.png"
export const OFFERS_IMG = "/static/images/drawings/offers.png"
export const STATIC_IMAGE_BASE_PATH = "https://storage.opensea.io/static/"
export const RANKINGS_IMG = "/static/images/drawings/rankings.png"
export const PLACEHOLDER_IMAGE = "/static/images/placeholder.png"
export const DELISTED_IMAGE = "/static/images/delisted.svg"

export const METAMASK_LOGO = "/static/images/logos/metamask.png"
export const METAMASK_ALTERNATIVE_LOGO =
  "/static/images/logos/metamask-alternative.png"
export const DAPPER_ALTERNATIVE_LOGO = `${STATIC_ROOT}/logos/dapper-icon.png`
export const DAPPER_LOGO = `${STATIC_ROOT}/logos/dapper-logo.png`
export const BITSKI_LOGO = `${STATIC_ROOT}/logos/bitski.png`
export const BITSKI_ALTERNATIVE_LOGO = `${STATIC_ROOT}/logos/bitski-alternative.png`
export const PORTIS_LOGO = `${STATIC_ROOT}/logos/portis.png`
export const PORTIS_ALTERNATIVE_LOGO = `${STATIC_ROOT}/logos/portis-alternative.svg`
export const AUTHEREUM_LOGO = `${STATIC_ROOT}/logos/authereum.png`
export const AUTHEREUM_ALTERNATIVE_LOGO =
  "https://storage.opensea.io/static/wallets/authereum/authereum-alternative.png"
export const ARKANE_LOGO = "/static/images/logos/arkane.png"
export const ARKANE_ALTERNATIVE_LOGO =
  "/static/images/logos/arkane-alternative.svg"
export const WALLETCONNECT_LOGO =
  STATIC_IMAGE_BASE_PATH + "wallets/walletconnect/walletconnect.png"
export const WALLETCONNECT_ALTERNATIVE_LOGO =
  STATIC_IMAGE_BASE_PATH + "wallets/walletconnect/walletconnect-alternative.png"
export const TORUS_LOGO = STATIC_IMAGE_BASE_PATH + "wallets/torus/torus.png"
export const TORUS_ALTERNATIVE_LOGO =
  STATIC_IMAGE_BASE_PATH + "wallets/torus/torus-alternative.png"
export const OPERA_TOUCH_LOGO = "/static/images/logos/opera-touch.svg"
export const OPERA_TOUCH_ALTERNATIVE_LOGO =
  "/static/images/logos/opera-touch-alternative.svg"

export const TRUST_WALLET_LOGO = `${STATIC_ROOT}/logos/trustwallet-logo.png`
export const TRUST_WALLET_ALTERNATIVE_LOGO =
  "https://storage.opensea.io/static/wallets/trust/trust-alternative.png"
export const COINBASE_WALLET_LOGO = `${STATIC_ROOT}/logos/coinbasewallet-logo.png`
export const COINBASE_ALTERNATIVE_LOGO =
  STATIC_IMAGE_BASE_PATH + "wallets/walletlink/walletlink-alternative.png"
export const LUMI_LOGO = `${STATIC_ROOT}/lumi.png`
export const FORTMATIC_LOGO =
  "https://storage.opensea.io/static/wallets/fortmatic/fortmatic.png"
export const FORTMATIC_ALTERNATIVE_LOGO = `${STATIC_ROOT}/logos/fortmatic-alternative.png`

export const ENS_LOGO_BANNER = `${STATIC_ROOT}/logos/ens-logo-banner.png`
export const ENS_LOGO_BANNER_DESKTOP = `${STATIC_ROOT}/logos/ens-logo-banner-desktop.png`

export const SUGGESTED_WALLET_IMAGE =
  "https://storage.opensea.io/static/wallets/suggested.png"

export const METAMASK_CHROME_DOWNLOAD_LINK =
  "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
export const METAMASK_FIREFOX_DOWNLOAD_LINK =
  "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
export enum BROWSER {
  Firefox = "Firefox",
  Opera = "Opera",
  InternetExplorer = "InternetExplorer",
  Edge = "Edge",
  Chrome = "Chrome",
  Safari = "Safari",
  Unknown = "Unknown",
}

export const BROWSERS_SUPPORTING_METAMASK_OR_DAPPER = [
  BROWSER.Chrome,
  BROWSER.Firefox,
]

export enum WALLET_NAME {
  Native = "Native",
  MetaMask = "MetaMask",
  Arkane = "Arkane",
  Authereum = "Authereum",
  Bitski = "Bitski",
  Dapper = "Dapper",
  Fortmatic = "Fortmatic",
  OperaTouch = "OperaTouch",
  Torus = "Torus",
  Trust = "Trust",
  WalletConnect = "WalletConnect",
  CoinbaseWallet = "Coinbase Wallet",
  Kaikas = "Kaikas",
  Portis = "Portis",
}

export enum WalletSupport {
  MOBILE = "mobile",
  DESKTOP = "desktop",
  BOTH = "both",
}

export const SUGGESTED_WALLET = WALLET_NAME.MetaMask
export const SUGGESTED_CLOUD_WALLET = WALLET_NAME.Fortmatic

export const AUTHEREUM_LINK = "https://authereum.org/"
export const ARKANE_LINK = "https://arkane.network/"
export const BITSKI_LINK = "https://www.bitski.com/"
export const COINBASE_LINK = "https://www.coinbase.com/"
export const GEMINI_LINK = "https://www.gemini.com/"
export const KRAKEN_LINK = "https://www.kraken.com/"
export const ETORO_LINK = "https://www.etoro.com/"
export const DAPPER_LINK = "https://www.meetdapper.com/?utm_source=opensea"
export const FORTMATIC_URL = "https://fortmatic.com/"
export const LUMI_LINK = "https://lumiwallet.com/"
export const METAMASK_PRIVACY_URL = "https://metamask.io/privacy.html"
export const METAMASK_TUTORIAL_VIDEO_LINK =
  "https://www.youtube.com/embed/6Gf_kRE4MJU"
export const NIFTY_GATEWAY_TERMS_OF_SERVICE = "https://niftygateway.com/#/terms"
export const TORUS_URL = "https://tor.us/"
export const WALLETCONNECT_URL = "https://walletconnect.org/"
export const KAIKAS_URL =
  "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi"
export const PORTIS_URL = "https://www.portis.io/"

export enum AUCTION_EVENT_TYPES {
  SUCCESSFUL = "successful",
  CREATED = "created",
  CANCELLED = "cancelled",
  TRANSFER = "transfer",
  APPROVE = "approve",
  BID_ENTERED = "bid_entered",
  BID_WITHDRAWN = "bid_withdrawn",
  OFFER_ENTERED = "offer_entered",
  CUSTOM = "custom",
}
export const STATUS_CODE_MESSAGES = {
  404: "Error 404: land not found. Check your URL!",
  500: "Error 500: the ship's sprung a leak and the crew's been notified!",
  403: "Error 403: you can't board this ship. Sign in again!",
  401: "Error 401: you can't board yet. Please sign in!",
}
export const NULL_ACCOUNT = "0x0000000000000000000000000000000000000000"

export const BASE_SORT_OPTIONS: SearchSortBy[] = [
  "BIRTH_DATE",
  "CREATED_DATE",
  "EXPIRATION_DATE",
  "LAST_SALE_DATE",
  "LAST_SALE_PRICE",
  "LISTING_DATE",
  "PRICE",
  "SALE_COUNT",
  "VIEWER_COUNT",
  "FAVORITE_COUNT",
]
export const ACCOUNT_SPECIFIC_SORT_OPTIONS: SearchSortBy[] = [
  "LAST_TRANSFER_DATE",
]
export const STAFF_SORT_OPTIONS: SearchSortBy[] = [
  "STAFF_SORT_1",
  "STAFF_SORT_2",
  "STAFF_SORT_3",
]

export const BLOG_URL = "https://opensea.io/blog"
export const DOCS_URL = "https://docs.opensea.io"
export const DISCORD_DEV_URL = "https://discord.gg/Sn9exDr"
export const DISCORD_LOGO = `${STATIC_ROOT}/logos/discord-white.svg`
export const DISCORD_URL = "https://discord.gg/opensea"
export const HELP_CENTER_URL = "https://support.opensea.io/"
export const PARTNERS_URL =
  "https://openseahelp.zendesk.com/hc/en-us/sections/360012685073-Partners-Developers"
export const INSTAGRAM_LOGO = `${STATIC_ROOT}/logos/instagram-white.svg`
export const INSTAGRAM_URL = "https://www.instagram.com/opensea/"
export const MEDIUM_LOGO = `${STATIC_ROOT}/logos/medium-white.svg`
export const MEDIUM_URL = "https://medium.com/opensea"
export const NEWSLETTER_URL = "https://opensea.io/blog/newsletter/"
export const REDDIT_LOGO = `${STATIC_ROOT}/logos/reddit-white.svg`
export const REDDIT_URL = "https://reddit.com/r/opensea"
export const TELEGRAM_LOGO = `${STATIC_ROOT}/logos/telegram-white.svg`
export const TELEGRAM_URL = "https://t.me/opensea_io"
export const TWITTER_LOGO = `${STATIC_ROOT}/logos/twitter-white.svg`
export const TWITTER_URL = "https://twitter.com/opensea"

export const MAIL_ICON = `${STATIC_ROOT}/logos/mail-white.svg`

export const ADVERTISEMENT_URL = "https://devinfinzer.typeform.com/to/z1f4Bx"
export const CONTACT_EMAIL_ADDRESS = "contact@opensea.io"
export const SUPPORT_URL =
  "https://openseahelp.zendesk.com/hc/en-us/requests/new"
export const DEVELOPER_DOCS_FAQ_URL =
  "https://docs.opensea.io/v1.0/docs/frequently-asked-questions"
export const DEVELOPER_DOCS_URL = "https://docs.opensea.io/docs"
export const DEVELOPERS_URL = "https://docs.opensea.io"
export const ERC_20_LISTING_REQUEST_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSc-hrjRtMO0bNJQ_NKFhs_rPrv6g6cKL-AVS-0NvuRU4HXkrQ/viewform?usp=sf_link"
export const JOB_URL = "https://jobs.lever.co/OpenSea"
export const NOLT_URL = "https://opensea.nolt.io/"
export const SDK_AFFILIATE_URL =
  "https://github.com/ProjectOpenSea/opensea-js#affiliate-program"
export const SDK_URL = "https://github.com/ProjectOpenSea/opensea-js"
export const SHIPS_LOG_URL = "https://github.com/ProjectOpenSea/ships-log"

export const BIDDING_BLOG_POST_URL =
  "https://opensea.io/blog/announcements/bid-on-your-favorite-crypto-collectibles-16f07908b214/"
export const BOUNTIES_BLOG_POST_URL =
  "https://opensea.io/blog/tutorials/earning-bounties-an-introduction-to-opensea-s-affiliate-program-599191d9ae5d/"
export const FIRST_FUNDRAISING_ANNOUNCEMENT =
  "https://opensea.io/blog/announcements/opensea-raises-2-million/"
export const COLLECTION_MANAGER_POST_URL =
  "https://opensea.io/blog/announcements/introducing-the-collection-manager/"
export const SECOND_FUNDRAISING_ANNOUNCEMENT =
  "https://opensea.io/blog/announcements/bringing-on-additional-strategic-investors-to-opensea/"
export const SELLING_BLOG_POST_URL =
  "https://opensea.io/blog/tutorials/sell-your-crypto-collectibles-without-paying-gas-77d2a7477612/"

export const DAI_VIDEO_URL = "https://www.youtube.com/watch?v=kAshxmsC4F4"
export const MARKDOWN_REFERENCE = "https://www.markdownguide.org/cheat-sheet/"
export const METADATA_STANDARDS_URL =
  "https://docs.opensea.io/docs/metadata-standards"
export const WORDPRESS_IFRAME_INSTRUCTIONS_URL =
  "https://themegrill.com/blog/wordpress-iframe/"

export const OPENSEA_URL = `https://opensea.io`
export const OPENSEA_TESTNETS_URL = `https://testnets.opensea.io`
export const OPENSEA_LOCALHOST_URL = `http://localhost:3000`
export const OPENSEA_API_URL = `https://api.opensea.io`
export const OPENSEA_TESTNETS_API_URL = `https://testnets-api.opensea.io`

// 60 is for ETH. see https://github.com/satoshilabs/slips/blob/master/slip-0044.md

export const METAMASK_URL = "https://metamask.io/download.html"
export const METAMASK_MOBILE_URL = "https://metamask.app.link/dapp/"
export const COINBASE_WALLET_URL = "https://wallet.coinbase.com/"
export const OPERA_TOUCH_URL = "https://www.opera.com/mobile/touch"
export const SPACE_SUIT_DOCS_URL =
  "https://github.com/spacesuit-extension/SpaceSuit#how-do-i-access-other-accounts-on-my-ledger-i-can-only-get-to-the-first-one"
export const SPACE_SUIT_URL =
  "https://chrome.google.com/webstore/detail/spacesuit/ogonghphdgcdealjfknchhgiaabendkl"
export const TRUST_WALLET_URL =
  "https://link.trustwallet.com/open_url?coin_id=60&url="

export const DEFAULT_TWITTER_MESSAGE =
  "Look what I just discovered on @opensea! #nft #opensea"
export const DEFAULT_ACCOUNT_TWITTER_MESSAGE =
  "Check out this account on OpenSea"

export const ethCurrencyImg = "/static/images/icons/ETH.png"
export const wethCurrencyImg = "/static/images/icons/WETH.png"
export const usdCurrencyImg = "/static/images/icons/USD.png"

export const WETH_URL =
  "https://support.opensea.io/hc/en-us/articles/360063498293-What-s-WETH-How-do-I-get-it-"
export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
export const ETHERSCAN_BALANCE_CHECKER_TOOL =
  "https://etherscan.io/balancecheck-tool"

export const JOSHUA_HEADSHOT = `${STATIC_ROOT}/personnel/joshua.jpg`

export const COMPANY_ADDRESS = "105 East 24th St. Apmt 4D, New York, NY 10010"
export const TERRORIST_LIST_URL =
  "https://www.state.gov/foreign-terrorist-organizations/"
export const TERMS_OF_SERVICE_POSTED_DATE = "June 1, 2021"
export const TERMS_OF_SERVICE_EFFECTIVE_DATE = "June 8, 2021"

// Partners
export const BLOCKCHAIN_CAPITAL_URL = "http://blockchain.capital/"
export const BLOCKSTACK_URL = "https://blockstack.org/"
export const FOUNDERS_FUND_URL = "https://foundersfund.com/"
export const NFT_KRED_URL = "https://www.nft.kred/"
export const ONE_CONFIRMATION_URL = "https://www.1confirmation.com/"
export const QUANTSTAMP_URL = "https://www.quantstamp.com/"
export const TRUST_WALLET_HOMEPAGE_URL = "https://trustwallet.com/"
export const YC_URL = "http://www.ycombinator.com/"

export const NFT_KRED_LOGO = `${STATIC_ROOT}/logos/nft-kred-logo.png`

export const IS_NEW_CUTOFF_DAYS = 21

// Delete their names and get that from the graphql info
export const CATEGORIES = [
  {
    slug: "art",
    name: "Art",
    text: "An online community of makers, developers, and traders is pushing the art world into new territory. Discover the world's top crypto artists.",
  },
  {
    slug: "music",
    name: "Music",
    text: "Music NFTs are changing the way fans connect with their favorite artists. Explore collections from 3LAU, Imogen Heap, and more.",
  },
  {
    slug: "domain-names",
    name: "Domain Names",
    text: "Buy and sell domain names from the Ethereum Name Service (ENS), Unstoppable Domains, and Decentraland Names on OpenSea.",
  },
  {
    slug: "virtual-worlds",
    name: "Virtual Worlds",
    text: "Buy and sell land parcels and wearables from projects like Decentraland, Cryptovoxels and Somnium Space.",
  },
  {
    slug: "trading-cards",
    name: "Trading Cards",
    text: "Classic games are taking on a new life on the blockchain. Buy and sell digital trading cards from projects like Sorare, Gods Unchained, and $MEME.",
  },
  {
    slug: "collectibles",
    name: "Collectibles",
    text: "Kittens, punks, and memes are being traded through digital wallets. Own and sell rare NFTs like CryptoKitties, Axie Infinity, and more.",
  },
  {
    slug: "sports",
    name: "Sports",
    text: "Browse, buy, and sell non-fungible tokens from the world's top sporting brands in golf, football, auto, racing, and more.",
  },
  {
    slug: "utility",
    name: "Utility",
    text: "Through redeemable rewards, membership NFTs, and other utility tokens, creators are using the blockchain to build their communities.",
  },
] as const

export type CategorySlug = typeof CATEGORIES[number]["slug"] | "new"

export type MainnetChainIdentifier =
  | "ETHEREUM"
  | "MATIC"
  | "KLAYTN"
  | "XDAI"
  | "BSC"
  | "FLOW"
export type TestnetChainIdentifier =
  | "LOCAL"
  | "RINKEBY"
  | "MUMBAI"
  | "BAOBAB"
  | "BSC_TESTNET"
  | "GOERLI"
export type LocalChainIdentifier = "LOCAL"

export type ChainIdentifier =
  | MainnetChainIdentifier
  | TestnetChainIdentifier
  | LocalChainIdentifier
  | "%future added value"

export const MAINNET_CHAIN_IDENTIFIERS: ChainIdentifier[] = [
  "ETHEREUM",
  "MATIC",
  "KLAYTN",
]
export const SUPPORTED_GET_LISTED_MAINNET_CHAIN_IDENTIFIERS: ChainIdentifier[] =
  ["ETHEREUM", "MATIC", "KLAYTN"]

export const TESTNET_CHAIN_IDENTIFIERS: ChainIdentifier[] = [
  "RINKEBY",
  "MUMBAI",
  "BAOBAB",
  "BSC_TESTNET",
  "GOERLI",
]
export const SUPPORTED_GET_LISTED_TESTNET_CHAIN_IDENTIFIERS: ChainIdentifier[] =
  ["RINKEBY", "MUMBAI", "BAOBAB"]

export const MAINNET_TO_TESTNET_CHAIN_IDENTIFIERS: Record<
  MainnetChainIdentifier,
  TestnetChainIdentifier | null
> = {
  ETHEREUM: "RINKEBY",
  MATIC: "MUMBAI",
  BSC: "BSC_TESTNET",
  KLAYTN: "BAOBAB",
  XDAI: null,
  FLOW: null,
}

export const TESTNET_TO_MAINNET_CHAIN_IDENTIFIERS = reverse(
  MAINNET_TO_TESTNET_CHAIN_IDENTIFIERS,
)

export const CANONICAL_CHAIN_IDENTIFIERS: Record<
  ChainIdentifier,
  ChainIdentifier
> = {
  // Mainnet
  ETHEREUM: "ETHEREUM",
  MATIC: "ETHEREUM",
  KLAYTN: "KLAYTN",
  BSC: "ETHEREUM",
  XDAI: "ETHEREUM",
  FLOW: "FLOW",

  // Testnet
  RINKEBY: "RINKEBY",
  MUMBAI: "GOERLI",
  BAOBAB: "BAOBAB",
  BSC_TESTNET: "RINKEBY",
  GOERLI: "GOERLI",

  // Local
  LOCAL: "LOCAL",

  "%future added value": "%future added value",
}

export const EVM_CHAIN_IDENTIFIERS: ChainIdentifier[] = [
  "ETHEREUM",
  "MATIC",
  "BSC",
  "LOCAL",
  "RINKEBY",
  "MUMBAI",
  "BAOBAB",
  "BSC_TESTNET",
  "GOERLI",
]

export const CHAIN_IDENTIFIER_ENUM_MAPPING: Record<ChainIdentifier, string> = {
  BAOBAB: "baobab",
  BSC: "bsc",
  BSC_TESTNET: "bsctestnet",
  ETHEREUM: "ethereum",
  FLOW: "flow",
  KLAYTN: "klaytn",
  MATIC: "matic",
  MUMBAI: "mumbai",
  RINKEBY: "rinkeby",
  XDAI: "xdai",
  GOERLI: "goerli",
  LOCAL: "local",
  "%future added value": "",
}

export const CHAIN_IDENTIFIERS_TO_NAMES: Record<ChainIdentifier, string> = {
  BAOBAB: "Baobab",
  BSC: "Binance Smart Chain",
  BSC_TESTNET: "BSC Testnet",
  ETHEREUM: "Ethereum",
  FLOW: "Flow",
  KLAYTN: "Klaytn",
  MATIC: "Polygon",
  MUMBAI: "Mumbai",
  RINKEBY: "Rinkeby",
  XDAI: "xDai",
  GOERLI: "Goerli",
  LOCAL: "Local",
  "%future added value": "",
}

interface ChainBaseInformation {
  logo: string
  url: string
}
interface ChainInformation extends ChainBaseInformation {
  getTransactionUrl: (transactionHash: string) => string
}

const ETHEREUM_INFO = {
  logo: "/static/images/logos/ethereum.png",
  url: "https://ethereum.org/en/",
}
const MATIC_INFO = {
  logo: "/static/images/logos/polygon.svg",
  url: "https://matic.network/",
}
const KLAYTN_INFO = {
  logo: "/static/images/logos/klaytn.png",
  url: "https://www.klaytn.com/",
}
const BSC_INFO = {
  logo: "/static/images/logos/bsc.png",
  url: "https://www.binance.org/en/smartChain",
}
const XDAI_INFO = {
  logo: "/static/images/logos/xdai.png",
  url: "https://www.xdaichain.com/",
}
const FLOW_INFO = {
  logo: "/static/images/logos/flow.png",
  url: "https://www.onflow.org/",
}
const GOERLI_INFO = {
  logo: "",
  url: "",
}
const LOCAL_INFO: ChainBaseInformation = {
  logo: "",
  url: "",
}

export const CHAIN_IDENTIFIER_INFORMATION: Record<
  ChainIdentifier,
  ChainInformation
> = {
  ETHEREUM: {
    ...ETHEREUM_INFO,
    getTransactionUrl: transactionHash =>
      `https://etherscan.io/tx/${transactionHash}`,
  },
  RINKEBY: {
    ...ETHEREUM_INFO,
    getTransactionUrl: transactionHash =>
      `https://${RINKEBY_ETHERSCAN_HOST}/tx/${transactionHash}`,
  },

  MATIC: {
    ...MATIC_INFO,
    getTransactionUrl: transactionHash =>
      `https://explorer.matic.network/tx/${transactionHash}`,
  },
  MUMBAI: {
    ...MATIC_INFO,
    getTransactionUrl: transactionHash =>
      `https://explorer-mumbai.maticvigil.com/tx/${transactionHash}`,
  },
  GOERLI: {
    ...GOERLI_INFO,
    getTransactionUrl: transactionHash =>
      `https://goerli.etherscan.io/tx/${transactionHash}`,
  },

  KLAYTN: {
    ...KLAYTN_INFO,
    getTransactionUrl: transactionHash =>
      `https://scope.klaytn.com/tx/${transactionHash}`,
  },
  BAOBAB: {
    ...KLAYTN_INFO,
    getTransactionUrl: transactionHash =>
      `https://baobab.scope.klaytn.com/tx/${transactionHash}`,
  },

  BSC: {
    ...BSC_INFO,
    getTransactionUrl: transactionHash =>
      `https://bscscan.com/tx/${transactionHash}`,
  },
  BSC_TESTNET: {
    ...BSC_INFO,
    getTransactionUrl: transactionHash =>
      `https://testnet.bscscan.com/tx/${transactionHash}`,
  },

  XDAI: {
    ...XDAI_INFO,
    getTransactionUrl: transactionHash =>
      `https://blockscout.com/poa/xdai/tx/${transactionHash}`,
  },

  FLOW: {
    ...FLOW_INFO,
    getTransactionUrl: transactionHash => `flow://tx/${transactionHash}`,
  },

  LOCAL: {
    ...LOCAL_INFO,
    getTransactionUrl: () => {
      throw new Error("Not implemented")
    },
  },

  "%future added value": {
    logo: "",
    url: "",
    getTransactionUrl: () => "",
  },
}

export const LANGUAGES = {
  en: "English",
  ja: "日本語",
  ko: "한국어",
} as const

export type Language = keyof typeof LANGUAGES

export const SUPPORTED_LANGUAGES: Language[] = IS_PRODUCTION
  ? ["en", "ja", "ko"]
  : ["en", "ja", "ko"]

export const I18N_FLAGS: { [K in Language]: string } = {
  en: "/static/images/flags/usa.svg",
  ja: "/static/images/flags/jpn.svg",
  ko: "/static/images/flags/kor.svg",
}

export const UNISWAP_URL = "https://app.uniswap.org/#/swap"

const MOONPAY_KEY = IS_PRODUCTION
  ? "pk_live_IdYWVj39NNgSrt2t9jBPSgwl9outsydU"
  : "pk_test_U2NZxUmZdjbShj9pQbmtQaLEgVduYsj8"
const MOONPAY_WIDGET_BASE_QS = qs.stringify(
  {
    apiKey: MOONPAY_KEY,
    colorCode: "%232081E2",
  },
  { encode: false },
)
export const MOONPAY_API_BASE_QS = qs.stringify(
  {
    apiKey: MOONPAY_KEY,
  },
  { encode: false },
)

export const MOONPAY_WIDGET_URL = IS_PRODUCTION
  ? `https://buy.moonpay.com?${MOONPAY_WIDGET_BASE_QS}`
  : `https://buy-staging.moonpay.com?${MOONPAY_WIDGET_BASE_QS}`

export const MOONPAY_API_BASE_URL = "https://api.moonpay.com"
export const MOONPAY_API_CHECK_IP_URL = `${MOONPAY_API_BASE_URL}/v4/ip_address?${MOONPAY_API_BASE_QS}`

export const MOONPAY_SUPPORTED_COINS: string[] = [
  "ADA",
  "BAT",
  "DAI",
  "ENJ",
  "EOS",
  "ETH",
  "KLAY",
  "LINK",
  "LTC",
  "MANA",
  "MATIC",
  "NEO",
  "ONT",
  "PAX",
  "SAND",
  "TRX",
  "TUSD",
  "UNI",
  "USDC",
  "WBTC",
]

export const TEST_MULTICHAIN_COLLECTIONS = [
  "ethermon",
  "neon-district-season-one-item",
  "matic-erc1155-meta-transaction-sample",
  "mumbai-creatures-v2",
  "mumbai-erc721-meta-transaction-sample",
  "mumbai-erc1155-meta-transaction-sample",
  "mattyc-wearables",
  "mycryptosaga",
  "tweets",
  "marblecardspolygon",
  "artvatars",
]

export const BLACKLISTED_META_TRANSACTION_CONTRACTS = [
  "0xf795abb0e5a5b04be3705887ac7e078ea7a2d92e",
  "0x7eedf032a24579935043b1794c0eeb00872a1e5d",
  "0x46545041c71fb175c2237b7040680101375d38d9",
  "0xabeb903b3e8363577108283d69782f234a1fe7f0",
  "0x6105f0f5ef8b28cf81e64551588d13221d4151ad",
  "0xf6d8e606c862143556b342149a7fe0558c220375",
  "0xc73b75640bac8bced8829d07aa57e694b446b3f9",
  "0x07899fe3c061a4485d11d8d81bcb9f98bbb13d68",
  "0xe9e86941b23fbe9d8f4dd0c5b7e5f89722936878",
  "0xa4b33f44addd9732b7e9c33c7621f2f1d983a78a",
  "0x35322134ec933d55797930d0c045b51c2203cbae",
  "0x53ac5ed41bfe023c8b0ee5c80380d19756af7df9",
  "0x76377a9e94853f1968bccd9a1b8fbf3f6fdf1726",
  "0x2550159992f6ea90f1187bd803d60613e9c1a4d1",
  "0xdb3f95e907dc8a02096ab2c2b994466b3b7424e8",
]

export const BLACKLISTED_META_TRANSACTION_COLLECTIONS = [
  "blacklisted-meta-transaction-collection",
  "0xfd1dbd4114550a867ca46049c346b6cd452ec919",
  "battle-racers-matic",
  "bfsc",
  "cryptopick-official",
  "game-credits-erc721",
  "logan-paul-digital-collectibles",
  "non-fungible-matic-v2",
  "polygon-thunder-2021",
  "pride-2021",
]

export type WalletConfiguration = {
  installLink?: string
  supports: WalletSupport
  featureFlags?: FeatureFlag[]
  logo: string
  alternativeLogo: string
}

const WALLET_CONFIGURATIONS: Record<WALLET_NAME, WalletConfiguration> = {
  [WALLET_NAME.Native]: {
    supports: WalletSupport.BOTH,
    logo: "",
    alternativeLogo: "",
  },
  [WALLET_NAME.MetaMask]: {
    supports: WalletSupport.BOTH,
    installLink: METAMASK_URL,
    logo: METAMASK_LOGO,
    alternativeLogo: METAMASK_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Bitski]: {
    supports: WalletSupport.BOTH,
    logo: BITSKI_LOGO,
    alternativeLogo: BITSKI_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Fortmatic]: {
    supports: WalletSupport.BOTH,
    logo: FORTMATIC_LOGO,
    alternativeLogo: FORTMATIC_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.WalletConnect]: {
    supports: WalletSupport.BOTH,
    logo: WALLETCONNECT_LOGO,
    alternativeLogo: WALLETCONNECT_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.CoinbaseWallet]: {
    supports: WalletSupport.BOTH,
    logo: COINBASE_WALLET_LOGO,
    alternativeLogo: COINBASE_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.OperaTouch]: {
    supports: WalletSupport.MOBILE,
    logo: OPERA_TOUCH_LOGO,
    alternativeLogo: OPERA_TOUCH_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Trust]: {
    supports: WalletSupport.MOBILE,
    logo: TRUST_WALLET_LOGO,
    alternativeLogo: TRUST_WALLET_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Arkane]: {
    supports: WalletSupport.BOTH,
    logo: ARKANE_LOGO,
    alternativeLogo: ARKANE_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Dapper]: {
    supports: WalletSupport.DESKTOP,
    installLink: DAPPER_LINK,
    logo: DAPPER_LOGO,
    alternativeLogo: DAPPER_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Authereum]: {
    supports: WalletSupport.BOTH,
    logo: AUTHEREUM_LOGO,
    alternativeLogo: AUTHEREUM_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Torus]: {
    supports: WalletSupport.BOTH,
    logo: TORUS_LOGO,
    alternativeLogo: TORUS_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Portis]: {
    supports: WalletSupport.BOTH,
    logo: PORTIS_LOGO,
    alternativeLogo: PORTIS_ALTERNATIVE_LOGO,
  },
  [WALLET_NAME.Kaikas]: {
    supports: WalletSupport.DESKTOP,
    installLink: KAIKAS_URL,
    logo: "/static/images/logos/kaikas.png",
    alternativeLogo: "/static/images/logos/kaikas-alternative.png",
  },
}

export const getWalletConfiguration = (
  walletName: WALLET_NAME,
): WalletConfiguration => {
  return WALLET_CONFIGURATIONS[walletName]
}

export const ALL_WALLETS = Object.keys(WALLET_CONFIGURATIONS).filter(
  walletName => walletName !== WALLET_NAME.Native,
) as WALLET_NAME[]

export const DESKTOP_WALLETS = ALL_WALLETS.filter(walletName => {
  const { supports } = getWalletConfiguration(walletName as WALLET_NAME)
  return supports === WalletSupport.BOTH || supports === WalletSupport.DESKTOP
}) as WALLET_NAME[]

export const MOBILE_WALLETS = ALL_WALLETS.filter(walletName => {
  const { supports } = getWalletConfiguration(walletName as WALLET_NAME)
  return supports === WalletSupport.BOTH || supports === WalletSupport.MOBILE
}) as WALLET_NAME[]

export const HOME_PAGE_HEADING =
  "Discover, collect, and sell extraordinary NFTs"

export const HOME_PAGE_SUBHEADING =
  "on the world's first & largest NFT marketplace"
