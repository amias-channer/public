import moment from "moment"
import {
  ENGLISH_AUCTION_POLLING_TIMEFRAME_IN_MINUTES,
  POLLING_INTERVAL,
} from "../../constants"
import { clearCache } from "../graphql/environment/middlewares/cacheMiddleware"
import { fromISO8601 } from "./datetime"
import { poll } from "./promise"

export const pollEnglishAuction = (
  closedAt: string,
  refetch: () => void,
): void => {
  poll({
    delay: POLLING_INTERVAL,
    fn: () => {
      const closedAtFromISO = fromISO8601(closedAt)
      const minutesUntilClose = moment
        .duration(closedAtFromISO.diff(moment()))
        .asMinutes()
      if (
        minutesUntilClose > -1 &&
        minutesUntilClose < ENGLISH_AUCTION_POLLING_TIMEFRAME_IN_MINUTES
      ) {
        clearCache()
        refetch()
      }
    },
  })
}
