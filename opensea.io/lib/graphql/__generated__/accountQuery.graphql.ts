/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EventType = "ASSET_APPROVE" | "ASSET_TRANSFER" | "AUCTION_CANCELLED" | "AUCTION_CREATED" | "AUCTION_SUCCESSFUL" | "BID_ENTERED" | "BID_WITHDRAWN" | "CUSTOM" | "OFFER_ENTERED" | "PAYOUT" | "%future added value";
export type SearchResultModel = "ASSETS" | "BUNDLES" | "%future added value";
export type SearchSortBy = "BIRTH_DATE" | "CREATED_DATE" | "EXPIRATION_DATE" | "FAVORITE_COUNT" | "LAST_SALE_DATE" | "LAST_SALE_PRICE" | "LAST_TRANSFER_DATE" | "LISTING_DATE" | "PRICE" | "SALE_COUNT" | "STAFF_SORT_1" | "STAFF_SORT_2" | "STAFF_SORT_3" | "UNIT_PRICE" | "VIEWER_COUNT" | "%future added value";
export type SearchToggle = "BUY_NOW" | "HAS_OFFERS" | "IS_NEW" | "ON_AUCTION" | "%future added value";
export type IdentityInputType = {
    address?: string | null;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
    name?: string | null;
    username?: string | null;
};
export type TraitRangeType = {
    name: string;
    ranges: Array<RangeType>;
};
export type RangeType = {
    min: number;
    max: number;
};
export type TraitInputType = {
    name: string;
    values: Array<string>;
};
export type accountQueryVariables = {
    categories?: Array<string> | null;
    chains?: Array<| "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value"> | null;
    collection?: string | null;
    collectionQuery?: string | null;
    collections?: Array<string> | null;
    eventTypes?: Array<EventType> | null;
    identity?: IdentityInputType | null;
    creator?: IdentityInputType | null;
    isActivityTab: boolean;
    isAssetsTab: boolean;
    isOffersTab: boolean;
    isCreatedTab: boolean;
    isPrivateTab: boolean;
    isPrivate: boolean;
    isSingleCollection: boolean;
    numericTraits?: Array<TraitRangeType> | null;
    query?: string | null;
    resultModel?: SearchResultModel | null;
    sortAscending?: boolean | null;
    sortBy?: SearchSortBy | null;
    stringTraits?: Array<TraitInputType> | null;
    toggles?: Array<SearchToggle> | null;
    showContextMenu: boolean;
    isCurrentUser: boolean;
};
export type accountQueryResponse = {
    readonly account: {
        readonly address: string;
        readonly imageUrl: string;
        readonly user: {
            readonly username: string;
            readonly publicUsername: string | null;
        } | null;
        readonly privateAssetCount: number;
        readonly " $fragmentRefs": FragmentRefs<"profilePageQueries_account" | "AccountHeader_data" | "wallet_accountKey">;
    } | null;
    readonly collection: {
        readonly description: string | null;
        readonly imageUrl: string | null;
        readonly name: string;
    } | null;
    readonly sidebarCollected: {
        readonly " $fragmentRefs": FragmentRefs<"profilePageQueries_collected">;
    };
    readonly sidebarCreated: {
        readonly " $fragmentRefs": FragmentRefs<"profilePageQueries_created">;
    };
    readonly assets?: {
        readonly " $fragmentRefs": FragmentRefs<"AssetSearch_data">;
    };
    readonly activity?: {
        readonly " $fragmentRefs": FragmentRefs<"ActivitySearch_data">;
    };
    readonly offers?: {
        readonly " $fragmentRefs": FragmentRefs<"OfferSearch_data">;
    };
    readonly created?: {
        readonly " $fragmentRefs": FragmentRefs<"AssetSearch_data">;
    };
    readonly private?: {
        readonly " $fragmentRefs": FragmentRefs<"AssetSearch_data">;
    };
};
export type accountQuery = {
    readonly response: accountQueryResponse;
    readonly variables: accountQueryVariables;
};



