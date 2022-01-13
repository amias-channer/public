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
export type PrivateListingBannerQueryVariables = {
    archetype?: ArchetypeInputType | null;
    bundle?: string | null;
    includePrivate: boolean;
};
export type PrivateListingBannerQueryResponse = {
    readonly tradeSummary: {
        readonly bestAsk: {
            readonly taker: {
                readonly address: string;
                readonly " $fragmentRefs": FragmentRefs<"AccountLink_data" | "wallet_accountKey">;
            } | null;
            readonly maker: {
                readonly " $fragmentRefs": FragmentRefs<"wallet_accountKey">;
            };
        } | null;
    };
};
export type PrivateListingBannerQuery = {
    readonly response: PrivateListingBannerQueryResponse;
    readonly variables: PrivateListingBannerQueryVariables;
};



/*
query PrivateListingBannerQuery(
  $archetype: ArchetypeInputType
  $bundle: BundleSlug
  $includePrivate: Boolean!
) {
  tradeSummary(archetype: $archetype, bundle: $bundle, includePrivate: $includePrivate) {
    bestAsk {
      taker {
        address
        ...AccountLink_data
        ...wallet_accountKey
        id
      }
      maker {
        ...wallet_accountKey
        id
      }
      id
    }
  }
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

fragment wallet_accountKey on AccountType {
  address
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
    "name": "bundle"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "includePrivate"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "archetype",
    "variableName": "archetype"
  },
  {
    "kind": "Variable",
    "name": "bundle",
    "variableName": "bundle"
  },
  {
    "kind": "Variable",
    "name": "includePrivate",
    "variableName": "includePrivate"
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
  "kind": "InlineDataFragmentSpread",
  "name": "wallet_accountKey",
  "selections": [
    (v2/*: any*/)
  ]
},
v4 = {
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
    "name": "PrivateListingBannerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "taker",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "AccountLink_data"
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "maker",
                "plural": false,
                "selections": [
                  (v3/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PrivateListingBannerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "taker",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
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
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "imageUrl",
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "maker",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e48216bedd47af2cd3ba01fa4ec9cd29",
    "id": null,
    "metadata": {},
    "name": "PrivateListingBannerQuery",
    "operationKind": "query",
    "text": "query PrivateListingBannerQuery(\n  $archetype: ArchetypeInputType\n  $bundle: BundleSlug\n  $includePrivate: Boolean!\n) {\n  tradeSummary(archetype: $archetype, bundle: $bundle, includePrivate: $includePrivate) {\n    bestAsk {\n      taker {\n        address\n        ...AccountLink_data\n        ...wallet_accountKey\n        id\n      }\n      maker {\n        ...wallet_accountKey\n        id\n      }\n      id\n    }\n  }\n}\n\nfragment AccountLink_data on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n  ...ProfileImage_data\n  ...wallet_accountKey\n  ...accounts_url\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n  address\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n}\n"
  }
};
})();
(node as any).hash = 'e715990f4c5b3977e70c77b07823410f';
export default node;
