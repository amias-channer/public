import { isValidAddress } from "ethereumjs-util"
import { SelectionBatchAction } from "../../components/search/assets/AssetSearch.react"
import { Search } from "../../components/search/WithSearch.react"
import {
  CategorySlug,
  ChainIdentifier,
  CHAIN_IDENTIFIER_ENUM_MAPPING,
  Language,
} from "../../constants"
import I18n from "../../i18n/i18n"
import {
  CollectionSort,
  IdentityInputType,
  RangeType,
  SearchResultModel,
  SearchSortBy,
  SearchToggle,
  TraitInputType,
  TraitRangeType,
  PriceFilterType,
  PriceFilterSymbol,
} from "../graphql/__generated__/AssetSearchQuery.graphql"
import { EventType } from "../graphql/__generated__/assetsQuery.graphql"
import { Config } from "../graphql/__generated__/safelistQuery.graphql"
import { fromISO8601 } from "../helpers/datetime"
import { BigNumber, bn } from "../helpers/numberUtils"
import { reverse } from "../helpers/object"
import { makeParam, Param } from "./lib"
import S from "./standard"

type Enum<T extends string> = Exclude<T, "%future added value">

const makeEnumParam = <T extends string>(
  mapping: Record<Enum<T>, string | undefined>,
): Param<Enum<T>> => {
  const reverseMapping = reverse(mapping)

  return makeParam(arg =>
    typeof arg === "string"
      ? reverseMapping[arg] ?? (arg in mapping ? (arg as Enum<T>) : undefined)
      : undefined,
  )
}

const accountConfigParam = makeEnumParam<Config>({
  AFFILIATE: undefined,
  AFFILIATE_REQUESTED: undefined,
  MODERATOR: undefined,
  PARTNER: undefined,
  VERIFIED: undefined,
  AFFILIATE_BLACKLISTED: undefined,
})

const addressParam = makeParam<string>(arg =>
  typeof arg === "string" && isValidAddress(arg) // TODO: Think about how validation should work for multichain (arbitrary address formats)
    ? arg
    : undefined,
)

const bigNumberParam = makeParam<BigNumber>(arg => {
  if (typeof arg === "string") {
    const number = bn(arg)
    if (!number.isNaN()) {
      return number
    }
  }
  return undefined
})

const categorySlugParam = makeEnumParam<CategorySlug>({
  "domain-names": undefined,
  "trading-cards": undefined,
  "virtual-worlds": undefined,
  art: undefined,
  music: undefined,
  collectibles: undefined,
  new: undefined,
  sports: undefined,
  utility: undefined,
})

const chainIdentifierParam = makeEnumParam<ChainIdentifier>(
  CHAIN_IDENTIFIER_ENUM_MAPPING,
)

const collectionSortParam = makeEnumParam<CollectionSort>({
  ASSET_COUNT: undefined,
  AVERAGE_PRICE: undefined,
  CREATED_DATE: undefined,
  MARKET_CAP: undefined,
  NAME: undefined,
  NUM_OWNERS: undefined,
  NUM_REPORTS: undefined,
  ONE_DAY_VOLUME: undefined,
  SEVEN_DAY_AVERAGE_PRICE: undefined,
  SEVEN_DAY_CHANGE: undefined,
  SEVEN_DAY_SALES: undefined,
  SEVEN_DAY_VOLUME: undefined,
  THIRTY_DAY_VOLUME: undefined,
  TOTAL_SALES: undefined,
  TOTAL_SUPPLY: undefined,
  TOTAL_VOLUME: undefined,
})

const dateTimeParam = makeParam<string>(arg => {
  if (typeof arg === "string") {
    const moment = fromISO8601(arg)
    if (moment.isValid()) {
      return arg
    }
  }
  return undefined
})

const eventParam = makeEnumParam<EventType>({
  ASSET_APPROVE: undefined,
  ASSET_TRANSFER: undefined,
  AUCTION_CANCELLED: undefined,
  AUCTION_CREATED: undefined,
  AUCTION_SUCCESSFUL: undefined,
  BID_ENTERED: undefined,
  BID_WITHDRAWN: undefined,
  CUSTOM: undefined,
  OFFER_ENTERED: undefined,
  PAYOUT: undefined,
})

