import _ from "lodash"
import {
  AssetContractType,
  TokenStandardVersion,
  WyvernSchemaName,
} from "opensea-js/lib/types"
import { STATIC_ROOT } from "../constants"
import { EventSubscription, buildEventSubscriptions } from "./events"
import { Token, buildToken } from "./tokens"

export const NAVBAR_OVERLAYS: { [categorySlug: string]: string } = {
  cheesewizard: `${STATIC_ROOT}/landing/cheeze-dripping.png`,
}

export interface CategoryStats {
  averagePrice: number
  count: number
  itemsSold: number
  marketCap: number
  numOwners: number
  sevenDayChange: number
  sevenDayVolume: number
  totalVolume: number
}

export const STATS_TO_MERGE_ADDITIVELY: Array<keyof CategoryStats> = [
  "count",
  "itemsSold",
  "marketCap",
  "sevenDayVolume",
  "totalVolume",
  "numOwners",
]

interface NumericTrait {
  min: number
  max: number
}

interface StringTrait {
  [trait_value: string]: number
}

export interface TraitStats {
  [trait_name: string]: NumericTrait | StringTrait
}

export type CardDisplayStyle = "cover" | "contain" | "padded"

export interface AssetContract {
  createdDate?: string
  name?: string
  symbol?: string
  openseaVersion?: string

  address: string
  version: TokenStandardVersion
  settlementEnabled: boolean
  listingsEnabled: boolean
  type: AssetContractType
  schemaName: WyvernSchemaName
  subscriptions: EventSubscription[]
}

export interface Category extends Partial<AssetContract> {
  slug?: string // Collection identifier
  createdDate?: string

  name?: string
  imageUrl?: string
  largeImageUrl?: string
  externalLink?: string
  description?: string
  shortDescription?: string
  wikiLink?: string
  chatLink?: string
  images?: string[]
  traits?: TraitStats
  featured?: string
  featuredImageUrl?: string
  bannerImageUrl?: string
  navbarOverlayImageUrl?: string
  tokenSymbol?: string
  hidden?: boolean
  safelistRequestStatus?: string
  defaultToFiat?: boolean
  cardDisplayStyle?: CardDisplayStyle
  buyerFeeBasisPoints: number
  sellerFeeBasisPoints: number
  devBuyerFeeBasisPoints: number
  devSellerFeeBasisPoints: number
  openseaBuyerFeeBasisPoints: number
  openseaSellerFeeBasisPoints: number
  onlyProxiedTransfers?: boolean
  payoutAddress?: string
  requireEmail?: boolean
  requireWhitelist?: boolean

  // Sub asset contracts
  assetContracts?: Array<Partial<AssetContract>>

  // Required
  stats: CategoryStats
  subscriptions: EventSubscription[]
  editors: string[]
  paymentTokens: Token[]
}

/**
 * Build a category object using data from the API
 * @param collectionData Data from the API
 * @param contractData Data from the API
 */
export function buildCategory(
  collectionData?: any,
  assetContractData?: any,
): Category {
  const categoryData = collectionData || assetContractData
  const contractSpecificInfo = _buildContractSpecificInfo(
    collectionData,
    assetContractData,
  )

  const devBuyerFeeBasisPoints =
    +categoryData["dev_buyer_fee_basis_points"] || 0
  const devSellerFeeBasisPoints =
    +categoryData["dev_seller_fee_basis_points"] || 0
  const openseaBuyerFeeBasisPoints =
    +categoryData["opensea_buyer_fee_basis_points"] || 0
  const openseaSellerFeeBasisPoints =
    +categoryData["opensea_seller_fee_basis_points"] || 0

  const category: Category = {
    createdDate: categoryData["created_date"],
    slug: categoryData["slug"],
    editors: categoryData["editors"] || [],
    name: categoryData["name"],
    imageUrl: categoryData["image_url"],
    largeImageUrl: categoryData["large_image_url"],
    featuredImageUrl: categoryData["featured_image_url"],
    navbarOverlayImageUrl: NAVBAR_OVERLAYS[categoryData["name"]],
    bannerImageUrl: categoryData["banner_image_url"],
    externalLink: categoryData["external_url"],
    description: categoryData["description"],
    shortDescription: categoryData["short_description"],
    wikiLink: categoryData["wiki_url"],
    chatLink: categoryData["chat_url"],

    images:
      categoryData["display_data"] && categoryData["display_data"]["images"],
    cardDisplayStyle:
      categoryData["display_data"] &&
      categoryData["display_data"]["card_display_style"],

    featured: categoryData["featured"],
    hidden: categoryData["hidden"],
    safelistRequestStatus: categoryData["safelist_request_status"],
    traits: buildTraits(categoryData["traits"]),

    // Order payment tokens so that components can default to the first one
    paymentTokens:
      categoryData["payment_tokens"] &&
      _(categoryData["payment_tokens"])
        .map(buildToken)
        .sortBy(t => t.symbol)
        .sortBy(t => !["WETH", "ETH"].includes(t.symbol))
        .value(),

    buyerFeeBasisPoints: devBuyerFeeBasisPoints + openseaBuyerFeeBasisPoints,
    sellerFeeBasisPoints: devSellerFeeBasisPoints + openseaSellerFeeBasisPoints,
    devBuyerFeeBasisPoints,
    devSellerFeeBasisPoints,
    openseaBuyerFeeBasisPoints,
    openseaSellerFeeBasisPoints,

    requireWhitelist: categoryData["is_subject_to_whitelist"],
    onlyProxiedTransfers: categoryData["only_proxied_transfers"],
    payoutAddress: categoryData["payout_address"],
    requireEmail: categoryData["require_email"],

    ...contractSpecificInfo,
  }
  // Override asset contract stats when API knows the collection stats
  if (categoryData["stats"]) {
    category.stats = buildCategoryStats(categoryData["stats"])
  }

  return category
}

