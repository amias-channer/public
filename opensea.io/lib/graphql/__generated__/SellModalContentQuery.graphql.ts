/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type ArchetypeInputType = {
    assetContractAddress: string;
    tokenId: string;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
};
export type SellModalContentQueryVariables = {
    archetype: ArchetypeInputType;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
};
export type SellModalContentQueryResponse = {
    readonly archetype: {
        readonly asset: {
            readonly assetContract: {
                readonly address: string;
                readonly chain: ChainIdentifier;
            };
            readonly decimals: number | null;
            readonly relayId: string;
            readonly collection: {
                readonly paymentAssets: ReadonlyArray<{
                    readonly asset: {
                        readonly relayId: string;
                        readonly assetContract: {
                            readonly chain: ChainIdentifier;
                        };
                        readonly decimals: number | null;
                        readonly symbol: string | null;
                        readonly " $fragmentRefs": FragmentRefs<"Price_data">;
                    };
                    readonly relayId: string;
                    readonly " $fragmentRefs": FragmentRefs<"PaymentTokenInputV2_data">;
                }>;
                readonly slug: string;
                readonly " $fragmentRefs": FragmentRefs<"SellFees_collection">;
            };
        } | null;
        readonly quantity: string;
        readonly ownedQuantity: string | null;
    } | null;
};
export type SellModalContentQuery = {
    readonly response: SellModalContentQueryResponse;
    readonly variables: SellModalContentQueryVariables;
};



/*
query SellModalContentQuery(
  $archetype: ArchetypeInputType!
  $chain: ChainScalar
) {
  archetype(archetype: $archetype) {
    asset {
      assetContract {
        address
        chain
        id
      }
      decimals
      relayId
      collection {
        ...SellFees_collection
        paymentAssets(chain: $chain) {
          asset {
            relayId
            assetContract {
              chain
              id
            }
            decimals
            symbol
            ...Price_data
            id
          }
          relayId
          ...PaymentTokenInputV2_data
          id
        }
        slug
        id
      }
      id
    }
    quantity
    ownedQuantity(identity: {})
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

fragment SellFees_collection on CollectionType {
  devSellerFeeBasisPoints
  openseaSellerFeeBasisPoints
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "archetype"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "chain"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "archetype",
    "variableName": "archetype"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v6 = [
  {
    "kind": "Variable",
    "name": "chain",
    "variableName": "chain"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v10 = {
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
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SellModalContentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetContractType",
                "kind": "LinkedField",
                "name": "assetContract",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/),
              (v5/*: any*/),
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
                    "args": (v6/*: any*/),
                    "concreteType": "PaymentAssetType",
                    "kind": "LinkedField",
                    "name": "paymentAssets",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetType",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetContractType",
                            "kind": "LinkedField",
                            "name": "assetContract",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/),
                          (v7/*: any*/),
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "Price_data"
                          }
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "PaymentTokenInputV2_data"
                      }
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "SellFees_collection"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v9/*: any*/),
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SellModalContentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetContractType",
                "kind": "LinkedField",
                "name": "assetContract",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v11/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/),
              (v5/*: any*/),
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
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "concreteType": "PaymentAssetType",
                    "kind": "LinkedField",
                    "name": "paymentAssets",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetType",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetContractType",
                            "kind": "LinkedField",
                            "name": "assetContract",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v11/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "blockExplorerLink",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/),
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "imageUrl",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "usdSpotPrice",
                            "storageKey": null
                          },
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/),
                      (v11/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  (v11/*: any*/)
                ],
                "storageKey": null
              },
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/),
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "44b72accc1034f7d0c265ebebda74430",
    "id": null,
    "metadata": {},
    "name": "SellModalContentQuery",
    "operationKind": "query",
    "text": "query SellModalContentQuery(\n  $archetype: ArchetypeInputType!\n  $chain: ChainScalar\n) {\n  archetype(archetype: $archetype) {\n    asset {\n      assetContract {\n        address\n        chain\n        id\n      }\n      decimals\n      relayId\n      collection {\n        ...SellFees_collection\n        paymentAssets(chain: $chain) {\n          asset {\n            relayId\n            assetContract {\n              chain\n              id\n            }\n            decimals\n            symbol\n            ...Price_data\n            id\n          }\n          relayId\n          ...PaymentTokenInputV2_data\n          id\n        }\n        slug\n        id\n      }\n      id\n    }\n    quantity\n    ownedQuantity(identity: {})\n  }\n}\n\nfragment PaymentAsset_data on PaymentAssetType {\n  asset {\n    assetContract {\n      chain\n      id\n    }\n    imageUrl\n    symbol\n    id\n  }\n}\n\nfragment PaymentTokenInputV2_data on PaymentAssetType {\n  relayId\n  asset {\n    decimals\n    symbol\n    usdSpotPrice\n    id\n  }\n  ...PaymentAsset_data\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment SellFees_collection on CollectionType {\n  devSellerFeeBasisPoints\n  openseaSellerFeeBasisPoints\n}\n"
  }
};
})();
(node as any).hash = 'd7c778e196a9cac9409da3c9939a5707';
export default node;
