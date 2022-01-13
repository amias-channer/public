/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type walletAssetQueryVariables = {
    assetId: string;
};
export type walletAssetQueryResponse = {
    readonly asset: {
        readonly assetContract: {
            readonly chain: ChainIdentifier;
        };
    };
};
export type walletAssetQuery = {
    readonly response: walletAssetQueryResponse;
    readonly variables: walletAssetQueryVariables;
};



/*
query walletAssetQuery(
  $assetId: AssetRelayID!
) {
  asset(asset: $assetId) {
    assetContract {
      chain
      id
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "assetId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "asset",
    "variableName": "assetId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v3 = {
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
    "name": "walletAssetQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "walletAssetQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c803b2a5fdbe463cd38d35abe479ea7b",
    "id": null,
    "metadata": {},
    "name": "walletAssetQuery",
    "operationKind": "query",
    "text": "query walletAssetQuery(\n  $assetId: AssetRelayID!\n) {\n  asset(asset: $assetId) {\n    assetContract {\n      chain\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'b0f2c1c55230d5d40f07aa55f2c696d4';
export default node;
