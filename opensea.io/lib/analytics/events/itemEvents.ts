import { FragmentRef } from "relay-runtime"
import { ChainIdentifier, IS_SERVER } from "../../../constants"
import { Asset } from "../../../reducers/assets"
import { itemEvents_data } from "../../graphql/__generated__/itemEvents_data.graphql"
import { ReportReason } from "../../graphql/__generated__/ToolbarReportMutation.graphql"
import { graphql } from "../../graphql/graphql"
import { inlineFragmentize } from "../../graphql/inline"
import { DeepPartial, IndexSignatureHack, Maybe } from "../../helpers/type"
import { getPageTrackingFn, getTrackingFn } from "../utils"

type Item = {
  address: string
  chainIdentifier: ChainIdentifier
  tokenId: string
}

type AnalyticsAsset = Pick<itemEvents_data, "assetContract" | "tokenId">
export const isAnalyticsAsset = <T>(asset: T): asset is T & AnalyticsAsset => {
  const analyticsAsset = asset as unknown as
    | DeepPartial<AnalyticsAsset>
    | undefined
  return (
    !!analyticsAsset?.assetContract?.address &&
    !!analyticsAsset?.assetContract?.chain &&
    !!analyticsAsset?.tokenId
  )
}

export const getAssetAnalyticsParams = (asset: AnalyticsAsset) => ({
  address: asset.assetContract.address,
  chainIdentifier: asset.assetContract.chain,
  tokenId: asset.tokenId,
})

export const readItem = inlineFragmentize<itemEvents_data, Item>(
  graphql`
    fragment itemEvents_data on AssetType @inline {
      assetContract {
        address
        chain
      }
      tokenId
    }
  `,
  getAssetAnalyticsParams,
)

// Utils
export const getItemTrackingFn = (eventName: string) => {
  const trackingFn = getTrackingFn<Item>(eventName)
  return (item: FragmentRef<itemEvents_data>) => {
    trackingFn(readItem(item))
  }
}

export const getItemTrackingFnWithExtraParams = <
  T extends Record<string, unknown>,
>(
  eventName: string,
) => {
  const trackingFn = getTrackingFn<Item & T>(eventName)
  return (item: FragmentRef<itemEvents_data>, params: T) => {
    trackingFn({ ...readItem(item), ...params })
  }
}

export const getAssetPageTrackingFn = (pageName: string) => {
  const trackingFn = getPageTrackingFn<Item>(pageName)
  return (item: AnalyticsAsset) => {
    trackingFn(getAssetAnalyticsParams(item))
  }
}

// Item Events with Item Params
export const trackOpenCheckoutModal = getItemTrackingFn("open checkout modal")
export const trackClosePurchaseFlowMultiModal = getItemTrackingFn(
  "close purchase flow multimodal",
)
export const trackReturnToPreviousStepPurchaseFlowMultiModal =
  getItemTrackingFn("return to previous step on purchase flow multimodal")
export const trackViewItem = getItemTrackingFn("view item")
export const trackOpenReportModal = getItemTrackingFn("open report modal")

// Item Events with Item Params & Extra Params
export const trackNavigateToSimilarItems = getItemTrackingFnWithExtraParams<{
  similarItem: Item
  index: number
}>("navigate to similar item")

export const trackSetAssetPrivacy =
  getTrackingFn<{ isPrivate: boolean; numItems: number }>("set asset privacy")

export const trackSubmitReport = getItemTrackingFnWithExtraParams<{
  additionalComments?: string
  originalCreatorUrl?: string
  reason?: ReportReason
}>("submit report")
export const trackClickFeaturedAsset = getItemTrackingFnWithExtraParams<{
  assetName?: Maybe<string>
  creatorUsername?: Maybe<string>
  link: string
}>("click featured asset")

// Asset Modification Events
export const trackCreateAsset = getItemTrackingFnWithExtraParams<{
  collectionSlug?: string
  unlockableContent: boolean
  isNsfw: boolean
}>("create asset")
export const trackEditAsset = getItemTrackingFn("edit asset")
export const trackDeleteAsset = getItemTrackingFn("delete asset")

// Item Events without Item Params
type AssetIdParams = {
  assetId: string
}
export const trackUploadFrozenMetadata = getTrackingFn<AssetIdParams>(
  "upload frozen metadata",
)

type AssetEventParams = IndexSignatureHack<Asset> & {
  auctionContractAddress?: string
  primaryBuyOrderHash?: string
  primarySellOrderHash?: string
  error?: string
}
const getAssetTrackingFn = (eventName: string) => {
  return (asset: Asset, extraParams?: { error: string }) => {
    if (IS_SERVER) {
      return
    }
    const {
      auction,
      primaryBuyOrder,
      primarySellOrder,
      tokenAddress,
      tokenId,
      tokenName,
    } = asset

    const params: Asset & {
      auctionContractAddress?: string
      primaryBuyOrderHash?: string
      primarySellOrderHash?: string
    } = {
      primaryBuyOrderHash: primaryBuyOrder ? primaryBuyOrder.hash : undefined,
      primarySellOrderHash: primarySellOrder
        ? primarySellOrder.hash
        : undefined,
      tokenAddress,
      tokenId,
      tokenName,
      ...extraParams,
    }

    if (auction && auction.auctionContractAddress) {
      params.auctionContractAddress = auction.auctionContractAddress
    }

    const trackingFn = getTrackingFn<AssetEventParams>(eventName)

    trackingFn(params)
  }
}

export const trackCancelBundle = getAssetTrackingFn("cancel bundle")
export const trackCancelAuction = getAssetTrackingFn("cancel auction")
export const trackAssetTransfer = getAssetTrackingFn("transfer asset")
export const trackStartCancelAuctionTransaction = getAssetTrackingFn(
  "start auction cancel transaction",
)
export const trackAcceptAuctionCancelTransaction = getAssetTrackingFn(
  "accept auction cancel transaction",
)
export const trackAuctionCancelTransactionError = getAssetTrackingFn(
  "auction cancel transaction error",
)
