/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type collectionManagerIndex_collections = {
    readonly collections: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"CollectionCard_data">;
            } | null;
        } | null>;
    } | null;
    readonly " $refType": "collectionManagerIndex_collections";
};
export type collectionManagerIndex_collections$data = collectionManagerIndex_collections;
export type collectionManagerIndex_collections$key = {
    readonly " $data"?: collectionManagerIndex_collections$data;
    readonly " $fragmentRefs": FragmentRefs<"collectionManagerIndex_collections">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "count"
    },
    {
      "kind": "RootArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "collections"
        ]
      }
    ]
  },
  "name": "collectionManagerIndex_collections",
  "selections": [
    {
      "alias": "collections",
      "args": [
        {
          "kind": "Literal",
          "name": "editor",
          "value": {}
        },
        {
          "kind": "Literal",
          "name": "sortBy",
          "value": "CREATED_DATE"
        }
      ],
      "concreteType": "CollectionTypeConnection",
      "kind": "LinkedField",
      "name": "__collectionManagerIndex_collections_connection",
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
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "CollectionCard_data"
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
      "storageKey": "__collectionManagerIndex_collections_connection(editor:{},sortBy:\"CREATED_DATE\")"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = '266a932dd1794c7b19b490d22bee6a08';
export default node;
