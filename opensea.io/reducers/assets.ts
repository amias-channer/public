import BigNumber from "bignumber.js"
import _ from "lodash"
import {
  AssetContractType,
  OrderSide,
  TokenStandardVersion,
  WyvernSchemaName,
} from "opensea-js/lib/types"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { captureNoncriticalError } from "../lib/analytics/analytics"
import { getAddress, GODS_UNCHAINED_CARD_CONTRACT } from "../lib/contracts"
import { ETH_DECIMALS, bn } from "../lib/helpers/numberUtils"
import { keys } from "../lib/helpers/object"
import {
  formatImageUrl,
  getStaticImageUrlFromOptions,
  truncateText,
} from "../lib/helpers/stringUtils"
import { Account, buildAccount } from "./accounts"
import {
  buildAuction,
  buildBidderCommitment,
  buildOrder,
  computeCurrentPriceAuction,
  EscrowAuction,
  ExtendedOrder,
  formatOrders,
  getOrderPrices,
  Tradeable,
} from "./auctions"
import { Bundle } from "./bundles"
import { buildCategory } from "./categories"
import { buildEvent } from "./events"
import { buildToken } from "./tokens"

export interface Trait {
  trait_type: string
  trait_count?: number
  value: string | number
  max_value?: number
  display_type: string
}

export type Owner = Required<Pick<Account, "address">> & Account

export interface AssetOwnership {
  owner: Owner
  // Undefined if we don't know the quantity they own from their sell order
  quantity?: BigNumber
  sellOrder?: ExtendedOrder
}

export interface Asset extends Tradeable {
  // TODO deprecate
  owner?: string
  ownerAccount?: Owner

  bundle?: Bundle

  imageUrl?: string
  imageUrlThumbnail?: string
  imageUrlLarge?: string
  animationUrl?: string

  tokenAddress?: string
  version?: TokenStandardVersion
  decimals?: number
  tokenId?: string
  tokenMetadata?: any
  tokenSymbol?: string
  tokenName?: string
  tokenImage?: string

  backgroundImage?: string

  numSales?: number
  rarityScore?: number

  lastSale?: any
  events?: any[]
  traits?: Trait[]

  auction?: EscrowAuction
  visitorStats?: object

  isPresale?: boolean
  presaleDisabled?: boolean

  // For fungible assets
  ownership?: AssetOwnership
  allOwnerships?: AssetOwnership[]
}

const initialState: Asset = {}
let _lastAsset: Asset = {}

export const NOT_TRANSFERRABLE_TO_OWNER = ["Axie", "Decentraland"]

function AssetsReducer(state = initialState, action: AnyAction): Asset {
  let currentAuction
  let currentSellOrder
  let priceParameters

  switch (action.type) {
    case ActionTypes.RECEIVE_ASSET:
      if (action.data) {
        return buildAsset(action.data)
      } else {
        console.warn("losing asset")
        return initialState
      }

    case ActionTypes.RECEIVE_ASSET_OWNERSHIP:
      if (action.data && action.data.ownership) {
        return buildAsset(action.data)
      } else {
        return state
      }

    case ActionTypes.UPDATE_ORDER:
      if (action.data.side == OrderSide.Sell) {
        return {
          ...state,
          primarySellOrder: buildOrder(action.data),
        }
      } else {
        return {
          ...state,
          primaryBuyOrder: buildOrder(action.data),
        }
      }

    case ActionTypes.UPDATE_PRICE:
      currentAuction = state.auction
      currentSellOrder = state.primarySellOrder

      if (currentAuction) {
        return {
          ...state,
          auction: {
            ...currentAuction,
            currentPrice: computeCurrentPriceAuction(null, currentAuction),
          },
        }
      } else if (currentSellOrder) {
        priceParameters = getOrderPrices(currentSellOrder as any, true)
        return {
          ...state,
          primarySellOrder: {
            ...currentSellOrder,
            ...priceParameters,
          },
        }
      } else {
        return state
      }

    case ActionTypes.BOOTSTRAP_ASSET:
      return action.asset

    case ActionTypes.BOOTSTRAP_ASSETV2:
      return action.data

    case ActionTypes.RESET_ASSET:
      return initialState

    default:
      return state
  }
}

