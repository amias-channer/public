import _ from "lodash"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { sortByDemand } from "../lib/helpers/assets"
import { bn } from "../lib/helpers/numberUtils"
import {
  truncateText,
  getStaticImageUrlFromOptions,
} from "../lib/helpers/stringUtils"
import { computeCurrentPrice } from "../lib/wyvern"
import { buildAccount, Account } from "./accounts"
import { buildAsset, Asset, NOT_TRANSFERRABLE_TO_OWNER } from "./assets"
import {
  formatOrders,
  buildOrder,
  Tradeable,
  buildBidderCommitment,
} from "./auctions"
import { buildCategory } from "./categories"
import { buildEvent } from "./events"

export interface Bundle extends Tradeable {
  makerAccount?: Account
  imageUrls?: string[]
  assets?: Array<Required<Asset>>
  slug?: string
  owner?: any
  creating?: boolean
  lastSale?: any
}

const initialState: Bundle = {}

const BundlesReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_BUNDLE:
      return buildBundle(action.data)

    case ActionTypes.BOOTSTRAP_BUNDLE:
      return action.bundle

    case ActionTypes.RESET_BUNDLE:
      return initialState

    case ActionTypes.UPDATE_PRICE:
      if (state.primarySellOrder) {
        return {
          ...state,
          primarySellOrder: {
            ...state.primarySellOrder,
            currentPrice: bn(
              computeCurrentPrice(state.primarySellOrder),
              state.primarySellOrder.paymentTokenContract.decimals,
            ),
          },
        }
      } else {
        return state
      }

    default:
      return state
  }
}

/**
 * Make a Bundle from API data
 * @param bundleData JSON for the bundle
 * @param lastSellOrderData Optional JSON for a prefetched sell order to add ot it
 */
export function buildBundle(bundleData: any, lastSellOrderData?: any): Bundle {
  const makerAccount = bundleData.maker
    ? buildAccount(bundleData.maker)
    : undefined
  const assets = bundleData.assets
    ? (bundleData.assets.map((assetData: any) =>
        buildAsset(assetData, makerAccount),
      ) as Array<Required<Asset>>)
    : undefined
  const topAsset = _.sortBy(assets, sortByDemand())[0]
  const ownerAccounts = _(assets)
    .map(a => a.ownerAccount)
    .uniqBy(a => a.address)
    .value()
  const bundleName = bundleData.name ? bundleData.name.toString() : undefined
  const nameShort = truncateText(bundleName)
  const bundleDescription = bundleData.description
    ? bundleData.description.toString()
    : undefined
  const ownerAccount = ownerAccounts.length == 1 ? ownerAccounts[0] : undefined

  const assetContract = bundleData.asset_contract
    ? buildCategory(
        bundleData.asset_contract.collection,
        bundleData.asset_contract,
      )
    : undefined
  const collection = bundleData.collection
    ? buildCategory(bundleData.collection)
    : undefined

  const imageUrls = assets?.map(a => a.imageUrl) || []

  const bundle: Bundle = {
    // Bundle identifier
    slug: bundleData.slug,
    listingsEnabled: true,
    makerAccount,
    ownerAccount,
    owner: ownerAccount ? ownerAccounts[0].address : undefined,

    assets,
    assetContract,
    collection,

    orders: bundleData.orders
      ? bundleData.orders.map(buildOrder)
      : lastSellOrderData
      ? [buildOrder(lastSellOrderData)]
      : [],

    name: bundleName,
    nameDefault: nameShort,
    nameShort,
    backgroundColor: bundleData.background_color
      ? "#" + bundleData.background_color
      : undefined,
    description: bundleDescription,
    externalLink: bundleData.external_link,
    imageUrls,
    imageUrlStatic: getStaticImageUrlFromOptions([
      ...imageUrls,
      topAsset?.imageUrlStatic,
    ]),
    link: `/bundles/${bundleData.slug}`,
    lastSale: bundleData.last_sale?.total_price
      ? buildEvent(bundleData.last_sale)
      : null,
    isTransferrableToOwner: bundleData.asset_contract
      ? !NOT_TRANSFERRABLE_TO_OWNER.includes(bundleData.asset_contract.name)
      : undefined,

    highestBuyerCommitment: buildBidderCommitment(
      bundleData["highest_buyer_commitment"],
    ),
  }

  formatOrders(bundle, bundleData)

  return bundle
}

export default BundlesReducer
