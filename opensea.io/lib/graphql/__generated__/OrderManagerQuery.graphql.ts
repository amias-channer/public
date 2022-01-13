/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArchetypeInputType = {
    assetContractAddress: string;
    tokenId: string;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
};
export type OrderManagerQueryVariables = {
    archetype: ArchetypeInputType;
    bundle?: string | null;
    isBundle: boolean;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
};
export type OrderManagerQueryResponse = {
    readonly orders?: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly relayId: string;
                readonly oldOrder: string | null;
                readonly takerAssetBundle: {
                    readonly assetQuantities: {
                        readonly edges: ReadonlyArray<{
                            readonly node: {
                                readonly asset: {
                                    readonly symbol: string | null;
                                    readonly decimals: number | null;
                                };
                                readonly quantity: string;
                            } | null;
                        } | null>;
                    };
                };
            } | null;
        } | null>;
    } | null;
    readonly archetype?: {
        readonly asset: {
            readonly isEditable: {
                readonly value: boolean;
            };
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"BidModalContent_archetype">;
    } | null;
    readonly tradeSummary?: {
        readonly " $fragmentRefs": FragmentRefs<"BidModalContent_trade">;
    };
    readonly bundle?: {
        readonly " $fragmentRefs": FragmentRefs<"BidModalContent_bundle">;
    } | null;
};
export type OrderManagerQuery = {
    readonly response: OrderManagerQueryResponse;
    readonly variables: OrderManagerQueryVariables;
};



