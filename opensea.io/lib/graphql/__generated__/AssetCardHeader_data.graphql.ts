/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AssetCardHeader_data = {
    readonly relayId: string;
    readonly favoritesCount: number;
    readonly isDelisted: boolean;
    readonly isFavorite: boolean;
    readonly " $refType": "AssetCardHeader_data";
};
export type AssetCardHeader_data$data = AssetCardHeader_data;
export type AssetCardHeader_data$key = {
    readonly " $data"?: AssetCardHeader_data$data;
    readonly " $fragmentRefs": FragmentRefs<"AssetCardHeader_data">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AssetCardHeader_data",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "relayId",
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
      "kind": "ScalarField",
      "name": "isDelisted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isFavorite",
      "storageKey": null
    }
  ],
  "type": "AssetType",
  "abstractKey": null
};
(node as any).hash = '017b9c24e359423b685bd6a1a09c8666';
export default node;
