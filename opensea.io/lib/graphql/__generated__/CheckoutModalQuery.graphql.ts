/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type OrderV2Relayer = "ASYNCART" | "AXIE" | "BLOCKCHAINCUTIES" | "CRYPTOKITTIES" | "DECENTRALAND" | "DYVERSE" | "ETHEREMON" | "GODS_UNCHAINED" | "KNOWNORIGIN" | "MAKERSPLACE" | "MARBLECARDS" | "MIIME" | "MLB" | "OPENSEA" | "RARIBLE" | "SORARE" | "SUPERRARE" | "TOKEN_TROVE" | "%future added value";
export type OrderV2Side = "ASK" | "BID" | "%future added value";
export type IdentityInputType = {
    address?: string | null;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
    name?: string | null;
    username?: string | null;
};
export type CheckoutModalQueryVariables = {
    orderId: string;
    asset: string;
    identity: IdentityInputType;
};
export type CheckoutModalQueryResponse = {
    readonly order: {
        readonly isFulfillable: boolean;
        readonly oldOrder: string | null;
        readonly relayer: OrderV2Relayer | null;
        readonly relayId: string;
        readonly side: OrderV2Side | null;
        readonly dutchAuctionFinalPrice: string | null;
        readonly openedAt: string;
        readonly priceFnEndedAt: string | null;
        readonly makerAssetBundle: {
            readonly slug: string | null;
            readonly name: string | null;
            readonly assetQuantities: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly asset: {
                            readonly usdSpotPrice: number | null;
                            readonly assetContract: {
                                readonly address: string;
                                readonly chain: ChainIdentifier;
                                readonly blockExplorerLink: string;
                            };
                            readonly collection: {
                                readonly name: string;
                                readonly slug: string;
                                readonly hidden: boolean;
                                readonly " $fragmentRefs": FragmentRefs<"CollectionLink_collection" | "verification_data">;
                            };
                            readonly decimals: number | null;
                            readonly imageUrl: string | null;
                            readonly name: string | null;
                            readonly symbol: string | null;
                            readonly relayId: string;
                            readonly " $fragmentRefs": FragmentRefs<"AssetMedia_asset" | "Price_data" | "itemEvents_data">;
                        };
                        readonly quantity: string;
                        readonly " $fragmentRefs": FragmentRefs<"quantity_data" | "AssetQuantity_data">;
                    } | null;
                } | null>;
            };
        };
        readonly takerAssetBundle: {
            readonly assetQuantities: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly asset: {
                            readonly usdSpotPrice: number | null;
                            readonly assetContract: {
                                readonly address: string;
                                readonly chain: ChainIdentifier;
                                readonly blockExplorerLink: string;
                            };
                            readonly collection: {
                                readonly name: string;
                                readonly slug: string;
                                readonly hidden: boolean;
                                readonly " $fragmentRefs": FragmentRefs<"CollectionLink_collection" | "verification_data" | "SellFees_collection">;
                            };
                            readonly decimals: number | null;
                            readonly imageUrl: string | null;
                            readonly name: string | null;
                            readonly symbol: string | null;
                            readonly relayId: string;
                            readonly " $fragmentRefs": FragmentRefs<"AssetMedia_asset">;
                        };
                        readonly quantity: string;
                        readonly " $fragmentRefs": FragmentRefs<"quantity_data" | "AssetQuantity_data">;
                    } | null;
                } | null>;
            };
        };
        readonly " $fragmentRefs": FragmentRefs<"AskPrice_data" | "orderLink_data" | "quantity_remaining">;
    };
    readonly blockchain: {
        readonly balance: string;
    };
};
export type CheckoutModalQuery = {
    readonly response: CheckoutModalQueryResponse;
    readonly variables: CheckoutModalQueryVariables;
};



