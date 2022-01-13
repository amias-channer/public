/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionSort = "ASSET_COUNT" | "AVERAGE_PRICE" | "CREATED_DATE" | "MARKET_CAP" | "NAME" | "NUM_OWNERS" | "NUM_REPORTS" | "ONE_DAY_VOLUME" | "SEVEN_DAY_AVERAGE_PRICE" | "SEVEN_DAY_CHANGE" | "SEVEN_DAY_SALES" | "SEVEN_DAY_VOLUME" | "THIRTY_DAY_VOLUME" | "TOTAL_SALES" | "TOTAL_SUPPLY" | "TOTAL_VOLUME" | "%future added value";
export type PriceFilterSymbol = "ETH" | "USD" | "%future added value";
export type SafelistRequestStatus = "APPROVED" | "NOT_REQUESTED" | "REQUESTED" | "VERIFIED" | "%future added value";
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
export type PriceFilterType = {
    symbol: PriceFilterSymbol;
    min?: number | null;
    max?: number | null;
};
export type TraitInputType = {
    name: string;
    values: Array<string>;
};
export type AssetSearchQueryVariables = {
    categories?: Array<string> | null;
    chains?: Array<| "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value"> | null;
    collection?: string | null;
    collectionQuery?: string | null;
    collectionSortBy?: CollectionSort | null;
    collections?: Array<string> | null;
    count?: number | null;
    cursor?: string | null;
    identity?: IdentityInputType | null;
    includeHiddenCollections?: boolean | null;
    numericTraits?: Array<TraitRangeType> | null;
    paymentAssets?: Array<string> | null;
    priceFilter?: PriceFilterType | null;
    query?: string | null;
    resultModel?: SearchResultModel | null;
    showContextMenu?: boolean | null;
    shouldShowQuantity?: boolean | null;
    sortAscending?: boolean | null;
    sortBy?: SearchSortBy | null;
    stringTraits?: Array<TraitInputType> | null;
    toggles?: Array<SearchToggle> | null;
    creator?: IdentityInputType | null;
    assetOwner?: IdentityInputType | null;
    isPrivate?: boolean | null;
    safelistRequestStatuses?: Array<SafelistRequestStatus> | null;
};
export type AssetSearchQueryResponse = {
    readonly query: {
        readonly " $fragmentRefs": FragmentRefs<"AssetSearch_data">;
    };
};
export type AssetSearchQuery = {
    readonly response: AssetSearchQueryResponse;
    readonly variables: AssetSearchQueryVariables;
};