/*
query accountQuery(
  $categories: [CollectionSlug!]
  $chains: [ChainScalar!]
  $collection: CollectionSlug
  $collectionQuery: String
  $collections: [CollectionSlug!]
  $identity: IdentityInputType
  $creator: IdentityInputType
  $isActivityTab: Boolean!
  $isAssetsTab: Boolean!
  $isOffersTab: Boolean!
  $isCreatedTab: Boolean!
  $isPrivateTab: Boolean!
  $isPrivate: Boolean!
  $isSingleCollection: Boolean!
  $numericTraits: [TraitRangeType!]
  $query: String
  $resultModel: SearchResultModel
  $sortAscending: Boolean
  $sortBy: SearchSortBy
  $stringTraits: [TraitInputType!]
  $toggles: [SearchToggle!]
  $showContextMenu: Boolean!
  $isCurrentUser: Boolean!
) {
  account(identity: $identity) {
    address
    imageUrl
    user {
      username
      publicUsername
      id
    }
    ...profilePageQueries_account_1CMIO8
    ...AccountHeader_data
    ...wallet_accountKey
    privateAssetCount
    id
  }
  collection(collection: $collection) {
    description
    imageUrl
    name
    id
  }
  sidebarCollected: query {
    ...profilePageQueries_collected_3StDC7
  }
  sidebarCreated: query {
    ...profilePageQueries_created_3StDC7
  }
  assets: query @include(if: $isAssetsTab) {
    ...AssetSearch_data_3u637c
  }
  activity: query @include(if: $isActivityTab) {
    ...ActivitySearch_data_3v36wc
  }
  offers: query @include(if: $isOffersTab) {
    ...OfferSearch_data_3HWMrt
  }
  created: query @include(if: $isCreatedTab) {
    ...AssetSearch_data_1Wp6pN
  }
  private: query @include(if: $isPrivateTab) {
    ...AssetSearch_data_11hSR7
  }
}

fragment AccountHeader_data on AccountType {
  address
  bio
  bannerImageUrl
  config
  discordId
  relayId
  names {
    name
    type
  }
  displayName
  ...accounts_url
  ...ProfileImage_data
}

fragment ActivitySearchFilter_data_23FYhq on Query {
  ...CollectionFilter_data_5wVB4
}

fragment ActivitySearch_data_3v36wc on Query {
  collection(collection: $collection) @include(if: $isSingleCollection) {
    includeTradingHistory
    id
  }
  ...CollectionHeadMetadata_data_2YoIWt
  ...ActivitySearchFilter_data_23FYhq
  ...SearchPills_data_2Kg4Sq
}

fragment AssetCardContent_assetBundle on AssetBundleType {
  assetQuantities(first: 18) {
    edges {
      node {
        asset {
          relayId
          ...AssetMedia_asset
          id
        }
        id
      }
    }
  }
}

fragment AssetCardContent_asset_27d9G3 on AssetType {
  relayId
  name
  ...AssetMedia_asset
  assetContract {
    address
    chain
    openseaVersion
    id
  }
  tokenId
  collection {
    slug
    id
  }
  isDelisted
  ...AssetContextMenu_data_3z4lq0 @include(if: $showContextMenu)
}

fragment AssetCardFooter_assetBundle on AssetBundleType {
  name
  assetCount
  assetQuantities(first: 18) {
    edges {
      node {
        asset {
          collection {
            name
            relayId
            isVerified
            id
          }
          id
        }
        id
      }
    }
  }
  assetEventData {
    lastSale {
      unitPriceQuantity {
        ...AssetQuantity_data
        id
      }
    }
  }
  orderData {
    bestBid {
      orderType
      paymentAssetQuantity {
        ...AssetQuantity_data
        id
      }
    }
    bestAsk {
      closedAt
      orderType
      dutchAuctionFinalPrice
      openedAt
      priceFnEndedAt
      quantity
      decimals
      paymentAssetQuantity {
        quantity
        ...AssetQuantity_data
        id
      }
    }
  }
}

fragment AssetCardFooter_asset_1xJxfu on AssetType {
  ownedQuantity(identity: {}) @include(if: $isAssetsTab)
  name
  tokenId
  collection {
    name
    isVerified
    id
  }
  hasUnlockableContent
  isDelisted
  isFrozen
  assetContract {
    address
    chain
    openseaVersion
    id
  }
  assetEventData {
    firstTransfer {
      timestamp
    }
    lastSale {
      unitPriceQuantity {
        ...AssetQuantity_data
        id
      }
    }
  }
  decimals
  orderData {
    bestBid {
      orderType
      paymentAssetQuantity {
        ...AssetQuantity_data
        id
      }
    }
    bestAsk {
      closedAt
      orderType
      dutchAuctionFinalPrice
      openedAt
      priceFnEndedAt
      quantity
      decimals
      paymentAssetQuantity {
        quantity
        ...AssetQuantity_data
        id
      }
    }
  }
}

fragment AssetCardFooter_asset_206ilR on AssetType {
  ownedQuantity(identity: $identity)
  name
  tokenId
  collection {
    name
    isVerified
    id
  }
  hasUnlockableContent
  isDelisted
  isFrozen
  assetContract {
    address
    chain
    openseaVersion
    id
  }
  assetEventData {
    firstTransfer {
      timestamp
    }
    lastSale {
      unitPriceQuantity {
        ...AssetQuantity_data
        id
      }
    }
  }
  decimals
  orderData {
    bestBid {
      orderType
      paymentAssetQuantity {
        ...AssetQuantity_data
        id
      }
    }
    bestAsk {
      closedAt
      orderType
      dutchAuctionFinalPrice
      openedAt
      priceFnEndedAt
      quantity
      decimals
      paymentAssetQuantity {
        quantity
        ...AssetQuantity_data
        id
      }
    }
  }
}

fragment AssetCardFooter_asset_3RLB6f on AssetType {
  ownedQuantity(identity: $identity) @include(if: $isAssetsTab)
  name
  tokenId
  collection {
    name
    isVerified
    id
  }
  hasUnlockableContent
  isDelisted
  isFrozen
  assetContract {
    address
    chain
    openseaVersion
    id
  }
  assetEventData {
    firstTransfer {
      timestamp
    }
    lastSale {
      unitPriceQuantity {
        ...AssetQuantity_data
        id
      }
    }
  }
  decimals
  orderData {
    bestBid {
      orderType
      paymentAssetQuantity {
        ...AssetQuantity_data
        id
      }
    }
    bestAsk {
      closedAt
      orderType
      dutchAuctionFinalPrice
      openedAt
      priceFnEndedAt
      quantity
      decimals
      paymentAssetQuantity {
        quantity
        ...AssetQuantity_data
        id
      }
    }
  }
}

fragment AssetCardHeader_data on AssetType {
  relayId
  favoritesCount
  isDelisted
  isFavorite
}

fragment AssetContextMenu_data_3z4lq0 on AssetType {
  ...asset_edit_url
  ...itemEvents_data
  isDelisted
  isEditable {
    value
    reason
  }
  isListable
  ownership(identity: {}) {
    isPrivate
    quantity
  }
  creator {
    address
    id
  }
  collection {
    isAuthorizedEditor
    id
  }
}

fragment AssetMedia_asset on AssetType {
  animationUrl
  backgroundColor
  collection {
    description
    displayData {
      cardDisplayStyle
    }
    imageUrl
    hidden
    name
    slug
    id
  }
  description
  name
  tokenId
  imageUrl
  isDelisted
}

fragment AssetQuantity_data on AssetQuantityType {
  asset {
    ...Price_data
    id
  }
  quantity
}

fragment AssetSearchList_data_164hN9 on SearchResultType {
  asset {
    assetContract {
      address
      chain
      id
    }
    relayId
    tokenId
    ...AssetSelectionItem_data
    ...asset_url
    id
  }
  assetBundle {
    relayId
    id
  }
  ...Asset_data_164hN9
}

fragment AssetSearchList_data_19CeED on SearchResultType {
  asset {
    assetContract {
      address
      chain
      id
    }
    relayId
    tokenId
    ...AssetSelectionItem_data
    ...asset_url
    id
  }
  assetBundle {
    relayId
    id
  }
  ...Asset_data_19CeED
}

fragment AssetSearchList_data_4UtZc on SearchResultType {
  asset {
    assetContract {
      address
      chain
      id
    }
    relayId
    tokenId
    ...AssetSelectionItem_data
    ...asset_url
    id
  }
  assetBundle {
    relayId
    id
  }
  ...Asset_data_4UtZc
}

fragment AssetSearch_data_11hSR7 on Query {
  ...CollectionHeadMetadata_data_2YoIWt
  ...SearchPills_data_2Kg4Sq
  search(chains: $chains, categories: $categories, collections: $collections, first: 32, identity: $identity, numericTraits: $numericTraits, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, isPrivate: $isPrivate) {
    edges {
      node {
        ...AssetSearchList_data_4UtZc
        __typename
      }
      cursor
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment AssetSearch_data_1Wp6pN on Query {
  ...CollectionHeadMetadata_data_2YoIWt
  ...SearchPills_data_2Kg4Sq
  search(chains: $chains, categories: $categories, collections: $collections, first: 32, numericTraits: $numericTraits, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, creator: $creator) {
    edges {
      node {
        ...AssetSearchList_data_164hN9
        __typename
      }
      cursor
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment AssetSearch_data_3u637c on Query {
  ...CollectionHeadMetadata_data_2YoIWt
  ...SearchPills_data_2Kg4Sq
  search(chains: $chains, categories: $categories, collections: $collections, first: 32, identity: $identity, numericTraits: $numericTraits, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles) {
    edges {
      node {
        ...AssetSearchList_data_19CeED
        __typename
      }
      cursor
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment AssetSelectionItem_data on AssetType {
  backgroundColor
  collection {
    displayData {
      cardDisplayStyle
    }
    imageUrl
    id
  }
  imageUrl
  name
  relayId
}

fragment Asset_data_164hN9 on SearchResultType {
  asset {
    assetContract {
      chain
      id
    }
    isDelisted
    ...AssetCardHeader_data
    ...AssetCardContent_asset_27d9G3
    ...AssetCardFooter_asset_1xJxfu
    ...AssetMedia_asset
    ...asset_url
    ...itemEvents_data
    id
  }
  assetBundle {
    slug
    ...AssetCardContent_assetBundle
    ...AssetCardFooter_assetBundle
    id
  }
}

fragment Asset_data_19CeED on SearchResultType {
  asset {
    assetContract {
      chain
      id
    }
    isDelisted
    ...AssetCardHeader_data
    ...AssetCardContent_asset_27d9G3
    ...AssetCardFooter_asset_3RLB6f
    ...AssetMedia_asset
    ...asset_url
    ...itemEvents_data
    id
  }
  assetBundle {
    slug
    ...AssetCardContent_assetBundle
    ...AssetCardFooter_assetBundle
    id
  }
}

fragment Asset_data_4UtZc on SearchResultType {
  asset {
    assetContract {
      chain
      id
    }
    isDelisted
    ...AssetCardHeader_data
    ...AssetCardContent_asset_27d9G3
    ...AssetCardFooter_asset_206ilR
    ...AssetMedia_asset
    ...asset_url
    ...itemEvents_data
    id
  }
  assetBundle {
    slug
    ...AssetCardContent_assetBundle
    ...AssetCardFooter_assetBundle
    id
  }
}

fragment CollectionFilter_data_5wVB4 on Query {
  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {
    edges {
      node {
        assetCount
        imageUrl
        name
        slug
        id
      }
    }
  }
  collections(chains: $chains, first: 100, includeHidden: false, parents: $categories, query: $collectionQuery, sortBy: SEVEN_DAY_VOLUME) {
    edges {
      node {
        assetCount
        imageUrl
        name
        slug
        id
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment CollectionHeadMetadata_data_2YoIWt on Query {
  collection(collection: $collection) {
    bannerImageUrl
    description
    imageUrl
    name
    id
  }
}

fragment CollectionModalContent_data on CollectionType {
  description
  imageUrl
  name
  slug
}

fragment OfferSearchFilter_data_23FYhq on Query {
  ...CollectionFilter_data_5wVB4
}

fragment OfferSearch_data_3HWMrt on Query {
  ...OfferSearchFilter_data_23FYhq
  ...SearchPills_data_2Kg4Sq
}

fragment Price_data on AssetType {
  decimals
  imageUrl
  symbol
  usdSpotPrice
  assetContract {
    blockExplorerLink
    chain
    id
  }
}

fragment ProfileImage_data on AccountType {
  imageUrl
  address
}

fragment SearchPills_data_2Kg4Sq on Query {
  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {
    edges {
      node {
        imageUrl
        name
        slug
        ...CollectionModalContent_data
        id
      }
    }
  }
}

fragment accounts_url on AccountType {
  address
  user {
    publicUsername
    id
  }
}

fragment asset_edit_url on AssetType {
  assetContract {
    address
    chain
    id
  }
  tokenId
  collection {
    slug
    id
  }
}

fragment asset_url on AssetType {
  assetContract {
    address
    chain
    id
  }
  tokenId
}

fragment itemEvents_data on AssetType {
  assetContract {
    address
    chain
    id
  }
  tokenId
}

fragment profilePageQueries_account_1CMIO8 on AccountType {
  user {
    favoriteAssetCount
    id
  }
  privateAssetCount @include(if: $isCurrentUser)
}

fragment profilePageQueries_collected_3StDC7 on Query {
  search(identity: $identity, first: 0) {
    totalCount
  }
}

fragment profilePageQueries_created_3StDC7 on Query {
  search(creator: $identity, first: 0, resultType: ASSETS) {
    totalCount
  }
}

fragment wallet_accountKey on AccountType {
  address
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "categories"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "chains"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "collection"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "collectionQuery"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "collections"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "creator"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "eventTypes"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "identity"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isActivityTab"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isAssetsTab"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isCreatedTab"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isCurrentUser"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isOffersTab"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isPrivate"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isPrivateTab"
},
v15 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isSingleCollection"
},
v16 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "numericTraits"
},
v17 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v18 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resultModel"
},
v19 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "showContextMenu"
},
v20 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortAscending"
},
v21 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v22 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "stringTraits"
},
v23 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "toggles"
},
v24 = {
  "kind": "Variable",
  "name": "identity",
  "variableName": "identity"
},
v25 = [
  (v24/*: any*/)
],
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "publicUsername",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateAssetCount",
  "storageKey": null
},
v31 = {
  "kind": "Variable",
  "name": "collection",
  "variableName": "collection"
},
v32 = [
  (v31/*: any*/)
],
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v35 = {
  "kind": "Variable",
  "name": "assetOwner",
  "variableName": "identity"
},
v36 = {
  "kind": "Variable",
  "name": "categories",
  "variableName": "categories"
},
v37 = {
  "kind": "Variable",
  "name": "chains",
  "variableName": "chains"
},
v38 = {
  "kind": "Variable",
  "name": "collectionQuery",
  "variableName": "collectionQuery"
},
v39 = {
  "kind": "Variable",
  "name": "collections",
  "variableName": "collections"
},
v40 = {
  "kind": "Literal",
  "name": "includeHiddenCollections",
  "value": false
},
v41 = {
  "kind": "Literal",
  "name": "includeSearchFilterData",
  "value": false
},
v42 = {
  "kind": "Variable",
  "name": "numericTraits",
  "variableName": "numericTraits"
},
v43 = {
  "kind": "Variable",
  "name": "query",
  "variableName": "query"
},
v44 = {
  "kind": "Variable",
  "name": "resultModel",
  "variableName": "resultModel"
},
v45 = {
  "kind": "Variable",
  "name": "shouldShowQuantity",
  "variableName": "isAssetsTab"
},
v46 = {
  "kind": "Variable",
  "name": "showContextMenu",
  "variableName": "showContextMenu"
},
v47 = {
  "kind": "Variable",
  "name": "sortAscending",
  "variableName": "sortAscending"
},
v48 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v49 = {
  "kind": "Variable",
  "name": "stringTraits",
  "variableName": "stringTraits"
},
v50 = {
  "kind": "Variable",
  "name": "toggles",
  "variableName": "toggles"
},
v51 = {
  "kind": "Literal",
  "name": "collectionSortBy",
  "value": "SEVEN_DAY_VOLUME"
},
v52 = {
  "kind": "Literal",
  "name": "collectionSortBy",
  "value": "NAME"
},
v53 = {
  "kind": "Variable",
  "name": "creator",
  "variableName": "creator"
},
v54 = {
  "kind": "Variable",
  "name": "isPrivate",
  "variableName": "isPrivate"
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bannerImageUrl",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v58 = {
  "kind": "Literal",
  "name": "first",
  "value": 0
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v60 = [
  (v59/*: any*/)
],
v61 = {
  "alias": null,
  "args": (v32/*: any*/),
  "concreteType": "CollectionType",
  "kind": "LinkedField",
  "name": "collection",
  "plural": false,
  "selections": [
    (v56/*: any*/),
    (v33/*: any*/),
    (v27/*: any*/),
    (v34/*: any*/),
    (v55/*: any*/)
  ],
  "storageKey": null
},
v62 = [
  (v39/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  },
  {
    "kind": "Literal",
    "name": "includeHidden",
    "value": true
  }
],
v63 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v64 = {
  "alias": "selectedCollections",
  "args": (v62/*: any*/),
  "concreteType": "CollectionTypeConnection",
  "kind": "LinkedField",
  "name": "collections",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CollectionTypeEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CollectionType",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v27/*: any*/),
            (v34/*: any*/),
            (v63/*: any*/),
            (v33/*: any*/),
            (v55/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v65 = {
  "kind": "Literal",
  "name": "first",
  "value": 32
},
v66 = {
  "kind": "Variable",
  "name": "querystring",
  "variableName": "query"
},
v67 = {
  "kind": "Variable",
  "name": "resultType",
  "variableName": "resultModel"
},
v68 = [
  (v36/*: any*/),
  (v37/*: any*/),
  (v39/*: any*/),
  (v65/*: any*/),
  (v24/*: any*/),
  (v42/*: any*/),
  (v66/*: any*/),
  (v67/*: any*/),
  (v47/*: any*/),
  (v48/*: any*/),
  (v49/*: any*/),
  (v50/*: any*/)
],
v69 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v70 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetContractType",
  "kind": "LinkedField",
  "name": "assetContract",
  "plural": false,
  "selections": [
    (v26/*: any*/),
    (v69/*: any*/),
    (v55/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "openseaVersion",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v71 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tokenId",
  "storageKey": null
},
v72 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v73 = {
  "alias": null,
  "args": null,
  "concreteType": "DisplayDataType",
  "kind": "LinkedField",
  "name": "displayData",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cardDisplayStyle",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v74 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hidden",
  "storageKey": null
},
v75 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isVerified",
  "storageKey": null
},
v76 = {
  "alias": null,
  "args": null,
  "concreteType": "CollectionType",
  "kind": "LinkedField",
  "name": "collection",
  "plural": false,
  "selections": [
    (v73/*: any*/),
    (v27/*: any*/),
    (v55/*: any*/),
    (v33/*: any*/),
    (v74/*: any*/),
    (v34/*: any*/),
    (v63/*: any*/),
    (v75/*: any*/)
  ],
  "storageKey": null
},
v77 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDelisted",
  "storageKey": null
},
v78 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "favoritesCount",
  "storageKey": null
},
v79 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFavorite",
  "storageKey": null
},
v80 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "animationUrl",
  "storageKey": null
},
v81 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasUnlockableContent",
  "storageKey": null
},
v82 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFrozen",
  "storageKey": null
},
v83 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v84 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetType",
  "kind": "LinkedField",
  "name": "asset",
  "plural": false,
  "selections": [
    (v83/*: any*/),
    (v27/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "symbol",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usdSpotPrice",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AssetContractType",
      "kind": "LinkedField",
      "name": "assetContract",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "blockExplorerLink",
          "storageKey": null
        },
        (v69/*: any*/),
        (v55/*: any*/)
      ],
      "storageKey": null
    },
    (v55/*: any*/)
  ],
  "storageKey": null
},
v85 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v86 = [
  (v84/*: any*/),
  (v85/*: any*/),
  (v55/*: any*/)
],
v87 = {
  "alias": null,
  "args": null,
  "concreteType": "ESAssetEventType",
  "kind": "LinkedField",
  "name": "lastSale",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "AssetQuantityType",
      "kind": "LinkedField",
      "name": "unitPriceQuantity",
      "plural": false,
      "selections": (v86/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v88 = {
  "alias": null,
  "args": null,
  "concreteType": "ESAssetEventDataType",
  "kind": "LinkedField",
  "name": "assetEventData",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ESAssetEventType",
      "kind": "LinkedField",
      "name": "firstTransfer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "timestamp",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    (v87/*: any*/)
  ],
  "storageKey": null
},
v89 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderType",
  "storageKey": null
},
v90 = {
  "alias": null,
  "args": null,
  "concreteType": "ESOrderDataType",
  "kind": "LinkedField",
  "name": "orderData",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ESOrderType",
      "kind": "LinkedField",
      "name": "bestBid",
      "plural": false,
      "selections": [
        (v89/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetQuantityType",
          "kind": "LinkedField",
          "name": "paymentAssetQuantity",
          "plural": false,
          "selections": (v86/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ESOrderType",
      "kind": "LinkedField",
      "name": "bestAsk",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "closedAt",
          "storageKey": null
        },
        (v89/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "dutchAuctionFinalPrice",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "openedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "priceFnEndedAt",
          "storageKey": null
        },
        (v85/*: any*/),
        (v83/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetQuantityType",
          "kind": "LinkedField",
          "name": "paymentAssetQuantity",
          "plural": false,
          "selections": [
            (v85/*: any*/),
            (v84/*: any*/),
            (v55/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v91 = [
  {
    "kind": "Literal",
    "name": "identity",
    "value": {}
  }
],
v92 = {
  "condition": "showContextMenu",
  "kind": "Condition",
  "passingValue": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CollectionType",
      "kind": "LinkedField",
      "name": "collection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isAuthorizedEditor",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AbleToType",
      "kind": "LinkedField",
      "name": "isEditable",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "reason",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isListable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v91/*: any*/),
      "concreteType": "AssetOwnershipDataType",
      "kind": "LinkedField",
      "name": "ownership",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isPrivate",
          "storageKey": null
        },
        (v85/*: any*/)
      ],
      "storageKey": "ownership(identity:{})"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AccountType",
      "kind": "LinkedField",
      "name": "creator",
      "plural": false,
      "selections": [
        (v26/*: any*/),
        (v55/*: any*/)
      ],
      "storageKey": null
    }
  ]
},
v93 = {
  "alias": null,
  "args": (v25/*: any*/),
  "kind": "ScalarField",
  "name": "ownedQuantity",
  "storageKey": null
},
v94 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "assetCount",
  "storageKey": null
},
v95 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetBundleType",
  "kind": "LinkedField",
  "name": "assetBundle",
  "plural": false,
  "selections": [
    (v57/*: any*/),
    (v55/*: any*/),
    (v63/*: any*/),
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 18
        }
      ],
      "concreteType": "AssetQuantityTypeConnection",
      "kind": "LinkedField",
      "name": "assetQuantities",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetQuantityTypeEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "AssetQuantityType",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "AssetType",
                  "kind": "LinkedField",
                  "name": "asset",
                  "plural": false,
                  "selections": [
                    (v57/*: any*/),
                    (v80/*: any*/),
                    (v72/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CollectionType",
                      "kind": "LinkedField",
                      "name": "collection",
                      "plural": false,
                      "selections": [
                        (v33/*: any*/),
                        (v73/*: any*/),
                        (v27/*: any*/),
                        (v74/*: any*/),
                        (v34/*: any*/),
                        (v63/*: any*/),
                        (v55/*: any*/),
                        (v57/*: any*/),
                        (v75/*: any*/)
                      ],
                      "storageKey": null
                    },
                    (v33/*: any*/),
                    (v34/*: any*/),
                    (v71/*: any*/),
                    (v27/*: any*/),
                    (v77/*: any*/),
                    (v55/*: any*/)
                  ],
                  "storageKey": null
                },
                (v55/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "assetQuantities(first:18)"
    },
    (v34/*: any*/),
    (v94/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "ESAssetEventDataType",
      "kind": "LinkedField",
      "name": "assetEventData",
      "plural": false,
      "selections": [
        (v87/*: any*/)
      ],
      "storageKey": null
    },
    (v90/*: any*/)
  ],
  "storageKey": null
},
v96 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v97 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v98 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v99 = [
  "chains",
  "categories",
  "collections",
  "identity",
  "numericTraits",
  "paymentAssets",
  "priceFilter",
  "querystring",
  "resultType",
  "sortAscending",
  "sortBy",
  "stringTraits",
  "toggles",
  "creator",
  "isPrivate",
  "safelistRequestStatuses"
],
v100 = {
  "alias": "selectedCollections",
  "args": (v62/*: any*/),
  "concreteType": "CollectionTypeConnection",
  "kind": "LinkedField",
  "name": "collections",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CollectionTypeEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CollectionType",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v94/*: any*/),
            (v27/*: any*/),
            (v34/*: any*/),
            (v63/*: any*/),
            (v55/*: any*/),
            (v33/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v101 = [
  (v37/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Literal",
    "name": "includeHidden",
    "value": false
  },
  {
    "kind": "Variable",
    "name": "parents",
    "variableName": "categories"
  },
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "collectionQuery"
  },
  {
    "kind": "Literal",
    "name": "sortBy",
    "value": "SEVEN_DAY_VOLUME"
  }
],
v102 = {
  "alias": null,
  "args": (v101/*: any*/),
  "concreteType": "CollectionTypeConnection",
  "kind": "LinkedField",
  "name": "collections",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CollectionTypeEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CollectionType",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v94/*: any*/),
            (v27/*: any*/),
            (v34/*: any*/),
            (v63/*: any*/),
            (v55/*: any*/),
            (v96/*: any*/)
          ],
          "storageKey": null
        },
        (v97/*: any*/)
      ],
      "storageKey": null
    },
    (v98/*: any*/)
  ],
  "storageKey": null
},
v103 = {
  "alias": null,
  "args": (v101/*: any*/),
  "filters": [
    "assetOwner",
    "assetCreator",
    "onlyPrivateAssets",
    "chains",
    "includeHidden",
    "parents",
    "query",
    "sortBy"
  ],
  "handle": "connection",
  "key": "CollectionFilter_collections",
  "kind": "LinkedHandle",
  "name": "collections"
},
v104 = [
  (v36/*: any*/),
  (v37/*: any*/),
  (v39/*: any*/),
  (v53/*: any*/),
  (v65/*: any*/),
  (v42/*: any*/),
  (v66/*: any*/),
  (v67/*: any*/),
  (v47/*: any*/),
  (v48/*: any*/),
  (v49/*: any*/),
  (v50/*: any*/)
],
v105 = [
  (v36/*: any*/),
  (v37/*: any*/),
  (v39/*: any*/),
  (v65/*: any*/),
  (v24/*: any*/),
  (v54/*: any*/),
  (v42/*: any*/),
  (v66/*: any*/),
  (v67/*: any*/),
  (v47/*: any*/),
  (v48/*: any*/),
  (v49/*: any*/),
  (v50/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/),
      (v18/*: any*/),
      (v19/*: any*/),
      (v20/*: any*/),
      (v21/*: any*/),
      (v22/*: any*/),
      (v23/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "accountQuery",
    "selections": [
      {
        "alias": null,
        "args": (v25/*: any*/),
        "concreteType": "AccountType",
        "kind": "LinkedField",
        "name": "account",
        "plural": false,
        "selections": [
          (v26/*: any*/),
          (v27/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "UserType",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v28/*: any*/),
              (v29/*: any*/)
            ],
            "storageKey": null
          },
          (v30/*: any*/),
          {
            "args": [
              {
                "kind": "Variable",
                "name": "isCurrentUser",
                "variableName": "isCurrentUser"
              }
            ],
            "kind": "FragmentSpread",
            "name": "profilePageQueries_account"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AccountHeader_data"
          },
          {
            "kind": "InlineDataFragmentSpread",
            "name": "wallet_accountKey",
            "selections": [
              (v26/*: any*/)
            ]
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v32/*: any*/),
        "concreteType": "CollectionType",
        "kind": "LinkedField",
        "name": "collection",
        "plural": false,
        "selections": [
          (v33/*: any*/),
          (v27/*: any*/),
          (v34/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "sidebarCollected",
        "args": null,
        "concreteType": "Query",
        "kind": "LinkedField",
        "name": "query",
        "plural": false,
        "selections": [
          {
            "args": (v25/*: any*/),
            "kind": "FragmentSpread",
            "name": "profilePageQueries_collected"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "sidebarCreated",
        "args": null,
        "concreteType": "Query",
        "kind": "LinkedField",
        "name": "query",
        "plural": false,
        "selections": [
          {
            "args": (v25/*: any*/),
            "kind": "FragmentSpread",
            "name": "profilePageQueries_created"
          }
        ],
        "storageKey": null
      },
      {
        "condition": "isAssetsTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "assets",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "args": [
                  (v35/*: any*/),
                  (v36/*: any*/),
                  (v37/*: any*/),
                  (v31/*: any*/),
                  (v38/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "collectionSortBy",
                    "value": "ASSET_COUNT"
                  },
                  (v39/*: any*/),
                  (v24/*: any*/),
                  (v40/*: any*/),
                  (v41/*: any*/),
                  (v42/*: any*/),
                  (v43/*: any*/),
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/),
                  (v48/*: any*/),
                  (v49/*: any*/),
                  (v50/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "AssetSearch_data"
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isActivityTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "activity",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "args": [
                  (v36/*: any*/),
                  (v37/*: any*/),
                  (v31/*: any*/),
                  (v38/*: any*/),
                  (v51/*: any*/),
                  (v39/*: any*/),
                  {
                    "kind": "Variable",
                    "name": "eventTypes",
                    "variableName": "eventTypes"
                  },
                  (v24/*: any*/),
                  (v40/*: any*/),
                  {
                    "kind": "Variable",
                    "name": "isSingleCollection",
                    "variableName": "isSingleCollection"
                  }
                ],
                "kind": "FragmentSpread",
                "name": "ActivitySearch_data"
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isOffersTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "offers",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "args": [
                  (v36/*: any*/),
                  (v37/*: any*/),
                  (v38/*: any*/),
                  (v51/*: any*/),
                  (v39/*: any*/),
                  (v24/*: any*/),
                  (v40/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "OfferSearch_data"
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isCreatedTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "created",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "args": [
                  (v36/*: any*/),
                  (v37/*: any*/),
                  (v31/*: any*/),
                  (v38/*: any*/),
                  (v52/*: any*/),
                  (v39/*: any*/),
                  (v53/*: any*/),
                  (v41/*: any*/),
                  (v42/*: any*/),
                  (v43/*: any*/),
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/),
                  (v48/*: any*/),
                  (v49/*: any*/),
                  (v50/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "AssetSearch_data"
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isPrivateTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "private",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "args": [
                  (v35/*: any*/),
                  (v36/*: any*/),
                  (v37/*: any*/),
                  (v31/*: any*/),
                  (v38/*: any*/),
                  (v52/*: any*/),
                  (v39/*: any*/),
                  (v24/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "includeCollectionFilter",
                    "value": false
                  },
                  {
                    "kind": "Literal",
                    "name": "includeHiddenCollections",
                    "value": true
                  },
                  (v41/*: any*/),
                  (v54/*: any*/),
                  (v42/*: any*/),
                  (v43/*: any*/),
                  (v44/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "shouldShowQuantity",
                    "value": true
                  },
                  (v46/*: any*/),
                  (v47/*: any*/),
                  (v48/*: any*/),
                  (v49/*: any*/),
                  (v50/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "AssetSearch_data"
              }
            ],
            "storageKey": null
          }
        ]
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v5/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v12/*: any*/),
      (v10/*: any*/),
      (v14/*: any*/),
      (v13/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/),
      (v18/*: any*/),
      (v20/*: any*/),
      (v21/*: any*/),
      (v22/*: any*/),
      (v23/*: any*/),
      (v19/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "Operation",
    "name": "accountQuery",
    "selections": [
      {
        "alias": null,
        "args": (v25/*: any*/),
        "concreteType": "AccountType",
        "kind": "LinkedField",
        "name": "account",
        "plural": false,
        "selections": [
          (v26/*: any*/),
          (v27/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "UserType",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v28/*: any*/),
              (v29/*: any*/),
              (v55/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "favoriteAssetCount",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bio",
            "storageKey": null
          },
          (v56/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "config",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "discordId",
            "storageKey": null
          },
          (v57/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Name",
            "kind": "LinkedField",
            "name": "names",
            "plural": true,
            "selections": [
              (v34/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "type",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "displayName",
            "storageKey": null
          },
          (v30/*: any*/),
          (v55/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v32/*: any*/),
        "concreteType": "CollectionType",
        "kind": "LinkedField",
        "name": "collection",
        "plural": false,
        "selections": [
          (v33/*: any*/),
          (v27/*: any*/),
          (v34/*: any*/),
          (v55/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "sidebarCollected",
        "args": null,
        "concreteType": "Query",
        "kind": "LinkedField",
        "name": "query",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              (v58/*: any*/),
              (v24/*: any*/)
            ],
            "concreteType": "SearchTypeConnection",
            "kind": "LinkedField",
            "name": "search",
            "plural": false,
            "selections": (v60/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "sidebarCreated",
        "args": null,
        "concreteType": "Query",
        "kind": "LinkedField",
        "name": "query",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "creator",
                "variableName": "identity"
              },
              (v58/*: any*/),
              {
                "kind": "Literal",
                "name": "resultType",
                "value": "ASSETS"
              }
            ],
            "concreteType": "SearchTypeConnection",
            "kind": "LinkedField",
            "name": "search",
            "plural": false,
            "selections": (v60/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "condition": "isAssetsTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "assets",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              (v61/*: any*/),
              (v64/*: any*/),
              {
                "alias": null,
                "args": (v68/*: any*/),
                "concreteType": "SearchTypeConnection",
                "kind": "LinkedField",
                "name": "search",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SearchTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SearchResultType",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetType",
                            "kind": "LinkedField",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v70/*: any*/),
                              (v57/*: any*/),
                              (v71/*: any*/),
                              (v72/*: any*/),
                              (v76/*: any*/),
                              (v27/*: any*/),
                              (v34/*: any*/),
                              (v55/*: any*/),
                              (v77/*: any*/),
                              (v78/*: any*/),
                              (v79/*: any*/),
                              (v80/*: any*/),
                              (v33/*: any*/),
                              (v81/*: any*/),
                              (v82/*: any*/),
                              (v88/*: any*/),
                              (v83/*: any*/),
                              (v90/*: any*/),
                              (v92/*: any*/),
                              {
                                "condition": "isAssetsTab",
                                "kind": "Condition",
                                "passingValue": true,
                                "selections": [
                                  (v93/*: any*/)
                                ]
                              }
                            ],
                            "storageKey": null
                          },
                          (v95/*: any*/),
                          (v96/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v97/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v59/*: any*/),
                  (v98/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v68/*: any*/),
                "filters": (v99/*: any*/),
                "handle": "connection",
                "key": "AssetSearch_search",
                "kind": "LinkedHandle",
                "name": "search"
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isActivityTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "activity",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              (v61/*: any*/),
              (v100/*: any*/),
              (v102/*: any*/),
              (v103/*: any*/),
              {
                "condition": "isSingleCollection",
                "kind": "Condition",
                "passingValue": true,
                "selections": [
                  {
                    "alias": null,
                    "args": (v32/*: any*/),
                    "concreteType": "CollectionType",
                    "kind": "LinkedField",
                    "name": "collection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "includeTradingHistory",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isOffersTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "offers",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              (v100/*: any*/),
              (v102/*: any*/),
              (v103/*: any*/)
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isCreatedTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "created",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              (v61/*: any*/),
              (v64/*: any*/),
              {
                "alias": null,
                "args": (v104/*: any*/),
                "concreteType": "SearchTypeConnection",
                "kind": "LinkedField",
                "name": "search",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SearchTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SearchResultType",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetType",
                            "kind": "LinkedField",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v70/*: any*/),
                              (v57/*: any*/),
                              (v71/*: any*/),
                              (v72/*: any*/),
                              (v76/*: any*/),
                              (v27/*: any*/),
                              (v34/*: any*/),
                              (v55/*: any*/),
                              (v77/*: any*/),
                              (v78/*: any*/),
                              (v79/*: any*/),
                              (v80/*: any*/),
                              (v33/*: any*/),
                              (v81/*: any*/),
                              (v82/*: any*/),
                              (v88/*: any*/),
                              (v83/*: any*/),
                              (v90/*: any*/),
                              (v92/*: any*/),
                              {
                                "condition": "isAssetsTab",
                                "kind": "Condition",
                                "passingValue": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": (v91/*: any*/),
                                    "kind": "ScalarField",
                                    "name": "ownedQuantity",
                                    "storageKey": "ownedQuantity(identity:{})"
                                  }
                                ]
                              }
                            ],
                            "storageKey": null
                          },
                          (v95/*: any*/),
                          (v96/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v97/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v59/*: any*/),
                  (v98/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v104/*: any*/),
                "filters": (v99/*: any*/),
                "handle": "connection",
                "key": "AssetSearch_search",
                "kind": "LinkedHandle",
                "name": "search"
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isPrivateTab",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": "private",
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              (v61/*: any*/),
              (v64/*: any*/),
              {
                "alias": null,
                "args": (v105/*: any*/),
                "concreteType": "SearchTypeConnection",
                "kind": "LinkedField",
                "name": "search",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SearchTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SearchResultType",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetType",
                            "kind": "LinkedField",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v70/*: any*/),
                              (v57/*: any*/),
                              (v71/*: any*/),
                              (v72/*: any*/),
                              (v76/*: any*/),
                              (v27/*: any*/),
                              (v34/*: any*/),
                              (v55/*: any*/),
                              (v77/*: any*/),
                              (v78/*: any*/),
                              (v79/*: any*/),
                              (v80/*: any*/),
                              (v33/*: any*/),
                              (v93/*: any*/),
                              (v81/*: any*/),
                              (v82/*: any*/),
                              (v88/*: any*/),
                              (v83/*: any*/),
                              (v90/*: any*/),
                              (v92/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v95/*: any*/),
                          (v96/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v97/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v59/*: any*/),
                  (v98/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v105/*: any*/),
                "filters": (v99/*: any*/),
                "handle": "connection",
                "key": "AssetSearch_search",
                "kind": "LinkedHandle",
                "name": "search"
              }
            ],
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "ebee1af2e8de97b1c33ec97a0145af43",
    "id": null,
    "metadata": {},
    "name": "accountQuery",
    "operationKind": "query",
    "text": "query accountQuery(\n  $categories: [CollectionSlug!]\n  $chains: [ChainScalar!]\n  $collection: CollectionSlug\n  $collectionQuery: String\n  $collections: [CollectionSlug!]\n  $identity: IdentityInputType\n  $creator: IdentityInputType\n  $isActivityTab: Boolean!\n  $isAssetsTab: Boolean!\n  $isOffersTab: Boolean!\n  $isCreatedTab: Boolean!\n  $isPrivateTab: Boolean!\n  $isPrivate: Boolean!\n  $isSingleCollection: Boolean!\n  $numericTraits: [TraitRangeType!]\n  $query: String\n  $resultModel: SearchResultModel\n  $sortAscending: Boolean\n  $sortBy: SearchSortBy\n  $stringTraits: [TraitInputType!]\n  $toggles: [SearchToggle!]\n  $showContextMenu: Boolean!\n  $isCurrentUser: Boolean!\n) {\n  account(identity: $identity) {\n    address\n    imageUrl\n    user {\n      username\n      publicUsername\n      id\n    }\n    ...profilePageQueries_account_1CMIO8\n    ...AccountHeader_data\n    ...wallet_accountKey\n    privateAssetCount\n    id\n  }\n  collection(collection: $collection) {\n    description\n    imageUrl\n    name\n    id\n  }\n  sidebarCollected: query {\n    ...profilePageQueries_collected_3StDC7\n  }\n  sidebarCreated: query {\n    ...profilePageQueries_created_3StDC7\n  }\n  assets: query @include(if: $isAssetsTab) {\n    ...AssetSearch_data_3u637c\n  }\n  activity: query @include(if: $isActivityTab) {\n    ...ActivitySearch_data_3v36wc\n  }\n  offers: query @include(if: $isOffersTab) {\n    ...OfferSearch_data_3HWMrt\n  }\n  created: query @include(if: $isCreatedTab) {\n    ...AssetSearch_data_1Wp6pN\n  }\n  private: query @include(if: $isPrivateTab) {\n    ...AssetSearch_data_11hSR7\n  }\n}\n\nfragment AccountHeader_data on AccountType {\n  address\n  bio\n  bannerImageUrl\n  config\n  discordId\n  relayId\n  names {\n    name\n    type\n  }\n  displayName\n  ...accounts_url\n  ...ProfileImage_data\n}\n\nfragment ActivitySearchFilter_data_23FYhq on Query {\n  ...CollectionFilter_data_5wVB4\n}\n\nfragment ActivitySearch_data_3v36wc on Query {\n  collection(collection: $collection) @include(if: $isSingleCollection) {\n    includeTradingHistory\n    id\n  }\n  ...CollectionHeadMetadata_data_2YoIWt\n  ...ActivitySearchFilter_data_23FYhq\n  ...SearchPills_data_2Kg4Sq\n}\n\nfragment AssetCardContent_assetBundle on AssetBundleType {\n  assetQuantities(first: 18) {\n    edges {\n      node {\n        asset {\n          relayId\n          ...AssetMedia_asset\n          id\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardContent_asset_27d9G3 on AssetType {\n  relayId\n  name\n  ...AssetMedia_asset\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  tokenId\n  collection {\n    slug\n    id\n  }\n  isDelisted\n  ...AssetContextMenu_data_3z4lq0 @include(if: $showContextMenu)\n}\n\nfragment AssetCardFooter_assetBundle on AssetBundleType {\n  name\n  assetCount\n  assetQuantities(first: 18) {\n    edges {\n      node {\n        asset {\n          collection {\n            name\n            relayId\n            isVerified\n            id\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n  assetEventData {\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardFooter_asset_1xJxfu on AssetType {\n  ownedQuantity(identity: {}) @include(if: $isAssetsTab)\n  name\n  tokenId\n  collection {\n    name\n    isVerified\n    id\n  }\n  hasUnlockableContent\n  isDelisted\n  isFrozen\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  assetEventData {\n    firstTransfer {\n      timestamp\n    }\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  decimals\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardFooter_asset_206ilR on AssetType {\n  ownedQuantity(identity: $identity)\n  name\n  tokenId\n  collection {\n    name\n    isVerified\n    id\n  }\n  hasUnlockableContent\n  isDelisted\n  isFrozen\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  assetEventData {\n    firstTransfer {\n      timestamp\n    }\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  decimals\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardFooter_asset_3RLB6f on AssetType {\n  ownedQuantity(identity: $identity) @include(if: $isAssetsTab)\n  name\n  tokenId\n  collection {\n    name\n    isVerified\n    id\n  }\n  hasUnlockableContent\n  isDelisted\n  isFrozen\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  assetEventData {\n    firstTransfer {\n      timestamp\n    }\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  decimals\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardHeader_data on AssetType {\n  relayId\n  favoritesCount\n  isDelisted\n  isFavorite\n}\n\nfragment AssetContextMenu_data_3z4lq0 on AssetType {\n  ...asset_edit_url\n  ...itemEvents_data\n  isDelisted\n  isEditable {\n    value\n    reason\n  }\n  isListable\n  ownership(identity: {}) {\n    isPrivate\n    quantity\n  }\n  creator {\n    address\n    id\n  }\n  collection {\n    isAuthorizedEditor\n    id\n  }\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    description\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    hidden\n    name\n    slug\n    id\n  }\n  description\n  name\n  tokenId\n  imageUrl\n  isDelisted\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment AssetSearchList_data_164hN9 on SearchResultType {\n  asset {\n    assetContract {\n      address\n      chain\n      id\n    }\n    relayId\n    tokenId\n    ...AssetSelectionItem_data\n    ...asset_url\n    id\n  }\n  assetBundle {\n    relayId\n    id\n  }\n  ...Asset_data_164hN9\n}\n\nfragment AssetSearchList_data_19CeED on SearchResultType {\n  asset {\n    assetContract {\n      address\n      chain\n      id\n    }\n    relayId\n    tokenId\n    ...AssetSelectionItem_data\n    ...asset_url\n    id\n  }\n  assetBundle {\n    relayId\n    id\n  }\n  ...Asset_data_19CeED\n}\n\nfragment AssetSearchList_data_4UtZc on SearchResultType {\n  asset {\n    assetContract {\n      address\n      chain\n      id\n    }\n    relayId\n    tokenId\n    ...AssetSelectionItem_data\n    ...asset_url\n    id\n  }\n  assetBundle {\n    relayId\n    id\n  }\n  ...Asset_data_4UtZc\n}\n\nfragment AssetSearch_data_11hSR7 on Query {\n  ...CollectionHeadMetadata_data_2YoIWt\n  ...SearchPills_data_2Kg4Sq\n  search(chains: $chains, categories: $categories, collections: $collections, first: 32, identity: $identity, numericTraits: $numericTraits, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, isPrivate: $isPrivate) {\n    edges {\n      node {\n        ...AssetSearchList_data_4UtZc\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AssetSearch_data_1Wp6pN on Query {\n  ...CollectionHeadMetadata_data_2YoIWt\n  ...SearchPills_data_2Kg4Sq\n  search(chains: $chains, categories: $categories, collections: $collections, first: 32, numericTraits: $numericTraits, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, creator: $creator) {\n    edges {\n      node {\n        ...AssetSearchList_data_164hN9\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AssetSearch_data_3u637c on Query {\n  ...CollectionHeadMetadata_data_2YoIWt\n  ...SearchPills_data_2Kg4Sq\n  search(chains: $chains, categories: $categories, collections: $collections, first: 32, identity: $identity, numericTraits: $numericTraits, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles) {\n    edges {\n      node {\n        ...AssetSearchList_data_19CeED\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AssetSelectionItem_data on AssetType {\n  backgroundColor\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    id\n  }\n  imageUrl\n  name\n  relayId\n}\n\nfragment Asset_data_164hN9 on SearchResultType {\n  asset {\n    assetContract {\n      chain\n      id\n    }\n    isDelisted\n    ...AssetCardHeader_data\n    ...AssetCardContent_asset_27d9G3\n    ...AssetCardFooter_asset_1xJxfu\n    ...AssetMedia_asset\n    ...asset_url\n    ...itemEvents_data\n    id\n  }\n  assetBundle {\n    slug\n    ...AssetCardContent_assetBundle\n    ...AssetCardFooter_assetBundle\n    id\n  }\n}\n\nfragment Asset_data_19CeED on SearchResultType {\n  asset {\n    assetContract {\n      chain\n      id\n    }\n    isDelisted\n    ...AssetCardHeader_data\n    ...AssetCardContent_asset_27d9G3\n    ...AssetCardFooter_asset_3RLB6f\n    ...AssetMedia_asset\n    ...asset_url\n    ...itemEvents_data\n    id\n  }\n  assetBundle {\n    slug\n    ...AssetCardContent_assetBundle\n    ...AssetCardFooter_assetBundle\n    id\n  }\n}\n\nfragment Asset_data_4UtZc on SearchResultType {\n  asset {\n    assetContract {\n      chain\n      id\n    }\n    isDelisted\n    ...AssetCardHeader_data\n    ...AssetCardContent_asset_27d9G3\n    ...AssetCardFooter_asset_206ilR\n    ...AssetMedia_asset\n    ...asset_url\n    ...itemEvents_data\n    id\n  }\n  assetBundle {\n    slug\n    ...AssetCardContent_assetBundle\n    ...AssetCardFooter_assetBundle\n    id\n  }\n}\n\nfragment CollectionFilter_data_5wVB4 on Query {\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\n    edges {\n      node {\n        assetCount\n        imageUrl\n        name\n        slug\n        id\n      }\n    }\n  }\n  collections(chains: $chains, first: 100, includeHidden: false, parents: $categories, query: $collectionQuery, sortBy: SEVEN_DAY_VOLUME) {\n    edges {\n      node {\n        assetCount\n        imageUrl\n        name\n        slug\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment CollectionHeadMetadata_data_2YoIWt on Query {\n  collection(collection: $collection) {\n    bannerImageUrl\n    description\n    imageUrl\n    name\n    id\n  }\n}\n\nfragment CollectionModalContent_data on CollectionType {\n  description\n  imageUrl\n  name\n  slug\n}\n\nfragment OfferSearchFilter_data_23FYhq on Query {\n  ...CollectionFilter_data_5wVB4\n}\n\nfragment OfferSearch_data_3HWMrt on Query {\n  ...OfferSearchFilter_data_23FYhq\n  ...SearchPills_data_2Kg4Sq\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n  address\n}\n\nfragment SearchPills_data_2Kg4Sq on Query {\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\n    edges {\n      node {\n        imageUrl\n        name\n        slug\n        ...CollectionModalContent_data\n        id\n      }\n    }\n  }\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment asset_edit_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n  collection {\n    slug\n    id\n  }\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment itemEvents_data on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment profilePageQueries_account_1CMIO8 on AccountType {\n  user {\n    favoriteAssetCount\n    id\n  }\n  privateAssetCount @include(if: $isCurrentUser)\n}\n\nfragment profilePageQueries_collected_3StDC7 on Query {\n  search(identity: $identity, first: 0) {\n    totalCount\n  }\n}\n\nfragment profilePageQueries_created_3StDC7 on Query {\n  search(creator: $identity, first: 0, resultType: ASSETS) {\n    totalCount\n  }\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n}\n"
  }
};
})();
(node as any).hash = '7bba4c1f414a7370da35842206dad2f2';
export default node;
