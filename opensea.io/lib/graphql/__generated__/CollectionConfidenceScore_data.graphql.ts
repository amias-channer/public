/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Config = "AFFILIATE" | "AFFILIATE_BLACKLISTED" | "AFFILIATE_REQUESTED" | "MODERATOR" | "PARTNER" | "VERIFIED" | "%future added value";
export type CollectionConfidenceScore_data = {
    readonly numVisitors: number;
    readonly favoritesCount: number;
    readonly collection: {
        readonly name: string;
        readonly createdDate: string;
        readonly owner: {
            readonly config: Config | null;
            readonly createdDate: string;
        } | null;
        readonly stats: {
            readonly totalVolume: number;
            readonly totalSales: number;
            readonly totalSupply: number;
        };
    };
    readonly " $refType": "CollectionConfidenceScore_data";
};
export type CollectionConfidenceScore_data$data = CollectionConfidenceScore_data;
export type CollectionConfidenceScore_data$key = {
    readonly " $data"?: CollectionConfidenceScore_data$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionConfidenceScore_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdDate",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionConfidenceScore_data",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "numVisitors",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "favoritesCount",
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
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "AccountType",
          "kind": "LinkedField",
          "name": "owner",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "config",
              "storageKey": null
            },
            (v0/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CollectionStatsType",
          "kind": "LinkedField",
          "name": "stats",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "totalVolume",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "totalSales",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "totalSupply",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "AssetType",
  "abstractKey": null
};
})();
(node as any).hash = '7ccc468e9f91a906740d091bfb1ad438';
export default node;
