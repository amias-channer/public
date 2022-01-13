/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionCardContextMenu_data = {
    readonly " $fragmentRefs": FragmentRefs<"collection_url">;
    readonly " $refType": "CollectionCardContextMenu_data";
};
export type CollectionCardContextMenu_data$data = CollectionCardContextMenu_data;
export type CollectionCardContextMenu_data$key = {
    readonly " $data"?: CollectionCardContextMenu_data$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionCardContextMenu_data">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionCardContextMenu_data",
  "selections": [
    {
      "kind": "InlineDataFragmentSpread",
      "name": "collection_url",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "CollectionType",
  "abstractKey": null
};
(node as any).hash = '97b1d12017f765d3122871168f060d38';
export default node;