/*
query CheckoutModalQuery(
  $orderId: OrderRelayID!
  $asset: AssetRelayID!
  $identity: IdentityInputType!
) {
  order(order: $orderId) {
    isFulfillable
    oldOrder
    relayer
    relayId
    side
    dutchAuctionFinalPrice
    openedAt
    priceFnEndedAt
    makerAssetBundle {
      slug
      name
      assetQuantities(first: 30) {
        edges {
          node {
            asset {
              usdSpotPrice
              assetContract {
                address
                chain
                blockExplorerLink
                id
              }
              collection {
                name
                slug
                hidden
                ...CollectionLink_collection
                ...verification_data
                id
              }
              decimals
              imageUrl
              name
              symbol
              relayId
              ...AssetMedia_asset
              ...Price_data
              ...itemEvents_data
              id
            }
            ...quantity_data
            quantity
            ...AssetQuantity_data
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
            asset {
              usdSpotPrice
              assetContract {
                address
                chain
                blockExplorerLink
                id
              }
              collection {
                name
                slug
                hidden
                ...CollectionLink_collection
                ...verification_data
                ...SellFees_collection
                id
              }
              decimals
              imageUrl
              name
              symbol
              relayId
              ...AssetMedia_asset
              id
            }
            ...quantity_data
            ...AssetQuantity_data
            quantity
            id
          }
        }
      }
      id
    }
    ...AskPrice_data
    ...orderLink_data
    ...quantity_remaining
    id
  }
  blockchain {
    balance(asset: $asset, identity: $identity)
  }
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

fragment CollectionLink_collection on CollectionType {
  slug
  name
  ...verification_data
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

fragment SellFees_collection on CollectionType {
  devSellerFeeBasisPoints
  openseaSellerFeeBasisPoints
}

fragment itemEvents_data on AssetType {
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
  "name": "asset"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "identity"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "order",
    "variableName": "orderId"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFulfillable",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "oldOrder",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayer",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "side",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dutchAuctionFinalPrice",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "openedAt",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priceFnEndedAt",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v14 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  }
],
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "usdSpotPrice",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "blockExplorerLink",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetContractType",
  "kind": "LinkedField",
  "name": "assetContract",
  "plural": false,
  "selections": [
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/)
  ],
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hidden",
  "storageKey": null
},
v21 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "CollectionLink_collection"
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMintable",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSafelisted",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isVerified",
  "storageKey": null
},
v25 = {
  "kind": "InlineDataFragmentSpread",
  "name": "verification_data",
  "selections": [
    (v22/*: any*/),
    (v23/*: any*/),
    (v24/*: any*/)
  ]
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
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
  "name": "symbol",
  "storageKey": null
},
v29 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "AssetMedia_asset"
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tokenId",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v32 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "AssetType",
    "kind": "LinkedField",
    "name": "asset",
    "plural": false,
    "selections": [
      (v26/*: any*/)
    ],
    "storageKey": null
  },
  (v31/*: any*/)
],
v33 = {
  "kind": "InlineDataFragmentSpread",
  "name": "quantity_data",
  "selections": (v32/*: any*/)
},
v34 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "AssetQuantity_data"
},
v35 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalLink",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalUrl",
  "storageKey": null
},
v38 = [
  {
    "alias": null,
    "args": (v35/*: any*/),
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
            "selections": (v32/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "assetQuantities(first:1)"
  }
],
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "remainingQuantity",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "BlockchainType",
  "kind": "LinkedField",
  "name": "blockchain",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "asset",
          "variableName": "asset"
        },
        {
          "kind": "Variable",
          "name": "identity",
          "variableName": "identity"
        }
      ],
      "kind": "ScalarField",
      "name": "balance",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetContractType",
  "kind": "LinkedField",
  "name": "assetContract",
  "plural": false,
  "selections": [
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v41/*: any*/)
  ],
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v44 = {
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
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "animationUrl",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDelisted",
  "storageKey": null
},
v48 = [
  {
    "alias": null,
    "args": (v35/*: any*/),
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
                  (v26/*: any*/),
                  (v41/*: any*/)
                ],
                "storageKey": null
              },
              (v31/*: any*/),
              (v41/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "assetQuantities(first:1)"
  },
  (v41/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CheckoutModalQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "OrderV2Type",
        "kind": "LinkedField",
        "name": "order",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AssetBundleType",
            "kind": "LinkedField",
            "name": "makerAssetBundle",
            "plural": false,
            "selections": [
              (v12/*: any*/),
              (v13/*: any*/),
              {
                "alias": null,
                "args": (v14/*: any*/),
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
                              (v15/*: any*/),
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CollectionType",
                                "kind": "LinkedField",
                                "name": "collection",
                                "plural": false,
                                "selections": [
                                  (v13/*: any*/),
                                  (v12/*: any*/),
                                  (v20/*: any*/),
                                  (v21/*: any*/),
                                  (v25/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v26/*: any*/),
                              (v27/*: any*/),
                              (v13/*: any*/),
                              (v28/*: any*/),
                              (v7/*: any*/),
                              (v29/*: any*/),
                              {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "Price_data"
                              },
                              {
                                "kind": "InlineDataFragmentSpread",
                                "name": "itemEvents_data",
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "AssetContractType",
                                    "kind": "LinkedField",
                                    "name": "assetContract",
                                    "plural": false,
                                    "selections": [
                                      (v16/*: any*/),
                                      (v17/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v30/*: any*/)
                                ]
                              }
                            ],
                            "storageKey": null
                          },
                          (v31/*: any*/),
                          (v33/*: any*/),
                          (v34/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetQuantities(first:30)"
              }
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
                "args": (v35/*: any*/),
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
                              (v15/*: any*/),
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CollectionType",
                                "kind": "LinkedField",
                                "name": "collection",
                                "plural": false,
                                "selections": [
                                  (v13/*: any*/),
                                  (v12/*: any*/),
                                  (v20/*: any*/),
                                  (v21/*: any*/),
                                  (v25/*: any*/),
                                  {
                                    "args": null,
                                    "kind": "FragmentSpread",
                                    "name": "SellFees_collection"
                                  }
                                ],
                                "storageKey": null
                              },
                              (v26/*: any*/),
                              (v27/*: any*/),
                              (v13/*: any*/),
                              (v28/*: any*/),
                              (v7/*: any*/),
                              (v29/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v31/*: any*/),
                          (v33/*: any*/),
                          (v34/*: any*/)
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
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AskPrice_data"
          },
          {
            "kind": "InlineDataFragmentSpread",
            "name": "orderLink_data",
            "selections": [
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
                    "args": (v14/*: any*/),
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
                                  (v36/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "CollectionType",
                                    "kind": "LinkedField",
                                    "name": "collection",
                                    "plural": false,
                                    "selections": [
                                      (v37/*: any*/)
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
                        "storageKey": null
                      }
                    ],
                    "storageKey": "assetQuantities(first:30)"
                  }
                ],
                "storageKey": null
              }
            ]
          },
          {
            "kind": "InlineDataFragmentSpread",
            "name": "quantity_remaining",
            "selections": [
              {
                "alias": "makerAsset",
                "args": null,
                "concreteType": "AssetBundleType",
                "kind": "LinkedField",
                "name": "makerAssetBundle",
                "plural": false,
                "selections": (v38/*: any*/),
                "storageKey": null
              },
              {
                "alias": "takerAsset",
                "args": null,
                "concreteType": "AssetBundleType",
                "kind": "LinkedField",
                "name": "takerAssetBundle",
                "plural": false,
                "selections": (v38/*: any*/),
                "storageKey": null
              },
              (v39/*: any*/),
              (v8/*: any*/)
            ]
          }
        ],
        "storageKey": null
      },
      (v40/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "CheckoutModalQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "OrderV2Type",
        "kind": "LinkedField",
        "name": "order",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AssetBundleType",
            "kind": "LinkedField",
            "name": "makerAssetBundle",
            "plural": false,
            "selections": [
              (v12/*: any*/),
              (v13/*: any*/),
              {
                "alias": null,
                "args": (v14/*: any*/),
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
                              (v15/*: any*/),
                              (v42/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CollectionType",
                                "kind": "LinkedField",
                                "name": "collection",
                                "plural": false,
                                "selections": [
                                  (v13/*: any*/),
                                  (v12/*: any*/),
                                  (v20/*: any*/),
                                  (v22/*: any*/),
                                  (v23/*: any*/),
                                  (v24/*: any*/),
                                  (v41/*: any*/),
                                  (v43/*: any*/),
                                  (v44/*: any*/),
                                  (v27/*: any*/),
                                  (v37/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v26/*: any*/),
                              (v27/*: any*/),
                              (v13/*: any*/),
                              (v28/*: any*/),
                              (v7/*: any*/),
                              (v45/*: any*/),
                              (v46/*: any*/),
                              (v43/*: any*/),
                              (v30/*: any*/),
                              (v47/*: any*/),
                              (v41/*: any*/),
                              (v36/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v31/*: any*/),
                          (v41/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetQuantities(first:30)"
              },
              (v41/*: any*/)
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
                "args": (v35/*: any*/),
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
                              (v15/*: any*/),
                              (v42/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CollectionType",
                                "kind": "LinkedField",
                                "name": "collection",
                                "plural": false,
                                "selections": [
                                  (v13/*: any*/),
                                  (v12/*: any*/),
                                  (v20/*: any*/),
                                  (v22/*: any*/),
                                  (v23/*: any*/),
                                  (v24/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "devSellerFeeBasisPoints",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "openseaSellerFeeBasisPoints",
                                    "storageKey": null
                                  },
                                  (v41/*: any*/),
                                  (v43/*: any*/),
                                  (v44/*: any*/),
                                  (v27/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v26/*: any*/),
                              (v27/*: any*/),
                              (v13/*: any*/),
                              (v28/*: any*/),
                              (v7/*: any*/),
                              (v45/*: any*/),
                              (v46/*: any*/),
                              (v43/*: any*/),
                              (v30/*: any*/),
                              (v47/*: any*/),
                              (v41/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v31/*: any*/),
                          (v41/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetQuantities(first:1)"
              },
              (v41/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": "makerAsset",
            "args": null,
            "concreteType": "AssetBundleType",
            "kind": "LinkedField",
            "name": "makerAssetBundle",
            "plural": false,
            "selections": (v48/*: any*/),
            "storageKey": null
          },
          {
            "alias": "takerAsset",
            "args": null,
            "concreteType": "AssetBundleType",
            "kind": "LinkedField",
            "name": "takerAssetBundle",
            "plural": false,
            "selections": (v48/*: any*/),
            "storageKey": null
          },
          (v39/*: any*/),
          (v41/*: any*/)
        ],
        "storageKey": null
      },
      (v40/*: any*/)
    ]
  },
  "params": {
    "cacheID": "e1a573e942cbe68c6c664846deb1dc71",
    "id": null,
    "metadata": {},
    "name": "CheckoutModalQuery",
    "operationKind": "query",
    "text": "query CheckoutModalQuery(\n  $orderId: OrderRelayID!\n  $asset: AssetRelayID!\n  $identity: IdentityInputType!\n) {\n  order(order: $orderId) {\n    isFulfillable\n    oldOrder\n    relayer\n    relayId\n    side\n    dutchAuctionFinalPrice\n    openedAt\n    priceFnEndedAt\n    makerAssetBundle {\n      slug\n      name\n      assetQuantities(first: 30) {\n        edges {\n          node {\n            asset {\n              usdSpotPrice\n              assetContract {\n                address\n                chain\n                blockExplorerLink\n                id\n              }\n              collection {\n                name\n                slug\n                hidden\n                ...CollectionLink_collection\n                ...verification_data\n                id\n              }\n              decimals\n              imageUrl\n              name\n              symbol\n              relayId\n              ...AssetMedia_asset\n              ...Price_data\n              ...itemEvents_data\n              id\n            }\n            ...quantity_data\n            quantity\n            ...AssetQuantity_data\n            id\n          }\n        }\n      }\n      id\n    }\n    takerAssetBundle {\n      assetQuantities(first: 1) {\n        edges {\n          node {\n            asset {\n              usdSpotPrice\n              assetContract {\n                address\n                chain\n                blockExplorerLink\n                id\n              }\n              collection {\n                name\n                slug\n                hidden\n                ...CollectionLink_collection\n                ...verification_data\n                ...SellFees_collection\n                id\n              }\n              decimals\n              imageUrl\n              name\n              symbol\n              relayId\n              ...AssetMedia_asset\n              id\n            }\n            ...quantity_data\n            ...AssetQuantity_data\n            quantity\n            id\n          }\n        }\n      }\n      id\n    }\n    ...AskPrice_data\n    ...orderLink_data\n    ...quantity_remaining\n    id\n  }\n  blockchain {\n    balance(asset: $asset, identity: $identity)\n  }\n}\n\nfragment AskPrice_data on OrderV2Type {\n  dutchAuctionFinalPrice\n  openedAt\n  priceFnEndedAt\n  makerAssetBundle {\n    assetQuantities(first: 30) {\n      edges {\n        node {\n          ...quantity_data\n          id\n        }\n      }\n    }\n    id\n  }\n  takerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          ...AssetQuantity_data\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    description\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    hidden\n    name\n    slug\n    id\n  }\n  description\n  name\n  tokenId\n  imageUrl\n  isDelisted\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment CollectionLink_collection on CollectionType {\n  slug\n  name\n  ...verification_data\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment SellFees_collection on CollectionType {\n  devSellerFeeBasisPoints\n  openseaSellerFeeBasisPoints\n}\n\nfragment itemEvents_data on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment orderLink_data on OrderV2Type {\n  makerAssetBundle {\n    assetQuantities(first: 30) {\n      edges {\n        node {\n          asset {\n            externalLink\n            collection {\n              externalUrl\n              id\n            }\n            id\n          }\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment quantity_data on AssetQuantityType {\n  asset {\n    decimals\n    id\n  }\n  quantity\n}\n\nfragment quantity_remaining on OrderV2Type {\n  makerAsset: makerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          asset {\n            decimals\n            id\n          }\n          quantity\n          id\n        }\n      }\n    }\n    id\n  }\n  takerAsset: takerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          asset {\n            decimals\n            id\n          }\n          quantity\n          id\n        }\n      }\n    }\n    id\n  }\n  remainingQuantity\n  side\n}\n\nfragment verification_data on CollectionType {\n  isMintable\n  isSafelisted\n  isVerified\n}\n"
  }
};
})();
(node as any).hash = '17205a17f3f48be963e51530a56f5e37';
export default node;
