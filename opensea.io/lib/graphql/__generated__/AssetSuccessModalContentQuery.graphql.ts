/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type AssetSuccessModalContentQueryVariables = {
    assetIDs: Array<string>;
};
export type AssetSuccessModalContentQueryResponse = {
    readonly assets: ReadonlyArray<{
        readonly relayId: string;
        readonly name: string | null;
        readonly assetContract: {
            readonly address: string;
            readonly chain: ChainIdentifier;
        };
        readonly tokenId: string;
        readonly " $fragmentRefs": FragmentRefs<"AssetMedia_asset" | "asset_url">;
    }>;
};
export type AssetSuccessModalContentQuery = {
    readonly response: AssetSuccessModalContentQueryResponse;
    readonly variables: AssetSuccessModalContentQueryVariables;
};



/*
query AssetSuccessModalContentQuery(
  $assetIDs: [AssetRelayID!]!
) {
  assets(assets: $assetIDs) {
    relayId
    name
    assetContract {
      address
      chain
      id
    }
    tokenId
    ...AssetMedia_asset
    ...asset_url
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

fragment asset_url on AssetType {
  assetContract {
    address
    chain
    id
  }
  tokenId
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "assetIDs"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "assets",
    "variableName": "assetIDs"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetContractType",
  "kind": "LinkedField",
  "name": "assetContract",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tokenId",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AssetSuccessModalContentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AssetType",
        "kind": "LinkedField",
        "name": "assets",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AssetMedia_asset"
          },
          {
            "kind": "InlineDataFragmentSpread",
            "name": "asset_url",
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/)
            ]
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
    "name": "AssetSuccessModalContentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AssetType",
        "kind": "LinkedField",
        "name": "assets",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AssetContractType",
            "kind": "LinkedField",
            "name": "assetContract",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/),
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
          {
            "alias": null,
            "args": null,
            "concreteType": "CollectionType",
            "kind": "LinkedField",
            "name": "collection",
            "plural": false,
            "selections": [
              (v9/*: any*/),
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
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hidden",
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slug",
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/),
          (v10/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isDelisted",
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8a852c77c8637a51a231f231e1d9ed64",
    "id": null,
    "metadata": {},
    "name": "AssetSuccessModalContentQuery",
    "operationKind": "query",
    "text": "query AssetSuccessModalContentQuery(\n  $assetIDs: [AssetRelayID!]!\n) {\n  assets(assets: $assetIDs) {\n    relayId\n    name\n    assetContract {\n      address\n      chain\n      id\n    }\n    tokenId\n    ...AssetMedia_asset\n    ...asset_url\n    id\n  }\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    description\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    hidden\n    name\n    slug\n    id\n  }\n  description\n  name\n  tokenId\n  imageUrl\n  isDelisted\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n"
  }
};
})();
(node as any).hash = 'a52e68fd5bde19e35351b8dd83869bc3';
export default node;
