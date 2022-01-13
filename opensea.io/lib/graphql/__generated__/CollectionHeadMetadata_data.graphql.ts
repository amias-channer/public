/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionHeadMetadata_data = {
    readonly collection: {
        readonly bannerImageUrl: string | null;
        readonly description: string | null;
        readonly imageUrl: string | null;
        readonly name: string;
    } | null;
    readonly " $refType": "CollectionHeadMetadata_data";
};
export type CollectionHeadMetadata_data$data = CollectionHeadMetadata_data;
export type CollectionHeadMetadata_data$key = {
    readonly " $data"?: CollectionHeadMetadata_data$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionHeadMetadata_data">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "collection"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionHeadMetadata_data",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "collection",
          "variableName": "collection"
        }
      ],
      "concreteType": "CollectionType",
      "kind": "LinkedField",
      "name": "collection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "bannerImageUrl",
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
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = 'd2929b5f80f8de86fc11bd6364cab423';
export default node;
