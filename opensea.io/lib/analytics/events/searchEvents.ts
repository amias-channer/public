import { Search, SearchType } from "../../../components/search/WithSearch.react"
import { getTrackingFn } from "../utils"

export const trackOpenSidebarFilter = getTrackingFn("open sidebar filter")
export const trackCloseSidebarFilter = getTrackingFn("close sidebar filter")
export const trackApplyPriceFilter =
  getTrackingFn<{ symbol: string }>("apply price filter")
export const trackSearch = getTrackingFn<
  { path: string; queryString: string; type?: SearchType } & Search
>("search")
