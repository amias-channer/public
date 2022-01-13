/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CardDisplayStyle = "CONTAIN" | "COVER" | "PADDED" | "%future added value";
export type AssetMedia_asset = {
    readonly animationUrl: string | null;
    readonly backgroundColor: string | null;
    readonly collection: {
        readonly description: string | null;
        readonly displayData: {
            readonly cardDisplayStyle: CardDisplayStyle | null;
        };
        readonly imageUrl: string | null;
        readonly hidden: boolean;
        readonly name: string;
        readonly slug: string;
    };
    readonly description: string | null;
    readonly name: string | null;
    readonly tokenId: string;
    readonly imageUrl: string | null;
    readonly isDelisted: boolean;
    readonly " $refType": "AssetMedia_asset";
};
export type AssetMedia_asset$data = AssetMedia_asset;
export type AssetMedia_asset$key = {
    readonly " $data"?: AssetMedia_asset$data;
    readonly " $fragmentRefs": FragmentRefs<"AssetMedia_asset">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AssetMedia_asset",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "animationUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CollectionType",
      "kind": "LinkedField",
      "name": "collection",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "DisplayDataType",
          "kind": "LinkedField",
          "name": "displayData",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cardDisplayStyle",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hidden",
          "storageKey": null
        },
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    (v0/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tokenId",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isDelisted",
      "storageKey": null
    }
  ],
  "type": "AssetType",
  "abstractKey": null
};
})();
(node as any).hash = '070d3544a86f9bec8b9bd43290d798e1';
export default node;
