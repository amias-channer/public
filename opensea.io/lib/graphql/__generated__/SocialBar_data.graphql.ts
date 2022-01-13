/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SocialBar_data = {
    readonly discordUrl: string | null;
    readonly externalUrl: string | null;
    readonly instagramUsername: string | null;
    readonly isEditable: boolean;
    readonly mediumUsername: string | null;
    readonly slug: string;
    readonly telegramUrl: string | null;
    readonly twitterUsername: string | null;
    readonly relayId: string;
    readonly " $fragmentRefs": FragmentRefs<"collection_url">;
    readonly " $refType": "SocialBar_data";
};
export type SocialBar_data$data = SocialBar_data;
export type SocialBar_data$key = {
    readonly " $data"?: SocialBar_data$data;
    readonly " $fragmentRefs": FragmentRefs<"SocialBar_data">;
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
  "name": "SocialBar_data",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "discordUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "externalUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "instagramUsername",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isEditable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mediumUsername",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "telegramUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "twitterUsername",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "relayId",
      "storageKey": null
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
(node as any).hash = '4c7fc036fbe85bb308c7e8c1b5225695';
export default node;
