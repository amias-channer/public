import { WYRE_REDIRECT_PARAMS } from "../../../constants"
import { getUnnamedTrackingFn } from "../utils"

type WyreEventParams = { query: Record<string, string>; path: string }
const trackWyreRedirect = getUnnamedTrackingFn<WyreEventParams>()

/**
 *
 * @param {object} query current querystring
 */
export const trackRedirect = (query: Record<string, string>) => {
  if (query[WYRE_REDIRECT_PARAMS.DidRedirect]) {
    trackWyreRedirect("wyre redirect", {
      path: window.location.pathname,
      query,
    })
  }
  if (query[WYRE_REDIRECT_PARAMS.DidFailAndRedirect]) {
    trackWyreRedirect("wyre fail and redirect", {
      path: window.location.pathname,
      query,
    })
  }
}
