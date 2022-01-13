/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Config = "AFFILIATE" | "AFFILIATE_BLACKLISTED" | "AFFILIATE_REQUESTED" | "MODERATOR" | "PARTNER" | "VERIFIED" | "%future added value";
export type AccountHeader_data = {
    readonly address: string;
    readonly bio: string | null;
    readonly bannerImageUrl: string | null;
    readonly config: Config | null;
    readonly discordId: string | null;
    readonly relayId: string;
    readonly names: ReadonlyArray<{
        readonly name: string;
        readonly type: string;
    }>;
    readonly displayName: string | null;
    readonly " $fragmentRefs": FragmentRefs<"accounts_url" | "ProfileImage_data">;
    readonly " $refType": "AccountHeader_data";
};
export type AccountHeader_data$data = AccountHeader_data;
export type AccountHeader_data$key = {
    readonly " $data"?: AccountHeader_data$data;
    readonly " $fragmentRefs": FragmentRefs<"AccountHeader_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AccountHeader_data",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bio",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "config",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "discordId",
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
      "alias": null,
      "args": null,
      "concreteType": "Name",
      "kind": "LinkedField",
      "name": "names",
      "plural": true,
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
          "name": "type",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayName",
      "storageKey": null
    },
    {
      "kind": "InlineDataFragmentSpread",
      "name": "accounts_url",
      "selections": [
        (v0/*: any*/),
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
              "name": "publicUsername",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ]
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ProfileImage_data"
    }
  ],
  "type": "AccountType",
  "abstractKey": null
};
})();
(node as any).hash = 'cc372ffee5e75959a009ba54a8d1d6b0';
export default node;
