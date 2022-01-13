/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type IdentityInputType = {
    address?: string | null;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
    name?: string | null;
    username?: string | null;
};
export type CollectionSelectQueryVariables = {
    query?: string | null;
    editor: IdentityInputType;
};
export type CollectionSelectQueryResponse = {
    readonly collections: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly name: string;
                readonly imageUrl: string | null;
                readonly slug: string;
            } | null;
        } | null>;
    } | null;
};
export type CollectionSelectQuery = {
    readonly response: CollectionSelectQueryResponse;
    readonly variables: CollectionSelectQueryVariables;
};



/*
query CollectionSelectQuery(
  $query: String
  $editor: IdentityInputType!
) {
  collections(editor: $editor, first: 25, sortBy: CREATED_DATE, query: $query) {
    edges {
      node {
        name
        imageUrl
        slug
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
  "name": "editor"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v2 = [
  {
    "kind": "Variable",
    "name": "editor",
    "variableName": "editor"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  },
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  },
  {
    "kind": "Literal",
    "name": "sortBy",
    "value": "CREATED_DATE"
  }
],
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
  "name": "imageUrl",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CollectionSelectQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/)
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
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CollectionSelectQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
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
    ]
  },
  "params": {
    "cacheID": "03f331ff38bca876bbe6e23c00d240cf",
    "id": null,
    "metadata": {},
    "name": "CollectionSelectQuery",
    "operationKind": "query",
    "text": "query CollectionSelectQuery(\n  $query: String\n  $editor: IdentityInputType!\n) {\n  collections(editor: $editor, first: 25, sortBy: CREATED_DATE, query: $query) {\n    edges {\n      node {\n        name\n        imageUrl\n        slug\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '3943891c89a01febb9365be69522a829';
export default node;
