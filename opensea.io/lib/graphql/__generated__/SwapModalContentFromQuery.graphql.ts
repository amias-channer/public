/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type SwapModalContentFromQueryVariables = {
    address: string;
    symbol: string;
    chain: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value";
};
export type SwapModalContentFromQueryResponse = {
    readonly paymentAsset: {
        readonly asset: {
            readonly relayId: string;
            readonly decimals: number | null;
        };
    };
    readonly wallet: {
        readonly fundsOf: {
            readonly name: string | null;
            readonly symbol: string;
            readonly chain: ChainIdentifier;
            readonly quantity: string;
            readonly image: string | null;
            readonly usdPrice: string | null;
            readonly supportedSwaps: ReadonlyArray<{
                readonly symbol: string;
                readonly chain: {
                    readonly identifier: ChainIdentifier;
                };
            }>;
        };
    };
};
export type SwapModalContentFromQuery = {
    readonly response: SwapModalContentFromQueryResponse;
    readonly variables: SwapModalContentFromQueryVariables;
};



/*
query SwapModalContentFromQuery(
  $address: AddressScalar!
  $symbol: String!
  $chain: ChainScalar!
) {
  paymentAsset(symbol: $symbol, chain: $chain) {
    asset {
      relayId
      decimals
      id
    }
    id
  }
  wallet(address: $address) {
    fundsOf(symbol: $symbol, chain: $chain) {
      name
      symbol
      chain
      quantity
      image
      usdPrice
      supportedSwaps {
        symbol
        chain {
          identifier
          id
        }
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "address"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "chain"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "symbol"
},
v3 = [
  {
    "kind": "Variable",
    "name": "chain",
    "variableName": "chain"
  },
  {
    "kind": "Variable",
    "name": "symbol",
    "variableName": "symbol"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v6 = [
  {
    "kind": "Variable",
    "name": "address",
    "variableName": "address"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "image",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "usdPrice",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "identifier",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SwapModalContentFromQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "PaymentAssetType",
        "kind": "LinkedField",
        "name": "paymentAsset",
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
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "WalletType",
        "kind": "LinkedField",
        "name": "wallet",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "WalletFundsType",
            "kind": "LinkedField",
            "name": "fundsOf",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "PaymentAssetType",
                "kind": "LinkedField",
                "name": "supportedSwaps",
                "plural": true,
                "selections": [
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ChainType",
                    "kind": "LinkedField",
                    "name": "chain",
                    "plural": false,
                    "selections": [
                      (v13/*: any*/)
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "SwapModalContentFromQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "PaymentAssetType",
        "kind": "LinkedField",
        "name": "paymentAsset",
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v14/*: any*/)
            ],
            "storageKey": null
          },
          (v14/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "WalletType",
        "kind": "LinkedField",
        "name": "wallet",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "WalletFundsType",
            "kind": "LinkedField",
            "name": "fundsOf",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "PaymentAssetType",
                "kind": "LinkedField",
                "name": "supportedSwaps",
                "plural": true,
                "selections": [
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ChainType",
                    "kind": "LinkedField",
                    "name": "chain",
                    "plural": false,
                    "selections": [
                      (v13/*: any*/),
                      (v14/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "05eb60cb38d8200f016414b329bb7e73",
    "id": null,
    "metadata": {},
    "name": "SwapModalContentFromQuery",
    "operationKind": "query",
    "text": "query SwapModalContentFromQuery(\n  $address: AddressScalar!\n  $symbol: String!\n  $chain: ChainScalar!\n) {\n  paymentAsset(symbol: $symbol, chain: $chain) {\n    asset {\n      relayId\n      decimals\n      id\n    }\n    id\n  }\n  wallet(address: $address) {\n    fundsOf(symbol: $symbol, chain: $chain) {\n      name\n      symbol\n      chain\n      quantity\n      image\n      usdPrice\n      supportedSwaps {\n        symbol\n        chain {\n          identifier\n          id\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'c24bb16337960dc00cd2a80311b868c9';
export default node;
