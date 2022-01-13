/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ActivitySearch_data = {
    readonly collection?: {
        readonly includeTradingHistory: boolean | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"CollectionHeadMetadata_data" | "ActivitySearchFilter_data" | "SearchPills_data">;
    readonly " $refType": "ActivitySearch_data";
};
export type ActivitySearch_data$data = ActivitySearch_data;
export type ActivitySearch_data$key = {
    readonly " $data"?: ActivitySearch_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ActivitySearch_data">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Variable",
    "name": "collection",
    "variableName": "collection"
  }
],
v1 = {
  "kind": "Variable",
  "name": "collections",
  "variableName": "collections"
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "categories"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "chains"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "collection"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "collectionQuery"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "collectionSortBy"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "collections"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "eventTypes"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "identity"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "includeHiddenCollections"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "isSingleCollection"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActivitySearch_data",
  "selections": [
    {
      "condition": "isSingleCollection",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": (v0/*: any*/),
          "concreteType": "CollectionType",
          "kind": "LinkedField",
          "name": "collection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "includeTradingHistory",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ]
    },
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "CollectionHeadMetadata_data"
    },
    {
      "args": [
        {
          "kind": "Variable",
          "name": "categories",
          "variableName": "categories"
        },
        {
          "kind": "Variable",
          "name": "chains",
          "variableName": "chains"
        },
        {
          "kind": "Variable",
          "name": "collectionQuery",
          "variableName": "collectionQuery"
        },
        {
          "kind": "Variable",
          "name": "collectionSortBy",
          "variableName": "collectionSortBy"
        },
        (v1/*: any*/),
        {
          "kind": "Variable",
          "name": "includeHiddenCollections",
          "variableName": "includeHiddenCollections"
        }
      ],
      "kind": "FragmentSpread",
      "name": "ActivitySearchFilter_data"
    },
    {
      "args": [
        (v1/*: any*/)
      ],
      "kind": "FragmentSpread",
      "name": "SearchPills_data"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();
(node as any).hash = '0821cf7f158a33d9c30b2ce8e46fb1ce';
export default node;