/*
query OrderManagerQuery(
  $archetype: ArchetypeInputType!
  $bundle: BundleSlug
  $isBundle: Boolean!
  $chain: ChainScalar
) {
  orders(first: 20, isValid: true, isExpired: false, maker: {}, makerArchetype: $archetype, sortAscending: true, sortBy: TAKER_ASSETS_USD_PRICE, takerAssetIsPayment: true) @skip(if: $isBundle) {
    edges {
      node {
        relayId
        oldOrder
        takerAssetBundle {
          assetQuantities(first: 1) {
            edges {
              node {
                asset {
                  symbol
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
        id
      }
    }
  }
  archetype(archetype: $archetype) @skip(if: $isBundle) {
    asset {
      isEditable {
        value
      }
      id
    }
    ...BidModalContent_archetype_3wquQ2
  }
  tradeSummary(archetype: $archetype) @skip(if: $isBundle) {
    ...BidModalContent_trade
  }
  orders(first: 20, isValid: true, maker: {}, makerAssetBundle: $bundle, sortAscending: true, sortBy: TAKER_ASSETS_USD_PRICE, takerAssetIsPayment: true) @include(if: $isBundle) {
    edges {
      node {
        relayId
        oldOrder
        takerAssetBundle {
          assetQuantities(first: 1) {
            edges {
              node {
                asset {
                  symbol
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
        id
      }
    }
  }
  bundle(bundle: $bundle) @include(if: $isBundle) {
    ...BidModalContent_bundle_4iqQ9J
    id
  }
}

fragment AssetQuantity_data on AssetQuantityType {
  asset {
    ...Price_data
    id
  }
  quantity
}

fragment BidModalContent_archetype_3wquQ2 on ArchetypeType {
  asset {
    assetContract {
      address
      chain
      id
    }
    decimals
    relayId
    collection {
      slug
      paymentAssets(chain: $chain) {
        relayId
        asset {
          assetContract {
            address
            chain
            id
          }
          decimals
          symbol
          usdSpotPrice
          relayId
          id
        }
        ...PaymentTokenInputV2_data
        id
      }
      ...verification_data
      id
    }
    id
  }
  quantity
  ownedQuantity(identity: {})
}

fragment BidModalContent_bundle_4iqQ9J on AssetBundleType {
  assetQuantities(first: 30) {
    edges {
      node {
        asset {
          assetContract {
            address
            chain
            id
          }
          decimals
          relayId
          collection {
            slug
            paymentAssets(chain: $chain) {
              relayId
              asset {
                assetContract {
                  address
                  chain
                  id
                }
                decimals
                symbol
                usdSpotPrice
                relayId
                id
              }
              ...PaymentTokenInputV2_data
              id
            }
            id
          }
          id
        }
        quantity
        id
      }
    }
  }
  slug
}

fragment BidModalContent_trade on TradeSummaryType {
  bestAsk {
    closedAt
    isFulfillable
    oldOrder
    orderType
    relayId
    makerAssetBundle {
      assetQuantities(first: 30) {
        edges {
          node {
            asset {
              collection {
                ...verification_data
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
    takerAssetBundle {
      assetQuantities(first: 1) {
        edges {
          node {
            quantity
            asset {
              decimals
              relayId
              id
            }
            id
          }
        }
      }
      id
    }
    id
  }
  bestBid {
    relayId
    makerAssetBundle {
      assetQuantities(first: 1) {
        edges {
          node {
            quantity
            asset {
              decimals
              id
            }
            ...AssetQuantity_data
            id
          }
        }
      }
      id
    }
    id
  }
}

fragment PaymentAsset_data on PaymentAssetType {
  asset {
    assetContract {
      chain
      id
    }
    imageUrl
    symbol
    id
  }
}

fragment PaymentTokenInputV2_data on PaymentAssetType {
  relayId
  asset {
    decimals
    symbol
    usdSpotPrice
    id
  }
  ...PaymentAsset_data
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

fragment verification_data on CollectionType {
  isMintable
  isSafelisted
  isVerified
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "archetype"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "bundle"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "chain"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isBundle"
},
v4 = {
  "kind": "Literal",
  "name": "first",
  "value": 20
},
v5 = {
  "kind": "Literal",
  "name": "isValid",
  "value": true
},
v6 = {
  "kind": "Literal",
  "name": "maker",
  "value": {}
},
v7 = {
  "kind": "Literal",
  "name": "sortAscending",
  "value": true
},
v8 = {
  "kind": "Literal",
  "name": "sortBy",
  "value": "TAKER_ASSETS_USD_PRICE"
},
v9 = {
  "kind": "Literal",
  "name": "takerAssetIsPayment",
  "value": true
},
v10 = [
  (v4/*: any*/),
  {
    "kind": "Literal",
    "name": "isExpired",
    "value": false
  },
  (v5/*: any*/),
  (v6/*: any*/),
  {
    "kind": "Variable",
    "name": "makerArchetype",
    "variableName": "archetype"
  },
  (v7/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "oldOrder",
  "storageKey": null
},
v13 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v17 = [
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
          (v11/*: any*/),
          (v12/*: any*/),
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
                "args": (v13/*: any*/),
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
                              (v14/*: any*/),
                              (v15/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v16/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetQuantities(first:1)"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v18 = [
  {
    "kind": "Variable",
    "name": "archetype",
    "variableName": "archetype"
  }
],
v19 = {
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
    }
  ],
  "storageKey": null
},
v20 = {
  "kind": "Variable",
  "name": "chain",
  "variableName": "chain"
},
v21 = {
  "kind": "Literal",
  "name": "identity",
  "value": {}
},
v22 = [
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  {
    "kind": "Variable",
    "name": "makerAssetBundle",
    "variableName": "bundle"
  },
  (v7/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/)
],
v23 = [
  {
    "kind": "Variable",
    "name": "bundle",
    "variableName": "bundle"
  }
],
v24 = [
  (v20/*: any*/)
],
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v26 = [
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
          (v11/*: any*/),
          (v12/*: any*/),
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
                "args": (v13/*: any*/),
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
                              (v14/*: any*/),
                              (v15/*: any*/),
                              (v25/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v16/*: any*/),
                          (v25/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetQuantities(first:1)"
              },
              (v25/*: any*/)
            ],
            "storageKey": null
          },
          (v25/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v28 = {
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
      "name": "address",
      "storageKey": null
    },
    (v27/*: any*/),
    (v25/*: any*/)
  ],
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "usdSpotPrice",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": (v24/*: any*/),
  "concreteType": "PaymentAssetType",
  "kind": "LinkedField",
  "name": "paymentAssets",
  "plural": true,
  "selections": [
    (v11/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "AssetType",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
      "selections": [
        (v28/*: any*/),
        (v15/*: any*/),
        (v14/*: any*/),
        (v30/*: any*/),
        (v11/*: any*/),
        (v25/*: any*/),
        (v31/*: any*/)
      ],
      "storageKey": null
    },
    (v25/*: any*/)
  ],
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMintable",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSafelisted",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isVerified",
  "storageKey": null
},
v36 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrderManagerQuery",
    "selections": [
      {
        "condition": "isBundle",
        "kind": "Condition",
        "passingValue": false,
        "selections": [
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "OrderV2TypeConnection",
            "kind": "LinkedField",
            "name": "orders",
            "plural": false,
            "selections": (v17/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v18/*: any*/),
            "concreteType": "ArchetypeType",
            "kind": "LinkedField",
            "name": "archetype",
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
                  (v19/*: any*/)
                ],
                "storageKey": null
              },
              {
                "args": [
                  (v20/*: any*/),
                  (v21/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "BidModalContent_archetype"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v18/*: any*/),
            "concreteType": "TradeSummaryType",
            "kind": "LinkedField",
            "name": "tradeSummary",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BidModalContent_trade"
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isBundle",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v22/*: any*/),
            "concreteType": "OrderV2TypeConnection",
            "kind": "LinkedField",
            "name": "orders",
            "plural": false,
            "selections": (v17/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v23/*: any*/),
            "concreteType": "AssetBundleType",
            "kind": "LinkedField",
            "name": "bundle",
            "plural": false,
            "selections": [
              {
                "args": (v24/*: any*/),
                "kind": "FragmentSpread",
                "name": "BidModalContent_bundle"
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
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "OrderManagerQuery",
    "selections": [
      {
        "condition": "isBundle",
        "kind": "Condition",
        "passingValue": false,
        "selections": [
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "OrderV2TypeConnection",
            "kind": "LinkedField",
            "name": "orders",
            "plural": false,
            "selections": (v26/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v18/*: any*/),
            "concreteType": "ArchetypeType",
            "kind": "LinkedField",
            "name": "archetype",
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
                  (v19/*: any*/),
                  (v25/*: any*/),
                  (v28/*: any*/),
                  (v15/*: any*/),
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CollectionType",
                    "kind": "LinkedField",
                    "name": "collection",
                    "plural": false,
                    "selections": [
                      (v29/*: any*/),
                      (v32/*: any*/),
                      (v33/*: any*/),
                      (v34/*: any*/),
                      (v35/*: any*/),
                      (v25/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v16/*: any*/),
              {
                "alias": null,
                "args": [
                  (v21/*: any*/)
                ],
                "kind": "ScalarField",
                "name": "ownedQuantity",
                "storageKey": "ownedQuantity(identity:{})"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v18/*: any*/),
            "concreteType": "TradeSummaryType",
            "kind": "LinkedField",
            "name": "tradeSummary",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrderV2Type",
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFulfillable",
                    "storageKey": null
                  },
                  (v12/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "orderType",
                    "storageKey": null
                  },
                  (v11/*: any*/),
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
                        "args": (v36/*: any*/),
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
                                          (v33/*: any*/),
                                          (v34/*: any*/),
                                          (v35/*: any*/),
                                          (v25/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v25/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v25/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "assetQuantities(first:30)"
                      },
                      (v25/*: any*/)
                    ],
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
                        "args": (v13/*: any*/),
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
                                  (v16/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "AssetType",
                                    "kind": "LinkedField",
                                    "name": "asset",
                                    "plural": false,
                                    "selections": [
                                      (v15/*: any*/),
                                      (v11/*: any*/),
                                      (v25/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v25/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "assetQuantities(first:1)"
                      },
                      (v25/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v25/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "OrderV2Type",
                "kind": "LinkedField",
                "name": "bestBid",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
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
                        "args": (v13/*: any*/),
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
                                  (v16/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "AssetType",
                                    "kind": "LinkedField",
                                    "name": "asset",
                                    "plural": false,
                                    "selections": [
                                      (v15/*: any*/),
                                      (v25/*: any*/),
                                      (v31/*: any*/),
                                      (v14/*: any*/),
                                      (v30/*: any*/),
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
                                          (v27/*: any*/),
                                          (v25/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  (v25/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "assetQuantities(first:1)"
                      },
                      (v25/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v25/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "condition": "isBundle",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v22/*: any*/),
            "concreteType": "OrderV2TypeConnection",
            "kind": "LinkedField",
            "name": "orders",
            "plural": false,
            "selections": (v26/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v23/*: any*/),
            "concreteType": "AssetBundleType",
            "kind": "LinkedField",
            "name": "bundle",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v36/*: any*/),
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
                              (v28/*: any*/),
                              (v15/*: any*/),
                              (v11/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CollectionType",
                                "kind": "LinkedField",
                                "name": "collection",
                                "plural": false,
                                "selections": [
                                  (v29/*: any*/),
                                  (v32/*: any*/),
                                  (v25/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v25/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v16/*: any*/),
                          (v25/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetQuantities(first:30)"
              },
              (v29/*: any*/),
              (v25/*: any*/)
            ],
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "8e0b95914fb5f8b2ef384e190f2f3fd1",
    "id": null,
    "metadata": {},
    "name": "OrderManagerQuery",
    "operationKind": "query",
    "text": "query OrderManagerQuery(\n  $archetype: ArchetypeInputType!\n  $bundle: BundleSlug\n  $isBundle: Boolean!\n  $chain: ChainScalar\n) {\n  orders(first: 20, isValid: true, isExpired: false, maker: {}, makerArchetype: $archetype, sortAscending: true, sortBy: TAKER_ASSETS_USD_PRICE, takerAssetIsPayment: true) @skip(if: $isBundle) {\n    edges {\n      node {\n        relayId\n        oldOrder\n        takerAssetBundle {\n          assetQuantities(first: 1) {\n            edges {\n              node {\n                asset {\n                  symbol\n                  decimals\n                  id\n                }\n                quantity\n                id\n              }\n            }\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n  archetype(archetype: $archetype) @skip(if: $isBundle) {\n    asset {\n      isEditable {\n        value\n      }\n      id\n    }\n    ...BidModalContent_archetype_3wquQ2\n  }\n  tradeSummary(archetype: $archetype) @skip(if: $isBundle) {\n    ...BidModalContent_trade\n  }\n  orders(first: 20, isValid: true, maker: {}, makerAssetBundle: $bundle, sortAscending: true, sortBy: TAKER_ASSETS_USD_PRICE, takerAssetIsPayment: true) @include(if: $isBundle) {\n    edges {\n      node {\n        relayId\n        oldOrder\n        takerAssetBundle {\n          assetQuantities(first: 1) {\n            edges {\n              node {\n                asset {\n                  symbol\n                  decimals\n                  id\n                }\n                quantity\n                id\n              }\n            }\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n  bundle(bundle: $bundle) @include(if: $isBundle) {\n    ...BidModalContent_bundle_4iqQ9J\n    id\n  }\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment BidModalContent_archetype_3wquQ2 on ArchetypeType {\n  asset {\n    assetContract {\n      address\n      chain\n      id\n    }\n    decimals\n    relayId\n    collection {\n      slug\n      paymentAssets(chain: $chain) {\n        relayId\n        asset {\n          assetContract {\n            address\n            chain\n            id\n          }\n          decimals\n          symbol\n          usdSpotPrice\n          relayId\n          id\n        }\n        ...PaymentTokenInputV2_data\n        id\n      }\n      ...verification_data\n      id\n    }\n    id\n  }\n  quantity\n  ownedQuantity(identity: {})\n}\n\nfragment BidModalContent_bundle_4iqQ9J on AssetBundleType {\n  assetQuantities(first: 30) {\n    edges {\n      node {\n        asset {\n          assetContract {\n            address\n            chain\n            id\n          }\n          decimals\n          relayId\n          collection {\n            slug\n            paymentAssets(chain: $chain) {\n              relayId\n              asset {\n                assetContract {\n                  address\n                  chain\n                  id\n                }\n                decimals\n                symbol\n                usdSpotPrice\n                relayId\n                id\n              }\n              ...PaymentTokenInputV2_data\n              id\n            }\n            id\n          }\n          id\n        }\n        quantity\n        id\n      }\n    }\n  }\n  slug\n}\n\nfragment BidModalContent_trade on TradeSummaryType {\n  bestAsk {\n    closedAt\n    isFulfillable\n    oldOrder\n    orderType\n    relayId\n    makerAssetBundle {\n      assetQuantities(first: 30) {\n        edges {\n          node {\n            asset {\n              collection {\n                ...verification_data\n                id\n              }\n              id\n            }\n            id\n          }\n        }\n      }\n      id\n    }\n    takerAssetBundle {\n      assetQuantities(first: 1) {\n        edges {\n          node {\n            quantity\n            asset {\n              decimals\n              relayId\n              id\n            }\n            id\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n  bestBid {\n    relayId\n    makerAssetBundle {\n      assetQuantities(first: 1) {\n        edges {\n          node {\n            quantity\n            asset {\n              decimals\n              id\n            }\n            ...AssetQuantity_data\n            id\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment PaymentAsset_data on PaymentAssetType {\n  asset {\n    assetContract {\n      chain\n      id\n    }\n    imageUrl\n    symbol\n    id\n  }\n}\n\nfragment PaymentTokenInputV2_data on PaymentAssetType {\n  relayId\n  asset {\n    decimals\n    symbol\n    usdSpotPrice\n    id\n  }\n  ...PaymentAsset_data\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment verification_data on CollectionType {\n  isMintable\n  isSafelisted\n  isVerified\n}\n"
  }
};
})();
(node as any).hash = '23781c2e67129bcf9c87fc9190e80f23';
export default node;
