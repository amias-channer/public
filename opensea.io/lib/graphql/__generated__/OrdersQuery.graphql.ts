/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderSortOption = "CREATED_DATE" | "MAKER_ASSETS_USD_PRICE" | "OPENED_AT" | "TAKER_ASSETS_USD_PRICE" | "%future added value";
export type IdentityInputType = {
    address?: string | null;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
    name?: string | null;
    username?: string | null;
};
export type ArchetypeInputType = {
    assetContractAddress: string;
    tokenId: string;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
};
export type OrdersQueryVariables = {
    cursor?: string | null;
    count?: number | null;
    excludeMaker?: IdentityInputType | null;
    isExpired?: boolean | null;
    isValid?: boolean | null;
    maker?: IdentityInputType | null;
    makerArchetype?: ArchetypeInputType | null;
    makerAssetIsPayment?: boolean | null;
    takerArchetype?: ArchetypeInputType | null;
    takerAssetCategories?: Array<string> | null;
    takerAssetCollections?: Array<string> | null;
    takerAssetIsOwnedBy?: IdentityInputType | null;
    takerAssetIsPayment?: boolean | null;
    sortAscending?: boolean | null;
    sortBy?: OrderSortOption | null;
    makerAssetBundle?: string | null;
    takerAssetBundle?: string | null;
    expandedMode?: boolean | null;
};
export type OrdersQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"Orders_data">;
};
export type OrdersQuery = {
    readonly response: OrdersQueryResponse;
    readonly variables: OrdersQueryVariables;
};