function _buildContractSpecificInfo(
  collectionData?: any,
  _assetContractData?: any,
) {
  const assetContractsData: any[] = _assetContractData
    ? [_assetContractData]
    : collectionData?.asset_contracts ||
      collectionData?.primary_asset_contracts ||
      []
  const mainAssetContractData =
    assetContractsData.sort((a, b) =>
      (b.opensea_version || "").localeCompare(a.opensea_version || ""),
    )[0] || {}
  const listOfContractStats = assetContractsData.map(d =>
    buildCategoryStats(d["stats"]),
  )

  const version = mainAssetContractData["nft_version"]

  const mainAssetContract: AssetContract = {
    address: mainAssetContractData["address"],
    symbol: mainAssetContractData["symbol"],
    openseaVersion: mainAssetContractData["opensea_version"],
    version,
    // TODO: Use API when available
    listingsEnabled: version !== TokenStandardVersion.Unsupported,
    settlementEnabled: version !== TokenStandardVersion.Locked,

    schemaName: mainAssetContractData["schema_name"] as WyvernSchemaName,
    type: mainAssetContractData["asset_contract_type"] as AssetContractType,
    subscriptions: mainAssetContractData["subscriptions"]
      ? buildEventSubscriptions(mainAssetContractData["subscriptions"])
      : [],
  }

  const stats = mergeAssetContractStats(listOfContractStats)

  const assetContracts = assetContractsData.map((d, i) => ({
    name: d["name"],
    address: d["address"],
    stats: listOfContractStats[i],
    type: d["asset_contract_type"] as AssetContractType,
  }))

  const createdDate = mainAssetContractData["created_date"]
  if (createdDate) {
    return {
      ...mainAssetContract,
      createdDate,
      assetContracts,
      stats,
    }
  }
  return {
    ...mainAssetContract,
    assetContracts,
    stats,
  }
}

/**
 * Create stats for a contract/category
 * @param statsData data
 */
export function buildCategoryStats(statsData: any = {}): CategoryStats {
  return {
    averagePrice: statsData["average_price"] || 0,
    count: statsData["count"] || 0,
    itemsSold: statsData["items_sold"] || 0,
    marketCap: statsData["market_cap"] || 0,
    numOwners: statsData["num_owners"] || 0,
    sevenDayChange: statsData["seven_day_change"] || 0,
    sevenDayVolume: statsData["seven_day_volume"] || 0,
    totalVolume: statsData["total_volume"] || 0,
  }
}

export const buildTraits = (traitsData: any): TraitStats | undefined => {
  if (!traitsData) {
    return undefined
  }
  return traitsData
}

// TODO deprecate after collection stat migration
function mergeAssetContractStats(statsList: CategoryStats[]): CategoryStats {
  const ret = buildCategoryStats()
  const defaultInfinity = (n: number) =>
    n === Infinity || Number.isNaN(n) ? 0 : n
  let lastWeekVolume = 0
  statsList.forEach(stats => {
    STATS_TO_MERGE_ADDITIVELY.forEach(k => (ret[k] += stats[k]))
    // STATS_TO_MERGE_WITH_MAX.forEach(k => ret[k] = Math.max(ret[k], stats[k]))
    lastWeekVolume += defaultInfinity(
      stats.sevenDayVolume / (stats.sevenDayChange + 1),
    )
  })
  ret.averagePrice = defaultInfinity(ret.totalVolume / ret.itemsSold)
  ret.sevenDayChange = defaultInfinity(ret.sevenDayVolume / lastWeekVolume) - 1
  return ret
}
