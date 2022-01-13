/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PriceHistoryStats_data = {
    readonly results: ReadonlyArray<{
        readonly quantity: number;
        readonly volume: {
            readonly asset: {
                readonly assetContract: {
                    readonly symbol: string;
                };
                readonly decimals: number | null;
            };
            readonly quantity: string;
        };
    }>;
    readonly " $refType": "PriceHistoryStats_data";
};
export type PriceHistoryStats_data$data = PriceHistoryStats_data;
export type PriceHistoryStats_data$key = {
    readonly " $data"?: PriceHistoryStats_data$data;
    readonly " $fragmentRefs": FragmentRefs<"PriceHistoryStats_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PriceHistoryStats_data",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TradeHistoryDataPoint",
      "kind": "LinkedField",
      "name": "results",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetQuantityType",
          "kind": "LinkedField",
          "name": "volume",
          "plural": false,
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
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "symbol",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "decimals",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            (v0/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "TradeHistoryType",
  "abstractKey": null
};
})();
(node as any).hash = '5851d85b0599de6f1a83fbf89dbd5c3d';
export default node;
