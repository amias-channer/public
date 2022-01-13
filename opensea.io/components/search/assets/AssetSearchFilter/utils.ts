import type {
  AssetSearchQueryVariables,
  SearchToggle,
} from "../../../../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { flatMap } from "../../../../lib/helpers/array"
import type { Item } from "../../FeaturedFilter.react"

export const getFilterCount = (
  state: AssetSearchQueryVariables,
  { includeCollectionFilter }: { includeCollectionFilter?: boolean } = {
    includeCollectionFilter: true,
  },
): number =>
  [
    ...((includeCollectionFilter && state.collections) || []),
    ...(state.categories || []),
    ...(state.chains || []),
    ...(state.stringTraits
      ? flatMap(state.stringTraits, trait => trait.values)
      : []),
    ...(state.numericTraits || []),
    ...(state.toggles || []),
    ...(state.paymentAssets || []),
    ...(state.priceFilter ? [true] : []),
  ].length

export const POSSIBLE_FILTER_ITEMS: Item<SearchToggle>[] = [
  { filter: "BUY_NOW", label: "Buy Now" },
  { filter: "ON_AUCTION", label: "On Auction" },
  { filter: "IS_NEW", label: "New" },
  { filter: "HAS_OFFERS", label: "Has Offers" },
]
