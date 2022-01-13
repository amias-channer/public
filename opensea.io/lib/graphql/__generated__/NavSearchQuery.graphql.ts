/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Config = "AFFILIATE" | "AFFILIATE_BLACKLISTED" | "AFFILIATE_REQUESTED" | "MODERATOR" | "PARTNER" | "VERIFIED" | "%future added value";
export type NavSearchQueryVariables = {
    query: string;
};
export type NavSearchQueryResponse = {
    readonly accounts: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly address: string;
                readonly config: Config | null;
                readonly discordId: string | null;
                readonly imageUrl: string;
                readonly relayId: string;
                readonly user: {
                    readonly publicUsername: string | null;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"accounts_url">;
            } | null;
        } | null>;
    } | null;
    readonly collections: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly assetContracts: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly address: string;
                        } | null;
                    } | null>;
                } | null;
                readonly imageUrl: string | null;
                readonly name: string;
                readonly relayId: string;
                readonly slug: string;
                readonly stats: {
                    readonly totalSupply: number;
                };
                readonly " $fragmentRefs": FragmentRefs<"verification_data">;
            } | null;
        } | null>;
    } | null;
};
export type NavSearchQuery = {
    readonly response: NavSearchQueryResponse;
    readonly variables: NavSearchQueryVariables;
};



/*
query NavSearchQuery(
  $query: String!
) {
  accounts(first: 4, query: $query) {
    edges {
      node {
        address
        config
        discordId
        imageUrl
        relayId
        user {
          publicUsername
          id
        }
        ...accounts_url
        id
      }
    }
  }
  collections(first: 4, query: $query, sortBy: SEVEN_DAY_VOLUME, includeHidden: true) {
    edges {
      node {
        assetContracts(first: 100) {
          edges {
            node {
              address
              id
            }
          }
        }
        imageUrl
        name
        relayId
        slug
        stats {
          totalSupply
          id
        }
        ...verification_data
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

fragment verification_data on CollectionType {
  isMintable
  isSafelisted
  isVerified
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "query"
  }
],
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 4
},
v2 = {
  "kind": "Variable",
  "name": "query",
  "variableName": "query"
},
v3 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
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
  "name": "config",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "discordId",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "publicUsername",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "UserType",
  "kind": "LinkedField",
  "name": "user",
  "plural": false,
  "selections": [
    (v9/*: any*/)
  ],
  "storageKey": null
},
v11 = [
  (v1/*: any*/),
  {
    "kind": "Literal",
    "name": "includeHidden",
    "value": true
  },
  (v2/*: any*/),
  {
    "kind": "Literal",
    "name": "sortBy",
    "value": "SEVEN_DAY_VOLUME"
  }
],
v12 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalSupply",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMintable",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSafelisted",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isVerified",
  "storageKey": null
},
v19 = {
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
    "name": "NavSearchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "AccountTypeConnection",
        "kind": "LinkedField",
        "name": "accounts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountTypeEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v10/*: any*/),
                  {
                    "kind": "InlineDataFragmentSpread",
                    "name": "accounts_url",
                    "selections": [
                      (v4/*: any*/),
                      (v10/*: any*/)
                    ]
                  }
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
        "args": (v11/*: any*/),
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
                  {
                    "alias": null,
                    "args": (v12/*: any*/),
                    "concreteType": "AssetContractTypeConnection",
                    "kind": "LinkedField",
                    "name": "assetContracts",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetContractTypeEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetContractType",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "assetContracts(first:100)"
                  },
                  (v7/*: any*/),
                  (v13/*: any*/),
                  (v8/*: any*/),
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CollectionStatsType",
                    "kind": "LinkedField",
                    "name": "stats",
                    "plural": false,
                    "selections": [
                      (v15/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "InlineDataFragmentSpread",
                    "name": "verification_data",
                    "selections": [
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/)
                    ]
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NavSearchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "AccountTypeConnection",
        "kind": "LinkedField",
        "name": "accounts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AccountTypeEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "UserType",
                    "kind": "LinkedField",
                    "name": "user",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
                      (v19/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v19/*: any*/)
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
        "args": (v11/*: any*/),
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
                  {
                    "alias": null,
                    "args": (v12/*: any*/),
                    "concreteType": "AssetContractTypeConnection",
                    "kind": "LinkedField",
                    "name": "assetContracts",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetContractTypeEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetContractType",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v19/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "assetContracts(first:100)"
                  },
                  (v7/*: any*/),
                  (v13/*: any*/),
                  (v8/*: any*/),
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CollectionStatsType",
                    "kind": "LinkedField",
                    "name": "stats",
                    "plural": false,
                    "selections": [
                      (v15/*: any*/),
                      (v19/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/)
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
    "cacheID": "8ab9226941b5f9d6cb6010e09e206af8",
    "id": null,
    "metadata": {},
    "name": "NavSearchQuery",
    "operationKind": "query",
    "text": "query NavSearchQuery(\n  $query: String!\n) {\n  accounts(first: 4, query: $query) {\n    edges {\n      node {\n        address\n        config\n        discordId\n        imageUrl\n        relayId\n        user {\n          publicUsername\n          id\n        }\n        ...accounts_url\n        id\n      }\n    }\n  }\n  collections(first: 4, query: $query, sortBy: SEVEN_DAY_VOLUME, includeHidden: true) {\n    edges {\n      node {\n        assetContracts(first: 100) {\n          edges {\n            node {\n              address\n              id\n            }\n          }\n        }\n        imageUrl\n        name\n        relayId\n        slug\n        stats {\n          totalSupply\n          id\n        }\n        ...verification_data\n        id\n      }\n    }\n  }\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment verification_data on CollectionType {\n  isMintable\n  isSafelisted\n  isVerified\n}\n"
  }
};
})();
(node as any).hash = 'e6cbbc05700a6f44cd4dda596e8b21be';
export default node;
