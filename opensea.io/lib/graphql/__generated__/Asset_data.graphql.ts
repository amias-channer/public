/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type Asset_data = {
    readonly asset: {
        readonly assetContract: {
            readonly chain: ChainIdentifier;
        };
        readonly isDelisted: boolean;
        readonly " $fragmentRefs": FragmentRefs<"AssetCardHeader_data" | "AssetCardContent_asset" | "AssetCardFooter_asset" | "AssetMedia_asset" | "asset_url" | "itemEvents_data">;
    } | null;
    readonly assetBundle: {
        readonly slug: string | null;
        readonly " $fragmentRefs": FragmentRefs<"AssetCardContent_assetBundle" | "AssetCardFooter_assetBundle">;
    } | null;
    readonly " $refType": "Asset_data";
};
export type Asset_data$data = Asset_data;
export type Asset_data$key = {
    readonly " $data"?: Asset_data$data;
    readonly " $fragmentRefs": FragmentRefs<"Asset_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v1 = [
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
      (v0/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "tokenId",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": {},
      "kind": "LocalArgument",
      "name": "identity"
    },
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "shouldShowQuantity"
    },
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "showContextMenu"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Asset_data",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "AssetType",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetContractType",
          "kind": "LinkedField",
          "name": "assetContract",
          "plural": false,
          "selections": [
            (v0/*: any*/)
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
          "name": "AssetCardHeader_data"
        },
        {
          "args": [
            {
              "kind": "Variable",
              "name": "showContextMenu",
              "variableName": "showContextMenu"
            }
          ],
          "kind": "FragmentSpread",
          "name": "AssetCardContent_asset"
        },
        {
          "args": [
            {
              "kind": "Variable",
              "name": "identity",
              "variableName": "identity"
            },
            {
              "kind": "Variable",
              "name": "shouldShowQuantity",
              "variableName": "shouldShowQuantity"
            }
          ],
          "kind": "FragmentSpread",
          "name": "AssetCardFooter_asset"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "AssetMedia_asset"
        },
        {
          "kind": "InlineDataFragmentSpread",
          "name": "asset_url",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineDataFragmentSpread",
          "name": "itemEvents_data",
          "selections": (v1/*: any*/)
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AssetBundleType",
      "kind": "LinkedField",
      "name": "assetBundle",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "AssetCardContent_assetBundle"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "AssetCardFooter_assetBundle"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SearchResultType",
  "abstractKey": null
};
})();
(node as any).hash = 'c7eb8000bb626bf50399549ff9c904a2';
export default node;