const bactchActionParam = makeEnumParam<SelectionBatchAction>({
  sell: undefined,
  transfer: undefined,
  changeCollection: undefined,
  hide: undefined,
  unhide: undefined,
})

const identityParam = S.Object<IdentityInputType>({
  address: S.Optional(addressParam),
  chain: S.Optional(chainIdentifierParam),
  name: S.Optional(S.string),
  username: S.Optional(S.string),
})

const languageParam = makeParam<Language>(arg => {
  if (typeof arg === "string") {
    return I18n.parseLanguage(arg)
  }
  return undefined
})

const rangeParam = S.Object<RangeType>({ max: S.number, min: S.number })

const searchResultModelParam = makeEnumParam<SearchResultModel>({
  ASSETS: undefined,
  BUNDLES: undefined,
})

const searchSortByParam = makeEnumParam<SearchSortBy>({
  BIRTH_DATE: undefined,
  CREATED_DATE: undefined,
  EXPIRATION_DATE: undefined,
  LAST_SALE_DATE: undefined,
  LAST_SALE_PRICE: undefined,
  LAST_TRANSFER_DATE: undefined,
  LISTING_DATE: undefined,
  PRICE: undefined,
  SALE_COUNT: undefined,
  UNIT_PRICE: undefined,
  VIEWER_COUNT: undefined,
  FAVORITE_COUNT: undefined,
  STAFF_SORT_1: undefined,
  STAFF_SORT_2: undefined,
  STAFF_SORT_3: undefined,
})

const searchToggleParam = makeEnumParam<SearchToggle>({
  BUY_NOW: undefined,
  HAS_OFFERS: undefined,
  IS_NEW: undefined,
  ON_AUCTION: undefined,
})

const traitInputParam = S.Object<TraitInputType>({
  name: S.string,
  values: S.Array(S.string),
})

const traitRangeParam = S.Object<TraitRangeType>({
  name: S.string,
  ranges: S.Array(rangeParam),
})

const priceFilterSymbolParam = makeEnumParam<PriceFilterSymbol>({
  ETH: undefined,
  USD: undefined,
})

const priceParam = S.Object<PriceFilterType>({
  symbol: priceFilterSymbolParam,
  max: S.Optional(S.number),
  min: S.Optional(S.number),
})

const searchParam = S.Object<Search>({
  categories: S.Optional(S.Array(S.string)),
  chains: S.Optional(S.Array(chainIdentifierParam)),
  collection: S.Optional(S.string),
  collectionQuery: S.Optional(S.string),
  collectionSortBy: S.Optional(collectionSortParam),
  collections: S.Optional(S.Array(S.string)),
  eventTypes: S.Optional(S.Array(eventParam)),
  identity: S.Optional(identityParam),
  includeHiddenCollections: S.Optional(S.boolean),
  isSingleCollection: S.Optional(S.boolean),
  numericTraits: S.Optional(S.Array(traitRangeParam)),
  paymentAssets: S.Optional(S.Array(S.string)),
  priceFilter: S.Optional(priceParam),
  query: S.Optional(S.string),
  resultModel: S.Optional(searchResultModelParam),
  sortAscending: S.Optional(S.boolean),
  sortBy: S.Optional(searchSortByParam),
  stringTraits: S.Optional(S.Array(traitInputParam)),
  toggles: S.Optional(S.Array(searchToggleParam)),
})

const customParams = {
  AccountConfig: accountConfigParam,
  Address: addressParam,
  BigNumber: bigNumberParam,
  CategorySlug: categorySlugParam,
  ChainIdentifier: chainIdentifierParam,
  CollectionSort: collectionSortParam,
  DateTime: dateTimeParam,
  Enum: makeEnumParam,
  Event: eventParam,
  Identity: identityParam,
  Language: languageParam,
  Range: rangeParam,
  Search: searchParam,
  SearchResultModel: searchResultModelParam,
  SearchSortBy: searchSortByParam,
  SearchToggle: searchToggleParam,
  TraitInput: traitInputParam,
  TraitRange: traitRangeParam,
  makeEnumParam,
  SelectionBatchAction: bactchActionParam,
} as const
export default customParams