/*
query OrdersQuery(
  $cursor: String
  $count: Int = 10
  $excludeMaker: IdentityInputType
  $isExpired: Boolean
  $isValid: Boolean
  $maker: IdentityInputType
  $makerArchetype: ArchetypeInputType
  $makerAssetIsPayment: Boolean
  $takerArchetype: ArchetypeInputType
  $takerAssetCategories: [CollectionSlug!]
  $takerAssetCollections: [CollectionSlug!]
  $takerAssetIsOwnedBy: IdentityInputType
  $takerAssetIsPayment: Boolean
  $sortAscending: Boolean
  $sortBy: OrderSortOption
  $makerAssetBundle: BundleSlug
  $takerAssetBundle: BundleSlug
  $expandedMode: Boolean = false
) {
  ...Orders_data_4dn11C
}

fragment AccountLink_data on AccountType {
  address
  user {
    publicUsername
    id
  }
  ...ProfileImage_data
  ...wallet_accountKey
  ...accounts_url
}

fragment AskPrice_data on OrderV2Type {
  dutchAuctionFinalPrice
  openedAt
  priceFnEndedAt
  makerAssetBundle {
    assetQuantities(first: 30) {
      edges {
        node {
          ...quantity_data
          id
        }
      }
    }
    id
  }
  takerAssetBundle {
    assetQuantities(first: 1) {
      edges {
        node {
          ...AssetQuantity_data
          id
        }
      }
    }
    id
  }
}

fragment AssetCell_assetBundle on AssetBundleType {
  assetQuantities(first: 2) {
    edges {
      node {
        asset {
          collection {
            name
            id
          }
          name
          ...AssetMedia_asset
          ...asset_url
          id
        }
        relayId
        id
      }
    }
  }
  name
  slug
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

fragment Orders_data_4dn11C on Query {
  orders(after: $cursor, excludeMaker: $excludeMaker, first: $count, isExpired: $isExpired, isValid: $isValid, maker: $maker, makerArchetype: $makerArchetype, makerAssetIsPayment: $makerAssetIsPayment, takerArchetype: $takerArchetype, takerAssetCategories: $takerAssetCategories, takerAssetCollections: $takerAssetCollections, takerAssetIsOwnedBy: $takerAssetIsOwnedBy, takerAssetIsPayment: $takerAssetIsPayment, sortAscending: $sortAscending, sortBy: $sortBy, makerAssetBundle: $makerAssetBundle, takerAssetBundle: $takerAssetBundle) {
    edges {
      node {
        closedAt
        isFulfillable
        isValid
        oldOrder
        openedAt
        orderType
        maker {
          address
          ...AccountLink_data
          ...wallet_accountKey
          id
        }
        makerAsset: makerAssetBundle {
          assetQuantities(first: 1) {
            edges {
              node {
                asset {
                  assetContract {
                    address
                    chain
                    id
                  }
                  id
                }
                id
              }
            }
          }
          id
        }
        makerAssetBundle {
          assetQuantities(first: 30) {
            edges {
              node {
                ...AssetQuantity_data
                ...quantity_data
                id
              }
            }
          }
          id
        }
        relayId
        side
        taker {
          ...AccountLink_data
          ...wallet_accountKey
          id
          address
        }
        takerAssetBundle {
          assetQuantities(first: 1) {
            edges {
              node {
                asset {
                  ownedQuantity(identity: {})
                  decimals
                  symbol
                  relayId
                  assetContract {
                    address
                    id
                  }
                  id
                }
                quantity
                ...AssetQuantity_data
                ...quantity_data
                id
              }
            }
          }
          id
        }
        ...AskPrice_data
        ...orderLink_data
        makerAssetBundleDisplay: makerAssetBundle @include(if: $expandedMode) {
          ...AssetCell_assetBundle
          id
        }
        takerAssetBundleDisplay: takerAssetBundle @include(if: $expandedMode) {
          ...AssetCell_assetBundle
          id
        }
        ...quantity_remaining
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

fragment accounts_url on AccountType {
  address
  user {
    publicUsername
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

fragment orderLink_data on OrderV2Type {
  makerAssetBundle {
    assetQuantities(first: 30) {
      edges {
        node {
          asset {
            externalLink
            collection {
              externalUrl
              id
            }
            id
          }
          id
        }
      }
    }
    id
  }
}

fragment quantity_data on AssetQuantityType {
  asset {
    decimals
    id
  }
  quantity
}

fragment quantity_remaining on OrderV2Type {
  makerAsset: makerAssetBundle {
    assetQuantities(first: 1) {
      edges {
        node {
          asset {
            decimals
            id
          }
          quantity
          id
        }
      }
    }
    id
  }
  takerAsset: takerAssetBundle {
    assetQuantities(first: 1) {
      edges {
        node {
          asset {
            decimals
            id
          }
          quantity
          id
        }
      }
    }
    id
  }
  remainingQuantity
  side
}

fragment wallet_accountKey on AccountType {
  address
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": 10,
  "kind": "LocalArgument",
  "name": "count"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "excludeMaker"
},
v3 = {
  "defaultValue": false,
  "kind": "LocalArgument",
  "name": "expandedMode"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isExpired"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isValid"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maker"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "makerArchetype"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "makerAssetBundle"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "makerAssetIsPayment"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortAscending"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "takerArchetype"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "takerAssetBundle"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "takerAssetCategories"
},
v15 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "takerAssetCollections"
},
v16 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "takerAssetIsOwnedBy"
},
v17 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "takerAssetIsPayment"
},
v18 = {
  "kind": "Variable",
  "name": "excludeMaker",
  "variableName": "excludeMaker"
},
v19 = {
  "kind": "Variable",
  "name": "isExpired",
  "variableName": "isExpired"
},
v20 = {
  "kind": "Variable",
  "name": "isValid",
  "variableName": "isValid"
},
v21 = {
  "kind": "Variable",
  "name": "maker",
  "variableName": "maker"
},
v22 = {
  "kind": "Variable",
  "name": "makerArchetype",
  "variableName": "makerArchetype"
},
v23 = {
  "kind": "Variable",
  "name": "makerAssetBundle",
  "variableName": "makerAssetBundle"
},
v24 = {
  "kind": "Variable",
  "name": "makerAssetIsPayment",
  "variableName": "makerAssetIsPayment"
},
v25 = {
  "kind": "Variable",
  "name": "sortAscending",
  "variableName": "sortAscending"
},
v26 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v27 = {
  "kind": "Variable",
  "name": "takerArchetype",
  "variableName": "takerArchetype"
},
v28 = {
  "kind": "Variable",
  "name": "takerAssetBundle",
  "variableName": "takerAssetBundle"
},
v29 = {
  "kind": "Variable",
  "name": "takerAssetCategories",
  "variableName": "takerAssetCategories"
},
v30 = {
  "kind": "Variable",
  "name": "takerAssetCollections",
  "variableName": "takerAssetCollections"
},
v31 = {
  "kind": "Variable",
  "name": "takerAssetIsOwnedBy",
  "variableName": "takerAssetIsOwnedBy"
},
v32 = {
  "kind": "Variable",
  "name": "takerAssetIsPayment",
  "variableName": "takerAssetIsPayment"
},
v33 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v18/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v19/*: any*/),
  (v20/*: any*/),
  (v21/*: any*/),
  (v22/*: any*/),
  (v23/*: any*/),
  (v24/*: any*/),
  (v25/*: any*/),
  (v26/*: any*/),
  (v27/*: any*/),
  (v28/*: any*/),
  (v29/*: any*/),
  (v30/*: any*/),
  (v31/*: any*/),
  (v32/*: any*/)
],
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v37 = [
  (v34/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "UserType",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "publicUsername",
        "storageKey": null
      },
      (v35/*: any*/)
    ],
    "storageKey": null
  },
  (v36/*: any*/),
  (v35/*: any*/)
],
v38 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetContractType",
  "kind": "LinkedField",
  "name": "assetContract",
  "plural": false,
  "selections": [
    (v34/*: any*/),
    (v39/*: any*/),
    (v35/*: any*/)
  ],
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "usdSpotPrice",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "blockExplorerLink",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
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
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 2
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
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CollectionType",
                    "kind": "LinkedField",
                    "name": "collection",
                    "plural": false,
                    "selections": [
                      (v47/*: any*/),
                      (v35/*: any*/),
                      (v48/*: any*/),
                      {
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
                      (v36/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hidden",
                        "storageKey": null
                      },
                      (v49/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v47/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "animationUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "backgroundColor",
                    "storageKey": null
                  },
                  (v48/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "tokenId",
                    "storageKey": null
                  },
                  (v36/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isDelisted",
                    "storageKey": null
                  },
                  (v40/*: any*/),
                  (v35/*: any*/)
                ],
                "storageKey": null
              },
              (v46/*: any*/),
              (v35/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "assetQuantities(first:2)"
  },
  (v47/*: any*/),
  (v49/*: any*/),
  (v35/*: any*/)
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
      (v17/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrdersQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v18/*: any*/),
          {
            "kind": "Variable",
            "name": "expandedMode",
            "variableName": "expandedMode"
          },
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/),
          (v28/*: any*/),
          (v29/*: any*/),
          (v30/*: any*/),
          (v31/*: any*/),
          (v32/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "Orders_data"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v9/*: any*/),
      (v12/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v8/*: any*/),
      (v13/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "OrdersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v33/*: any*/),
        "concreteType": "OrderV2TypeConnection",
        "kind": "LinkedField",
        "name": "orders",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrderV2TypeEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrderV2Type",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "closedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFulfillable",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isValid",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "oldOrder",
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
                    "name": "orderType",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountType",
                    "kind": "LinkedField",
                    "name": "maker",
                    "plural": false,
                    "selections": (v37/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": "makerAsset",
                    "args": null,
                    "concreteType": "AssetBundleType",
                    "kind": "LinkedField",
                    "name": "makerAssetBundle",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": (v38/*: any*/),
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
                                      (v40/*: any*/),
                                      (v35/*: any*/),
                                      (v41/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v35/*: any*/),
                                  (v42/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "assetQuantities(first:1)"
                      },
                      (v35/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AssetBundleType",
                    "kind": "LinkedField",
                    "name": "makerAssetBundle",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 30
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
                                      (v41/*: any*/),
                                      (v36/*: any*/),
                                      (v43/*: any*/),
                                      (v44/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "AssetContractType",
                                        "kind": "LinkedField",
                                        "name": "assetContract",
                                        "plural": false,
                                        "selections": [
                                          (v45/*: any*/),
                                          (v39/*: any*/),
                                          (v35/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v35/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "externalLink",
                                        "storageKey": null
                                      },
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
                                            "name": "externalUrl",
                                            "storageKey": null
                                          },
                                          (v35/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  (v42/*: any*/),
                                  (v35/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "assetQuantities(first:30)"
                      },
                      (v35/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v46/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "side",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountType",
                    "kind": "LinkedField",
                    "name": "taker",
                    "plural": false,
                    "selections": (v37/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AssetBundleType",
                    "kind": "LinkedField",
                    "name": "takerAssetBundle",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": (v38/*: any*/),
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
                                      {
                                        "alias": null,
                                        "args": [
                                          {
                                            "kind": "Literal",
                                            "name": "identity",
                                            "value": {}
                                          }
                                        ],
                                        "kind": "ScalarField",
                                        "name": "ownedQuantity",
                                        "storageKey": "ownedQuantity(identity:{})"
                                      },
                                      (v41/*: any*/),
                                      (v43/*: any*/),
                                      (v46/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "AssetContractType",
                                        "kind": "LinkedField",
                                        "name": "assetContract",
                                        "plural": false,
                                        "selections": [
                                          (v34/*: any*/),
                                          (v35/*: any*/),
                                          (v45/*: any*/),
                                          (v39/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v35/*: any*/),
                                      (v36/*: any*/),
                                      (v44/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v42/*: any*/),
                                  (v35/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "assetQuantities(first:1)"
                      },
                      (v35/*: any*/)
                    ],
                    "storageKey": null
                  },
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
                    "name": "priceFnEndedAt",
                    "storageKey": null
                  },
                  {
                    "alias": "takerAsset",
                    "args": null,
                    "concreteType": "AssetBundleType",
                    "kind": "LinkedField",
                    "name": "takerAssetBundle",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": (v38/*: any*/),
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
                                      (v41/*: any*/),
                                      (v35/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v42/*: any*/),
                                  (v35/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "assetQuantities(first:1)"
                      },
                      (v35/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "remainingQuantity",
                    "storageKey": null
                  },
                  (v35/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  },
                  {
                    "condition": "expandedMode",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": [
                      {
                        "alias": "makerAssetBundleDisplay",
                        "args": null,
                        "concreteType": "AssetBundleType",
                        "kind": "LinkedField",
                        "name": "makerAssetBundle",
                        "plural": false,
                        "selections": (v50/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": "takerAssetBundleDisplay",
                        "args": null,
                        "concreteType": "AssetBundleType",
                        "kind": "LinkedField",
                        "name": "takerAssetBundle",
                        "plural": false,
                        "selections": (v50/*: any*/),
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
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
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
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v33/*: any*/),
        "filters": [
          "excludeMaker",
          "isExpired",
          "isValid",
          "maker",
          "makerArchetype",
          "makerAssetIsPayment",
          "takerArchetype",
          "takerAssetCategories",
          "takerAssetCollections",
          "takerAssetIsOwnedBy",
          "takerAssetIsPayment",
          "sortAscending",
          "sortBy",
          "makerAssetBundle",
          "takerAssetBundle"
        ],
        "handle": "connection",
        "key": "Orders_orders",
        "kind": "LinkedHandle",
        "name": "orders"
      }
    ]
  },
  "params": {
    "cacheID": "076d4462c975675c35d1625456d48395",
    "id": null,
    "metadata": {},
    "name": "OrdersQuery",
    "operationKind": "query",
    "text": "query OrdersQuery(\n  $cursor: String\n  $count: Int = 10\n  $excludeMaker: IdentityInputType\n  $isExpired: Boolean\n  $isValid: Boolean\n  $maker: IdentityInputType\n  $makerArchetype: ArchetypeInputType\n  $makerAssetIsPayment: Boolean\n  $takerArchetype: ArchetypeInputType\n  $takerAssetCategories: [CollectionSlug!]\n  $takerAssetCollections: [CollectionSlug!]\n  $takerAssetIsOwnedBy: IdentityInputType\n  $takerAssetIsPayment: Boolean\n  $sortAscending: Boolean\n  $sortBy: OrderSortOption\n  $makerAssetBundle: BundleSlug\n  $takerAssetBundle: BundleSlug\n  $expandedMode: Boolean = false\n) {\n  ...Orders_data_4dn11C\n}\n\nfragment AccountLink_data on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n  ...ProfileImage_data\n  ...wallet_accountKey\n  ...accounts_url\n}\n\nfragment AskPrice_data on OrderV2Type {\n  dutchAuctionFinalPrice\n  openedAt\n  priceFnEndedAt\n  makerAssetBundle {\n    assetQuantities(first: 30) {\n      edges {\n        node {\n          ...quantity_data\n          id\n        }\n      }\n    }\n    id\n  }\n  takerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          ...AssetQuantity_data\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment AssetCell_assetBundle on AssetBundleType {\n  assetQuantities(first: 2) {\n    edges {\n      node {\n        asset {\n          collection {\n            name\n            id\n          }\n          name\n          ...AssetMedia_asset\n          ...asset_url\n          id\n        }\n        relayId\n        id\n      }\n    }\n  }\n  name\n  slug\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    description\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    hidden\n    name\n    slug\n    id\n  }\n  description\n  name\n  tokenId\n  imageUrl\n  isDelisted\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment Orders_data_4dn11C on Query {\n  orders(after: $cursor, excludeMaker: $excludeMaker, first: $count, isExpired: $isExpired, isValid: $isValid, maker: $maker, makerArchetype: $makerArchetype, makerAssetIsPayment: $makerAssetIsPayment, takerArchetype: $takerArchetype, takerAssetCategories: $takerAssetCategories, takerAssetCollections: $takerAssetCollections, takerAssetIsOwnedBy: $takerAssetIsOwnedBy, takerAssetIsPayment: $takerAssetIsPayment, sortAscending: $sortAscending, sortBy: $sortBy, makerAssetBundle: $makerAssetBundle, takerAssetBundle: $takerAssetBundle) {\n    edges {\n      node {\n        closedAt\n        isFulfillable\n        isValid\n        oldOrder\n        openedAt\n        orderType\n        maker {\n          address\n          ...AccountLink_data\n          ...wallet_accountKey\n          id\n        }\n        makerAsset: makerAssetBundle {\n          assetQuantities(first: 1) {\n            edges {\n              node {\n                asset {\n                  assetContract {\n                    address\n                    chain\n                    id\n                  }\n                  id\n                }\n                id\n              }\n            }\n          }\n          id\n        }\n        makerAssetBundle {\n          assetQuantities(first: 30) {\n            edges {\n              node {\n                ...AssetQuantity_data\n                ...quantity_data\n                id\n              }\n            }\n          }\n          id\n        }\n        relayId\n        side\n        taker {\n          ...AccountLink_data\n          ...wallet_accountKey\n          id\n          address\n        }\n        takerAssetBundle {\n          assetQuantities(first: 1) {\n            edges {\n              node {\n                asset {\n                  ownedQuantity(identity: {})\n                  decimals\n                  symbol\n                  relayId\n                  assetContract {\n                    address\n                    id\n                  }\n                  id\n                }\n                quantity\n                ...AssetQuantity_data\n                ...quantity_data\n                id\n              }\n            }\n          }\n          id\n        }\n        ...AskPrice_data\n        ...orderLink_data\n        makerAssetBundleDisplay: makerAssetBundle @include(if: $expandedMode) {\n          ...AssetCell_assetBundle\n          id\n        }\n        takerAssetBundleDisplay: takerAssetBundle @include(if: $expandedMode) {\n          ...AssetCell_assetBundle\n          id\n        }\n        ...quantity_remaining\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n  address\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment orderLink_data on OrderV2Type {\n  makerAssetBundle {\n    assetQuantities(first: 30) {\n      edges {\n        node {\n          asset {\n            externalLink\n            collection {\n              externalUrl\n              id\n            }\n            id\n          }\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment quantity_data on AssetQuantityType {\n  asset {\n    decimals\n    id\n  }\n  quantity\n}\n\nfragment quantity_remaining on OrderV2Type {\n  makerAsset: makerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          asset {\n            decimals\n            id\n          }\n          quantity\n          id\n        }\n      }\n    }\n    id\n  }\n  takerAsset: takerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          asset {\n            decimals\n            id\n          }\n          quantity\n          id\n        }\n      }\n    }\n    id\n  }\n  remainingQuantity\n  side\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n}\n"
  }
};
})();
(node as any).hash = '3459d3788ec07b0f5969e06a062fd968';
export default node;
