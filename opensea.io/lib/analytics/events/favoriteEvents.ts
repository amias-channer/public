import { getTrackingFn } from "../utils"

export type FavoriteEventParams = {
  assetId: string
  isAuthenticated: boolean
}

export const trackFavorite =
  getTrackingFn<FavoriteEventParams>("favorite an asset")
export const trackUnfavorite = getTrackingFn<FavoriteEventParams>(
  "unfavorite an asset",
)
