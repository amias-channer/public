/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type AssetCardContent_asset = {
    readonly relayId: string;
    readonly name: string | null;
    readonly assetContract: {
        readonly address: string;
        readonly chain: ChainIdentifier;
        readonly openseaVersion: string | null;
    };
    readonly tokenId: string;
    readonly collection: {
        readonly slug: string;
    };
    readonly isDelisted: boolean;
    readonly " $fragmentRefs": FragmentRefs<"AssetMedia_asset" | "AssetContextMenu_data">;
    readonly " $refType": "AssetCardContent_asset";
};
export type AssetCardContent_asset$data = AssetCardContent_asset;
export type AssetCardContent_asset$key = {
    readonly " $data"?: AssetCardContent_asset$data;
    readonly " $fragmentRefs": FragmentRefs<"AssetCardContent_asset">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "showContextMenu"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "AssetCardContent_asset",
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
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AssetContractType",
      "kind": "LinkedField",
      "name": "assetContract",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "address",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "chain",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "openseaVersion",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tokenId",
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
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isDelisted",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AssetMedia_asset"
    },
    {
      "condition": "showContextMenu",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "args": [
            {
              "kind": "Literal",
              "name": "identity",
              "value": {}
            }
          ],
          "kind": "FragmentSpread",
          "name": "AssetContextMenu_data"
        }
      ]
    }
  ],
  "type": "AssetType",
  "abstractKey": null
};
(node as any).hash = '716de36b23f6c232f819c02f9f93cb4d';
export default node;