/*
query AssetSearchQuery(
  $categories: [CollectionSlug!]
  $chains: [ChainScalar!]
  $collection: CollectionSlug
  $collectionQuery: String
  $collectionSortBy: CollectionSort
  $collections: [CollectionSlug!]
  $count: Int
  $cursor: String
  $identity: IdentityInputType
  $includeHiddenCollections: Boolean
  $numericTraits: [TraitRangeType!]
  $paymentAssets: [PaymentAssetSymbol!]
  $priceFilter: PriceFilterType
  $query: String
  $resultModel: SearchResultModel
  $showContextMenu: Boolean = false
  $shouldShowQuantity: Boolean = false
  $sortAscending: Boolean
  $sortBy: SearchSortBy
  $stringTraits: [TraitInputType!]
  $toggles: [SearchToggle!]
  $creator: IdentityInputType
  $assetOwner: IdentityInputType
  $isPrivate: Boolean
  $safelistRequestStatuses: [SafelistRequestStatus!]
) {
  query {
    ...AssetSearch_data_2hBjZ1
  }
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

fragment AssetCardFooter_asset_fdERL on AssetType {
  ownedQuantity(identity: $identity) @include(if: $shouldShowQuantity)
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

fragment AssetSearchFilter_data_3KTzFc on Query {
  ...CollectionFilter_data_2qccfC
  collection(collection: $collection) {
    numericTraits {
      key
      value {
        max
        min
      }
      ...NumericTraitFilter_data
    }
    stringTraits {
      key
      ...StringTraitFilter_data
    }
    id
  }
  ...PaymentFilter_data_2YoIWt
}

fragment AssetSearchList_data_3Aax2O on SearchResultType {
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
  ...Asset_data_3Aax2O
}

fragment AssetSearch_data_2hBjZ1 on Query {
  ...CollectionHeadMetadata_data_2YoIWt
  ...AssetSearchFilter_data_3KTzFc
  ...SearchPills_data_2Kg4Sq
  search(after: $cursor, chains: $chains, categories: $categories, collections: $collections, first: $count, identity: $identity, numericTraits: $numericTraits, paymentAssets: $paymentAssets, priceFilter: $priceFilter, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, creator: $creator, isPrivate: $isPrivate, safelistRequestStatuses: $safelistRequestStatuses) {
    edges {
      node {
        ...AssetSearchList_data_3Aax2O
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

fragment Asset_data_3Aax2O on SearchResultType {
  asset {
    assetContract {
      chain
      id
    }
    isDelisted
    ...AssetCardHeader_data
    ...AssetCardContent_asset_27d9G3
    ...AssetCardFooter_asset_fdERL
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

fragment CollectionFilter_data_2qccfC on Query {
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
  collections(assetOwner: $assetOwner, assetCreator: $creator, onlyPrivateAssets: $isPrivate, chains: $chains, first: 100, includeHidden: $includeHiddenCollections, parents: $categories, query: $collectionQuery, sortBy: $collectionSortBy) {
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

fragment NumericTraitFilter_data on NumericTraitTypePair {
  key
  value {
    max
    min
  }
}

fragment PaymentFilter_data_2YoIWt on Query {
  paymentAssets(first: 10) {
    edges {
      node {
        symbol
        relayId
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
  PaymentFilter_collection: collection(collection: $collection) {
    paymentAssets {
      symbol
      relayId
      id
    }
    id
  }
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

fragment StringTraitFilter_data on StringTraitType {
  counts {
    count
    value
  }
  key
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
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "assetOwner"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "categories"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "chains"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "collection"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "collectionQuery"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "collectionSortBy"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "collections"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "creator"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "identity"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeHiddenCollections"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isPrivate"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "numericTraits"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "paymentAssets"
},
v15 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "priceFilter"
},
v16 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v17 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resultModel"
},
v18 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "safelistRequestStatuses"
},
v19 = {
  "defaultValue": false,
  "kind": "LocalArgument",
  "name": "shouldShowQuantity"
},
v20 = {
  "defaultValue": false,
  "kind": "LocalArgument",
  "name": "showContextMenu"
},
v21 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortAscending"
},
v22 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v23 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "stringTraits"
},
v24 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "toggles"
},
v25 = {
  "kind": "Variable",
  "name": "assetOwner",
  "variableName": "assetOwner"
},
v26 = {
  "kind": "Variable",
  "name": "categories",
  "variableName": "categories"
},
v27 = {
  "kind": "Variable",
  "name": "chains",
  "variableName": "chains"
},
v28 = {
  "kind": "Variable",
  "name": "collection",
  "variableName": "collection"
},
v29 = {
  "kind": "Variable",
  "name": "collections",
  "variableName": "collections"
},
v30 = {
  "kind": "Variable",
  "name": "creator",
  "variableName": "creator"
},
v31 = {
  "kind": "Variable",
  "name": "identity",
  "variableName": "identity"
},
v32 = {
  "kind": "Variable",
  "name": "isPrivate",
  "variableName": "isPrivate"
},
v33 = {
  "kind": "Variable",
  "name": "numericTraits",
  "variableName": "numericTraits"
},
v34 = {
  "kind": "Variable",
  "name": "paymentAssets",
  "variableName": "paymentAssets"
},
v35 = {
  "kind": "Variable",
  "name": "priceFilter",
  "variableName": "priceFilter"
},
v36 = {
  "kind": "Variable",
  "name": "safelistRequestStatuses",
  "variableName": "safelistRequestStatuses"
},
v37 = {
  "kind": "Variable",
  "name": "sortAscending",
  "variableName": "sortAscending"
},
v38 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v39 = {
  "kind": "Variable",
  "name": "stringTraits",
  "variableName": "stringTraits"
},
v40 = {
  "kind": "Variable",
  "name": "toggles",
  "variableName": "toggles"
},
v41 = [
  (v28/*: any*/)
],
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "assetCount",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v50 = [
  {
    "kind": "Variable",
    "name": "assetCreator",
    "variableName": "creator"
  },
  (v25/*: any*/),
  (v27/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Variable",
    "name": "includeHidden",
    "variableName": "includeHiddenCollections"
  },
  {
    "kind": "Variable",
    "name": "onlyPrivateAssets",
    "variableName": "isPrivate"
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
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "collectionSortBy"
  }
],
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v53 = {
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
v54 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v57 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v26/*: any*/),
  (v27/*: any*/),
  (v29/*: any*/),
  (v30/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v31/*: any*/),
  (v32/*: any*/),
  (v33/*: any*/),
  (v34/*: any*/),
  (v35/*: any*/),
  {
    "kind": "Variable",
    "name": "querystring",
    "variableName": "query"
  },
  {
    "kind": "Variable",
    "name": "resultType",
    "variableName": "resultModel"
  },
  (v36/*: any*/),
  (v37/*: any*/),
  (v38/*: any*/),
  (v39/*: any*/),
  (v40/*: any*/)
],
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tokenId",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v62 = {
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
v63 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hidden",
  "storageKey": null
},
v64 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isVerified",
  "storageKey": null
},
v65 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDelisted",
  "storageKey": null
},
v66 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "animationUrl",
  "storageKey": null
},
v67 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v68 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetType",
  "kind": "LinkedField",
  "name": "asset",
  "plural": false,
  "selections": [
    (v67/*: any*/),
    (v43/*: any*/),
    (v55/*: any*/),
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
        (v59/*: any*/),
        (v45/*: any*/)
      ],
      "storageKey": null
    },
    (v45/*: any*/)
  ],
  "storageKey": null
},
v69 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v70 = [
  (v68/*: any*/),
  (v69/*: any*/),
  (v45/*: any*/)
],
v71 = {
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
      "selections": (v70/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v72 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderType",
  "storageKey": null
},
v73 = {
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
        (v72/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetQuantityType",
          "kind": "LinkedField",
          "name": "paymentAssetQuantity",
          "plural": false,
          "selections": (v70/*: any*/),
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
        (v72/*: any*/),
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
        (v69/*: any*/),
        (v67/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetQuantityType",
          "kind": "LinkedField",
          "name": "paymentAssetQuantity",
          "plural": false,
          "selections": [
            (v69/*: any*/),
            (v68/*: any*/),
            (v45/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
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
      (v23/*: any*/),
      (v24/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AssetSearchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Query",
        "kind": "LinkedField",
        "name": "query",
        "plural": false,
        "selections": [
          {
            "args": [
              (v25/*: any*/),
              (v26/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              {
                "kind": "Variable",
                "name": "collectionQuery",
                "variableName": "collectionQuery"
              },
              {
                "kind": "Variable",
                "name": "collectionSortBy",
                "variableName": "collectionSortBy"
              },
              (v29/*: any*/),
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              (v30/*: any*/),
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              },
              (v31/*: any*/),
              {
                "kind": "Variable",
                "name": "includeHiddenCollections",
                "variableName": "includeHiddenCollections"
              },
              (v32/*: any*/),
              (v33/*: any*/),
              (v34/*: any*/),
              (v35/*: any*/),
              {
                "kind": "Variable",
                "name": "query",
                "variableName": "query"
              },
              {
                "kind": "Variable",
                "name": "resultModel",
                "variableName": "resultModel"
              },
              (v36/*: any*/),
              {
                "kind": "Variable",
                "name": "shouldShowQuantity",
                "variableName": "shouldShowQuantity"
              },
              {
                "kind": "Variable",
                "name": "showContextMenu",
                "variableName": "showContextMenu"
              },
              (v37/*: any*/),
              (v38/*: any*/),
              (v39/*: any*/),
              (v40/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "AssetSearch_data"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/),
      (v20/*: any*/),
      (v19/*: any*/),
      (v21/*: any*/),
      (v22/*: any*/),
      (v23/*: any*/),
      (v24/*: any*/),
      (v8/*: any*/),
      (v0/*: any*/),
      (v12/*: any*/),
      (v18/*: any*/)
    ],
    "kind": "Operation",
    "name": "AssetSearchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Query",
        "kind": "LinkedField",
        "name": "query",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v41/*: any*/),
            "concreteType": "CollectionType",
            "kind": "LinkedField",
            "name": "collection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "bannerImageUrl",
                "storageKey": null
              },
              (v42/*: any*/),
              (v43/*: any*/),
              (v44/*: any*/),
              (v45/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "NumericTraitTypePair",
                "kind": "LinkedField",
                "name": "numericTraits",
                "plural": true,
                "selections": [
                  (v46/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "NumericTraitType",
                    "kind": "LinkedField",
                    "name": "value",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "max",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "min",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StringTraitType",
                "kind": "LinkedField",
                "name": "stringTraits",
                "plural": true,
                "selections": [
                  (v46/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StringTraitCountType",
                    "kind": "LinkedField",
                    "name": "counts",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": null
                      },
                      (v47/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": "selectedCollections",
            "args": [
              (v29/*: any*/),
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
                      (v48/*: any*/),
                      (v43/*: any*/),
                      (v44/*: any*/),
                      (v49/*: any*/),
                      (v45/*: any*/),
                      (v42/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v50/*: any*/),
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
                      (v48/*: any*/),
                      (v43/*: any*/),
                      (v44/*: any*/),
                      (v49/*: any*/),
                      (v45/*: any*/),
                      (v51/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v52/*: any*/)
                ],
                "storageKey": null
              },
              (v53/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v50/*: any*/),
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
          {
            "alias": null,
            "args": (v54/*: any*/),
            "concreteType": "PaymentAssetTypeConnection",
            "kind": "LinkedField",
            "name": "paymentAssets",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PaymentAssetTypeEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PaymentAssetType",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v55/*: any*/),
                      (v56/*: any*/),
                      (v45/*: any*/),
                      (v51/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v52/*: any*/)
                ],
                "storageKey": null
              },
              (v53/*: any*/)
            ],
            "storageKey": "paymentAssets(first:10)"
          },
          {
            "alias": null,
            "args": (v54/*: any*/),
            "filters": [
              "asset_Symbol_Icontains"
            ],
            "handle": "connection",
            "key": "PaymentFilter_paymentAssets",
            "kind": "LinkedHandle",
            "name": "paymentAssets"
          },
          {
            "alias": "PaymentFilter_collection",
            "args": (v41/*: any*/),
            "concreteType": "CollectionType",
            "kind": "LinkedField",
            "name": "collection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PaymentAssetType",
                "kind": "LinkedField",
                "name": "paymentAssets",
                "plural": true,
                "selections": [
                  (v55/*: any*/),
                  (v56/*: any*/),
                  (v45/*: any*/)
                ],
                "storageKey": null
              },
              (v45/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v57/*: any*/),
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetContractType",
                            "kind": "LinkedField",
                            "name": "assetContract",
                            "plural": false,
                            "selections": [
                              (v58/*: any*/),
                              (v59/*: any*/),
                              (v45/*: any*/),
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
                          (v56/*: any*/),
                          (v60/*: any*/),
                          (v61/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CollectionType",
                            "kind": "LinkedField",
                            "name": "collection",
                            "plural": false,
                            "selections": [
                              (v62/*: any*/),
                              (v43/*: any*/),
                              (v45/*: any*/),
                              (v42/*: any*/),
                              (v63/*: any*/),
                              (v44/*: any*/),
                              (v49/*: any*/),
                              (v64/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v43/*: any*/),
                          (v44/*: any*/),
                          (v45/*: any*/),
                          (v65/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "favoritesCount",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isFavorite",
                            "storageKey": null
                          },
                          (v66/*: any*/),
                          (v42/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "hasUnlockableContent",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isFrozen",
                            "storageKey": null
                          },
                          {
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
                              (v71/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v67/*: any*/),
                          (v73/*: any*/),
                          {
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
                                  (v47/*: any*/),
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
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "identity",
                                    "value": {}
                                  }
                                ],
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
                                  (v69/*: any*/)
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
                                  (v58/*: any*/),
                                  (v45/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ]
                          },
                          {
                            "condition": "shouldShowQuantity",
                            "kind": "Condition",
                            "passingValue": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": [
                                  (v31/*: any*/)
                                ],
                                "kind": "ScalarField",
                                "name": "ownedQuantity",
                                "storageKey": null
                              }
                            ]
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetBundleType",
                        "kind": "LinkedField",
                        "name": "assetBundle",
                        "plural": false,
                        "selections": [
                          (v56/*: any*/),
                          (v45/*: any*/),
                          (v49/*: any*/),
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
                                          (v56/*: any*/),
                                          (v66/*: any*/),
                                          (v61/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "CollectionType",
                                            "kind": "LinkedField",
                                            "name": "collection",
                                            "plural": false,
                                            "selections": [
                                              (v42/*: any*/),
                                              (v62/*: any*/),
                                              (v43/*: any*/),
                                              (v63/*: any*/),
                                              (v44/*: any*/),
                                              (v49/*: any*/),
                                              (v45/*: any*/),
                                              (v56/*: any*/),
                                              (v64/*: any*/)
                                            ],
                                            "storageKey": null
                                          },
                                          (v42/*: any*/),
                                          (v44/*: any*/),
                                          (v60/*: any*/),
                                          (v43/*: any*/),
                                          (v65/*: any*/),
                                          (v45/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v45/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "assetQuantities(first:18)"
                          },
                          (v44/*: any*/),
                          (v48/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ESAssetEventDataType",
                            "kind": "LinkedField",
                            "name": "assetEventData",
                            "plural": false,
                            "selections": [
                              (v71/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v73/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v51/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v52/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "totalCount",
                "storageKey": null
              },
              (v53/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v57/*: any*/),
            "filters": [
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
  "params": {
    "cacheID": "5f03697c97e743648d8d4cf014d22b91",
    "id": null,
    "metadata": {},
    "name": "AssetSearchQuery",
    "operationKind": "query",
    "text": "query AssetSearchQuery(\n  $categories: [CollectionSlug!]\n  $chains: [ChainScalar!]\n  $collection: CollectionSlug\n  $collectionQuery: String\n  $collectionSortBy: CollectionSort\n  $collections: [CollectionSlug!]\n  $count: Int\n  $cursor: String\n  $identity: IdentityInputType\n  $includeHiddenCollections: Boolean\n  $numericTraits: [TraitRangeType!]\n  $paymentAssets: [PaymentAssetSymbol!]\n  $priceFilter: PriceFilterType\n  $query: String\n  $resultModel: SearchResultModel\n  $showContextMenu: Boolean = false\n  $shouldShowQuantity: Boolean = false\n  $sortAscending: Boolean\n  $sortBy: SearchSortBy\n  $stringTraits: [TraitInputType!]\n  $toggles: [SearchToggle!]\n  $creator: IdentityInputType\n  $assetOwner: IdentityInputType\n  $isPrivate: Boolean\n  $safelistRequestStatuses: [SafelistRequestStatus!]\n) {\n  query {\n    ...AssetSearch_data_2hBjZ1\n  }\n}\n\nfragment AssetCardContent_assetBundle on AssetBundleType {\n  assetQuantities(first: 18) {\n    edges {\n      node {\n        asset {\n          relayId\n          ...AssetMedia_asset\n          id\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardContent_asset_27d9G3 on AssetType {\n  relayId\n  name\n  ...AssetMedia_asset\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  tokenId\n  collection {\n    slug\n    id\n  }\n  isDelisted\n  ...AssetContextMenu_data_3z4lq0 @include(if: $showContextMenu)\n}\n\nfragment AssetCardFooter_assetBundle on AssetBundleType {\n  name\n  assetCount\n  assetQuantities(first: 18) {\n    edges {\n      node {\n        asset {\n          collection {\n            name\n            relayId\n            isVerified\n            id\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n  assetEventData {\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardFooter_asset_fdERL on AssetType {\n  ownedQuantity(identity: $identity) @include(if: $shouldShowQuantity)\n  name\n  tokenId\n  collection {\n    name\n    isVerified\n    id\n  }\n  hasUnlockableContent\n  isDelisted\n  isFrozen\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  assetEventData {\n    firstTransfer {\n      timestamp\n    }\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  decimals\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardHeader_data on AssetType {\n  relayId\n  favoritesCount\n  isDelisted\n  isFavorite\n}\n\nfragment AssetContextMenu_data_3z4lq0 on AssetType {\n  ...asset_edit_url\n  ...itemEvents_data\n  isDelisted\n  isEditable {\n    value\n    reason\n  }\n  isListable\n  ownership(identity: {}) {\n    isPrivate\n    quantity\n  }\n  creator {\n    address\n    id\n  }\n  collection {\n    isAuthorizedEditor\n    id\n  }\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    description\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    hidden\n    name\n    slug\n    id\n  }\n  description\n  name\n  tokenId\n  imageUrl\n  isDelisted\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment AssetSearchFilter_data_3KTzFc on Query {\n  ...CollectionFilter_data_2qccfC\n  collection(collection: $collection) {\n    numericTraits {\n      key\n      value {\n        max\n        min\n      }\n      ...NumericTraitFilter_data\n    }\n    stringTraits {\n      key\n      ...StringTraitFilter_data\n    }\n    id\n  }\n  ...PaymentFilter_data_2YoIWt\n}\n\nfragment AssetSearchList_data_3Aax2O on SearchResultType {\n  asset {\n    assetContract {\n      address\n      chain\n      id\n    }\n    relayId\n    tokenId\n    ...AssetSelectionItem_data\n    ...asset_url\n    id\n  }\n  assetBundle {\n    relayId\n    id\n  }\n  ...Asset_data_3Aax2O\n}\n\nfragment AssetSearch_data_2hBjZ1 on Query {\n  ...CollectionHeadMetadata_data_2YoIWt\n  ...AssetSearchFilter_data_3KTzFc\n  ...SearchPills_data_2Kg4Sq\n  search(after: $cursor, chains: $chains, categories: $categories, collections: $collections, first: $count, identity: $identity, numericTraits: $numericTraits, paymentAssets: $paymentAssets, priceFilter: $priceFilter, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, creator: $creator, isPrivate: $isPrivate, safelistRequestStatuses: $safelistRequestStatuses) {\n    edges {\n      node {\n        ...AssetSearchList_data_3Aax2O\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AssetSelectionItem_data on AssetType {\n  backgroundColor\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    id\n  }\n  imageUrl\n  name\n  relayId\n}\n\nfragment Asset_data_3Aax2O on SearchResultType {\n  asset {\n    assetContract {\n      chain\n      id\n    }\n    isDelisted\n    ...AssetCardHeader_data\n    ...AssetCardContent_asset_27d9G3\n    ...AssetCardFooter_asset_fdERL\n    ...AssetMedia_asset\n    ...asset_url\n    ...itemEvents_data\n    id\n  }\n  assetBundle {\n    slug\n    ...AssetCardContent_assetBundle\n    ...AssetCardFooter_assetBundle\n    id\n  }\n}\n\nfragment CollectionFilter_data_2qccfC on Query {\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\n    edges {\n      node {\n        assetCount\n        imageUrl\n        name\n        slug\n        id\n      }\n    }\n  }\n  collections(assetOwner: $assetOwner, assetCreator: $creator, onlyPrivateAssets: $isPrivate, chains: $chains, first: 100, includeHidden: $includeHiddenCollections, parents: $categories, query: $collectionQuery, sortBy: $collectionSortBy) {\n    edges {\n      node {\n        assetCount\n        imageUrl\n        name\n        slug\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment CollectionHeadMetadata_data_2YoIWt on Query {\n  collection(collection: $collection) {\n    bannerImageUrl\n    description\n    imageUrl\n    name\n    id\n  }\n}\n\nfragment CollectionModalContent_data on CollectionType {\n  description\n  imageUrl\n  name\n  slug\n}\n\nfragment NumericTraitFilter_data on NumericTraitTypePair {\n  key\n  value {\n    max\n    min\n  }\n}\n\nfragment PaymentFilter_data_2YoIWt on Query {\n  paymentAssets(first: 10) {\n    edges {\n      node {\n        symbol\n        relayId\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  PaymentFilter_collection: collection(collection: $collection) {\n    paymentAssets {\n      symbol\n      relayId\n      id\n    }\n    id\n  }\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment SearchPills_data_2Kg4Sq on Query {\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\n    edges {\n      node {\n        imageUrl\n        name\n        slug\n        ...CollectionModalContent_data\n        id\n      }\n    }\n  }\n}\n\nfragment StringTraitFilter_data on StringTraitType {\n  counts {\n    count\n    value\n  }\n  key\n}\n\nfragment asset_edit_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n  collection {\n    slug\n    id\n  }\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment itemEvents_data on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n"
  }
};
})();
(node as any).hash = '6e4b6f6763cca82402420cb84304a0c5';
export default node;
