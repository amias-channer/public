/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionHeader_data = {
    readonly name: string;
    readonly description: string | null;
    readonly imageUrl: string | null;
    readonly bannerImageUrl: string | null;
    readonly " $fragmentRefs": FragmentRefs<"CollectionStatsBar_data" | "SocialBar_data" | "verification_data">;
    readonly " $refType": "CollectionHeader_data";
};
export type CollectionHeader_data$data = CollectionHeader_data;
export type CollectionHeader_data$key = {
    readonly " $data"?: CollectionHeader_data$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionHeader_data">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionHeader_data",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imageUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerImageUrl",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollectionStatsBar_data"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SocialBar_data"
    },
    {
      "kind": "InlineDataFragmentSpread",
      "name": "verification_data",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isMintable",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isSafelisted",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isVerified",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "CollectionType",
  "abstractKey": null
};
(node as any).hash = '3ea613a8ec01fede5b0867a35524613e';
export default node;
