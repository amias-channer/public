import BigNumber from "bignumber.js"
import moment from "moment"
import { fromISO8601 } from "../../lib/helpers/datetime"
import { bn } from "./numberUtils"

export const getTotalPrice = (
  quantity: BigNumber,
  dutchAuctionFinalPrice: string | null,
  openedAt: string,
  priceFnEndedAt: string | null,
): BigNumber => {
  if (!quantity || !dutchAuctionFinalPrice || !openedAt || !priceFnEndedAt) {
    return quantity
  }
  const priceFnStartedAt = fromISO8601(openedAt)
  const priceFnEndedAtMoment = fromISO8601(priceFnEndedAt)
  const calculatedPrice = bn(quantity).minus(
    bn(quantity)
      .minus(dutchAuctionFinalPrice)
      .times(
        bn(moment.utc().diff(priceFnStartedAt)).div(
          priceFnEndedAtMoment.diff(priceFnStartedAt),
        ),
      ),
  )
  return bn(
    priceFnEndedAtMoment.isSameOrBefore(moment())
      ? dutchAuctionFinalPrice
      : calculatedPrice,
  ).round()
}
