/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionStatsBar_data = {
    readonly stats: {
        readonly floorPrice: number | null;
        readonly numOwners: number;
        readonly totalSupply: number;
        readonly totalVolume: number;
    };
    readonly slug: string;
    readonly " $refType": "CollectionStatsBar_data";
};
export type CollectionStatsBar_data$data = CollectionStatsBar_data;
export type CollectionStatsBar_data$key = {
    readonly " $data"?: CollectionStatsBar_data$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionStatsBar_data">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionStatsBar_data",
  "selections": [
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
          "name": "floorPrice",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "numOwners",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalSupply",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalVolume",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    }
  ],
  "type": "CollectionType",
  "abstractKey": null
};
(node as any).hash = 'e0d17d36536989a64ede5307de562fdd';
export default node;