/**
 * Build an asset object using data from the API
 * @param assetData Data from the API
 */
export function buildAsset(assetData: any, prefetchedOwner?: Account): Asset {
  if (assetData.is_bundle || assetData.token_id == null) {
    // Temporary measure to track down tricky bug with buildAsset getting called with non-asset data
    captureNoncriticalError(new Error(`Got a non-asset when expected an asset`))
    return _lastAsset
  }
  const { auctions, events } = assetData
  // Fungibles don't have owners
  const asset_contract = assetData.asset_contract || {}

  const tokenIdStr = assetData.token_id_str
    ? assetData.token_id_str
    : assetData.token_id.toString()

  const transferFeeToken = assetData.transfer_fee_payment_token
    ? buildToken(assetData.transfer_fee_payment_token)
    : undefined
  const assetContract = buildCategory(asset_contract.collection, asset_contract)
  const collection = assetData.collections?.length
    ? buildCategory(assetData.collections[0])
    : assetData.collection
    ? buildCategory(assetData.collection)
    : assetContract

  const nameDefault = `${truncateText(collection.name || "")} #${truncateText(
    tokenIdStr,
    8,
  )}`
  const assetName = assetData.name ? assetData.name.toString() : nameDefault
  const assetDescription = assetData.description
    ? assetData.description.toString()
    : undefined
  const auction =
    auctions && auctions.length ? buildAuction(auctions[0], false) : undefined
  const supportsOpenSeaEscrow =
    assetContract.listingsEnabled &&
    assetContract.settlementEnabled &&
    assetContract.type === AssetContractType.NonFungible
  const ownership = assetData.ownership
    ? buildAssetOwnership(assetData.ownership)
    : undefined
  const otherOwnerships = assetData.top_ownerships
    ? assetData.top_ownerships.map(buildAssetOwnership)
    : []
  const ownerAccount = prefetchedOwner
    ? prefetchedOwner
    : ownership
    ? // Prefetched FTs and Semi-fungibles
      ownership.owner
    : otherOwnerships.length == 1
    ? // Semi-fungible NFTs
      otherOwnerships[0].owner
    : auction
    ? // Escrowed assets
      auction.sellerAccount
    : assetData.owner
    ? // NFTs
      buildAccount(assetData.owner)
    : {}

  const asset: Asset = {
    owner: ownerAccount.address,
    ownership: ownership,
    allOwnerships: [...otherOwnerships, ...(ownership ? [ownership] : [])],
    ownerAccount: ownerAccount,

    version: assetContract.version,
    decimals: assetData.decimals || 0,
    tokenId: tokenIdStr,
    tokenMetadata: assetData.token_metadata,
    tokenSymbol: assetContract.symbol,
    tokenName: collection.name,
    tokenAddress: assetContract.address,
    tokenImage: collection.imageUrl,
    name: assetName,
    nameShort: truncateText(assetName),
    nameDefault: nameDefault,
    description: assetDescription,
    imageUrl: formatImageUrl(
      assetData.image_preview_url,
      assetData.image_url,
      true,
    ),
    imageUrlStatic: getStaticImageUrlFromOptions([
      assetData.image_preview_url,
      assetData.image_thumbnail_url,
    ]),
    imageUrlLarge: formatImageUrl(
      assetData.image_url,
      assetData.image_original_url,
    ),
    imageUrlThumbnail: formatImageUrl(
      assetData.image_thumbnail_url,
      assetData.image_preview_url || collection.imageUrl,
    ),

    animationUrl: assetData.animation_url || assetData.video_url,

    externalLink: assetData.external_link,
    rarityScore: assetData.rarity_score,
    numSales: assetData.num_sales,
    lastSale:
      assetData.last_sale && assetData.last_sale.total_price
        ? buildEvent(assetData.last_sale)
        : null,
    assetContract: assetContract,
    collection: collection,
    backgroundColor: assetData.background_color
      ? assetData.background_color
      : undefined,

    auction: auction,

    events: events && events.length ? events.map(buildEvent) : undefined,

    visitorStats: assetData.visitor_stats
      ? buildVisitorStats(assetData.visitor_stats)
      : {},

    isPresale: assetData.is_presale,
    presaleDisabled: false,

    listingsEnabled:
      (assetData.supports_wyvern || supportsOpenSeaEscrow) &&
      assetContract.listingsEnabled,
    isFungible:
      asset_contract["asset_contract_type"] == AssetContractType.Fungible,
    isSemiFungible:
      asset_contract["asset_contract_type"] == AssetContractType.SemiFungible,
    isNonFungible:
      asset_contract["asset_contract_type"] == AssetContractType.NonFungible,

    link: `/assets/${assetContract.address}/${tokenIdStr}`,

    // Only if prefetched
    topBidAmount: assetData.top_bid
      ? bn(assetData.top_bid, ETH_DECIMALS)
      : undefined,

    isTransferrableToOwner: !NOT_TRANSFERRABLE_TO_OWNER.includes(
      asset_contract["name"],
    ),
    isTransferrableByOwner: !(
      asset_contract["schema_name"] == WyvernSchemaName.ERC721 &&
      ["1.0", "2.0"].includes(asset_contract["nft_version"])
    ),

    transferFeeToken: transferFeeToken,
    transferFee: assetData.transfer_fee
      ? bn(assetData.transfer_fee, transferFeeToken?.decimals)
      : undefined,

    highestBuyerCommitment: buildBidderCommitment(
      assetData["highest_buyer_commitment"],
    ),
  }

  // Old Nifty Gateway code
  asset.defaultToFiat = false

  formatOrders(asset, assetData, true)
  formatTraits(asset, assetData)

  const hasNonsingleQuantity =
    asset.allOwnerships &&
    _(asset.allOwnerships.filter(o => !!o.quantity))
      .uniqBy(o => o.owner.address)
      .sumBy(o => +o.quantity!) > 1
  asset.useFungibleLayout =
    (asset.isFungible || asset.isSemiFungible) && hasNonsingleQuantity

  // Delete undefined keys to keep amplitude tracking request sizes low
  keys(asset).forEach(k => asset[k] === undefined && delete asset[k])
  _lastAsset = asset
  return asset
}

