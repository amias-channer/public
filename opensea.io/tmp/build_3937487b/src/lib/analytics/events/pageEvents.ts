import { WALLET_NAME } from "../../../constants"
import { accountQuery } from "../../graphql/__generated__/accountQuery.graphql"
import { GraphQLProps } from "../../graphql/graphql"
import { getPageTrackingFn } from "../utils"
import { CollectionSlugParams } from "./collectionEvents"
import { getAssetPageTrackingFn } from "./itemEvents"
import { WalletNameParams } from "./walletEvents"

export const trackHomePage = getPageTrackingFn("home page")
export const trackRankingsPage = getPageTrackingFn("rankings page")
export const trackCollectionPage =
  getPageTrackingFn<CollectionSlugParams>("collection page")
export const trackCollectionManagerPage = getPageTrackingFn(
  "collection manager page",
)

export const trackCollectionManagerEditCollectionPage =
  getPageTrackingFn<CollectionSlugParams>(
    "collection manager edit collection page",
  )
export const trackCollectionManagerCreateCollectionPage = getPageTrackingFn(
  "collection manager create collection page",
)
export const trackAssetSellPage = getAssetPageTrackingFn("asset sell page")
export const trackAssetSuccessPage = getAssetPageTrackingFn(
  "asset purchase successful page",
)
export const trackBundleSellPage =
  getPageTrackingFn<{ bundleSlug?: string }>("bundle sell page")
export const trackBundleTransferPage = getPageTrackingFn("bundle transfer page")
export const trackAccountUnsubscribePage = getPageTrackingFn("unsubscribe page")
export const trackWalletUnlockPage = getPageTrackingFn<
  Partial<WalletNameParams> & { suggestedWallet: WALLET_NAME }
>("wallet unlock page")
export const trackErrorPage = getPageTrackingFn<{
  error_code: number
  path: string
}>("error page")

// TODO: Unlink this from GQL
export const trackAccountPage =
  getPageTrackingFn<GraphQLProps<accountQuery>["variables"]>("account page")
