/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type profilePageQueries_account = {
    readonly user: {
        readonly favoriteAssetCount: number;
    } | null;
    readonly privateAssetCount?: number;
    readonly " $refType": "profilePageQueries_account";
};
export type profilePageQueries_account$data = profilePageQueries_account;
export type profilePageQueries_account$key = {
    readonly " $data"?: profilePageQueries_account$data;
    readonly " $fragmentRefs": FragmentRefs<"profilePageQueries_account">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "isCurrentUser"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "profilePageQueries_account",
  "selections": [
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
          "name": "favoriteAssetCount",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "condition": "isCurrentUser",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "privateAssetCount",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "AccountType",
  "abstractKey": null
};
(node as any).hash = '727e46e20070c3538b4b1a5c8c0e64f2';
export default node;
