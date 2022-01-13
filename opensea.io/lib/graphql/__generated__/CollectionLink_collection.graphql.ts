/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionLink_collection = {
    readonly slug: string;
    readonly name: string;
    readonly " $fragmentRefs": FragmentRefs<"verification_data">;
    readonly " $refType": "CollectionLink_collection";
};
export type CollectionLink_collection$data = CollectionLink_collection;
export type CollectionLink_collection$key = {
    readonly " $data"?: CollectionLink_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionLink_collection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionLink_collection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
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
(node as any).hash = '98732fa2624ed8e314406b49b245e61d';
export default node;
