/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionCard_data = {
    readonly description: string | null;
    readonly name: string;
    readonly shortDescription: string | null;
    readonly slug: string;
    readonly logo: string | null;
    readonly banner: string | null;
    readonly owner: {
        readonly displayName: string | null;
        readonly user: {
            readonly username: string;
        } | null;
    } | null;
    readonly stats: {
        readonly totalSupply: number;
    };
    readonly " $fragmentRefs": FragmentRefs<"CollectionCardContextMenu_data" | "collection_url">;
    readonly " $refType": "CollectionCard_data";
};
export type CollectionCard_data$data = CollectionCard_data;
export type CollectionCard_data$key = {
    readonly " $data"?: CollectionCard_data$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionCard_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionCard_data",
  "selections": [
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
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "shortDescription",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "logo",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "banner",
      "storageKey": null
    },
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
          "name": "displayName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "UserType",
          "kind": "LinkedField",
          "name": "user",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "username",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
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
          "name": "totalSupply",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollectionCardContextMenu_data"
    },
    {
      "kind": "InlineDataFragmentSpread",
      "name": "collection_url",
      "selections": [
        (v0/*: any*/)
      ]
    }
  ],
  "type": "CollectionType",
  "abstractKey": null
};
})();
(node as any).hash = '1252462cd5b8a61c05fe9ff28fdef10d';
export default node;
