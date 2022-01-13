import { ParsedUrlQuery } from "querystring"
import type { Request, Response } from "express"
import next from "next"
import WronglyTypedNextRoutes, { HTTPHandler } from "next-routes"

interface Route {
  readonly name: string
  readonly pattern: string
  readonly page: string
  readonly keys: string[]
  readonly regex: RegExp
  readonly keyNames: string[]
}

export type RequestHandlerParams = {
  req: Request
  res: Response
  route: Route
  query: ParsedUrlQuery
}

// @ts-expect-error: consider fixing types upstream
export interface NextRoutes extends WronglyTypedNextRoutes {
  match: (url: string) => {
    params?: Record<string, string | undefined>
    route?: Route
  }
  getRequestHandler(
    app: ReturnType<typeof next>,
    custom?: (params: RequestHandlerParams) => unknown,
  ): HTTPHandler
}

export const routes = new WronglyTypedNextRoutes()
  .add("home", "/", "home")
  .add("about", "/about")
  .add("careers", "/careers")

  .add("currentAccount", "/account", "account")
  .add("userSettings", "/account/settings")
  .add("accountVerifyEmail", "/account/verify-email")
  .add("accountUnsubscribe", "/account/unsubscribe")
  .add("currentAccount-collection", "/account/:collectionSlug", "account")
  .add(
    "account-chain",
    "/accounts/chain/:chainIdentifier/:identifier",
    "account",
  )
  .add("account", "/accounts/:identifier")
  .add("account-collection", "/accounts/:identifier/:collectionSlug", "account")
  .add(
    "account-chain-collection",
    "/accounts/chain/:chainIdentifier/:identifier/:collectionSlug",
    "account",
  )

  .add("collectionManagerIndex", "/collections")
  .add("collectionManagerPayouts", "/collection/:collectionSlug/payouts")
  .add(
    "collection-edit",
    "/collection/:slug/edit",
    "collectionManagerCreateOrEdit",
  )
  .add(
    "collection-create",
    "/collection/create",
    "collectionManagerCreateOrEdit",
  )
  .add("collectionManagerView", "/collection/:collectionSlug/assets/edit")
  .add("collectionManagerAssetCreate", "/collection/:slug/assets/create")
  .add(
    "collectionManagerAssetEdit",
    "/collection/:collectionSlug/asset/:assetContractAddress/:tokenId/edit",
  )
  .add(
    "asset-chain-edit",
    "/collection/:collectionSlug/asset/:chainIdentifier/:assetContractAddress/:tokenId/edit",
    "collectionManagerAssetEdit",
  )

  .add("activity", "/activity", "assets")
  .add("activity-collection", "/activity/:collectionSlug", "assets")
  .add("allOrdersV2", "/orders-staging")
  .add("prefilteredActivity", "/activity/:categoryPath", "activity")

  .add("rankings", "/rankings")

  .add("category", "/category/:categoryPath")
  .add("collection", "/collection/:collectionSlug")

  .add("bundle", "/bundles/:bundleSlug")
  .add("bundleTransfer", "/bundle/transfer")
  .add("bundleSell", "/bundle/sell", "assetSell")
  .add("bundlePlaceBid", "/bundles/:bundleSlug/bid", "placeBid")
  .add("bundleResell", "/bundles/:bundleSlug/sell", "assetSell")
  .add("bundleSaleCancel", "/bundles/:bundleSlug/cancel", "auctionCancel")

  // Must go before assettype endpoint
  .add("assetPlaceBid", "/assets/:tokenAddress/:tokenId/bid", "placeBid")
  .add("assetSell", "/assets/:tokenAddress/:tokenId/sell")
  .add("DEP_assetOrder", "/assets/:tokenAddress/:tokenId/order")
  .add("assetTransfer", "/assets/:tokenAddress/:tokenId/transfer")
  .add(
    "assetSaleCancel",
    "/assets/:tokenAddress/:tokenId/cancel",
    "auctionCancel",
  )

  // Must go after subroutes
  .add("item", "/assets/:assetContractAddress/:tokenId")
  .add(
    "item-chain",
    "/assets/:chainIdentifier/:assetContractAddress/:tokenId",
    "item",
  )
  .add("assets-collection", "/assets/:collectionSlug", "assets")
  .add("assets", "/assets")

  .add("tos", "/tos")
  .add("privacy", "/privacy")

  .add("assetSuccess", "/success")
  .add("wallet", "/wallet/:walletStatus")
  .add("getListed", "/get-listed")
  .add("getListedStepTwo", "/get-listed/step-two")

  .add("bitskiCallback", "/callback/bitski")
  .add("safelist", "/safelist")

  .add("account-vanity", "/:identifier", "account")
  .add("account-vanity-collection", "/:identifier/:collectionSlug", "account")
  .add("account-vanity-chain", "/chain/:chainIdentifier/:identifier", "account")
  .add(
    "account-vanity-chain-collection",
    "/chain/:chainIdentifier/:identifier/:collectionSlug",
    "account",
  ) as unknown as NextRoutes

export default routes

export const authRequiredRoutes = new Set([
  "collectionManagerAssetCreate",
  "collectionManagerAssetEdit",
  "collectionManagerCreateOrEdit",
  "collectionManagerPayouts",
  "safelist",
  "userSettings",
])

export const walletRequiredRoutes = new Set([
  "DEP_assetOrder",
  "assetPlaceBid",
  "assetPurchase",
  "assetRefer",
  "assetSell",
  "assetTransfer",
  "bundlePlaceBid",
  "bundleRefer",
  "bundleResell",
  "bundleSaleCancel",
  "bundleSell",
  "bundleTransfer",
  "currentAccount",
  "currentAccount-collection",
  "collectionManagerIndex",
])

export const walletRoutes = new Set(["wallet", "walletSelect"])

export const Router = routes.Router
