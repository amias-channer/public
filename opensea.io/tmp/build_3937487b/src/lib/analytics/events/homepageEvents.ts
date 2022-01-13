import { Maybe } from "../../helpers/type"
import { getTrackingFn } from "../utils"

export const trackClickPromoCard = getTrackingFn<{
  promotionId: string
  promotionHeader: Maybe<string>
  link: Maybe<string>
}>("click promo card")
export const trackClickGetFeatured = getTrackingFn("click get featured")
export const trackSetTrendingIn =
  getTrackingFn<{ category?: string; label: string }>("set trending in")