function formatTraits(asset: Asset, assetData: any) {
  asset.traits = assetData.traits
  if (asset.traits) {
    const twitterTrait = asset.traits.find(t => t.trait_type == "twitter")
    const instagramTrait = asset.traits.find(t => t.trait_type == "instagram")
    const backgroundImageTrait = asset.traits.find(
      t => t.trait_type == "background_image",
    )
    asset.twitterHandle = twitterTrait
      ? (twitterTrait.value as string)
      : undefined
    asset.instagramHandle = instagramTrait
      ? (instagramTrait.value as string)
      : undefined
    asset.backgroundImage = backgroundImageTrait
      ? (backgroundImageTrait.value as string)
      : undefined
  }

  if (asset.twitterHandle == "@hellodapper") {
    // Disable Nifty Gateway for dapper ones
    asset.defaultToFiat = false
  }
}

// Compare against the contract address instead of the name to intentionally exclude chests.
export const isGodsUnchainedCard = ({
  tokenAddress,
}: {
  tokenAddress?: string
}) => {
  return tokenAddress === getAddress(GODS_UNCHAINED_CARD_CONTRACT)
}

export const isDecentralandWearables = ({
  tokenName,
}: {
  tokenName?: string
}) => {
  return tokenName === "Decentraland Wearables"
}

export const isSandboxAsset = ({ tokenName }: { tokenName?: string }) => {
  return tokenName === "The Sandbox"
}

export const isIcecapAddress = (tokenAddress: string) => {
  return tokenAddress === "0x3fa2bc8c8aa9e2706c3b5c17359a104aa412e3cc"
}

export const isFoundationAddress = (tokenAddress: string) => {
  return tokenAddress === "0x3b3ee1931dc30c1957379fac9aba94d1c48a5405"
}

export const isArtBlocksAddress = (tokenAddress: string) => {
  return (
    tokenAddress === "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270" ||
    tokenAddress === "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a"
  )
}

function buildAssetOwnership(assetOwnershipData: any): AssetOwnership {
  return {
    owner: buildAccount(assetOwnershipData.owner) as Owner,
    quantity: new BigNumber(assetOwnershipData.quantity),
  }
}

function buildVisitorStats(data: any) {
  return {
    rank: data.rank,
  }
}

export default AssetsReducer
