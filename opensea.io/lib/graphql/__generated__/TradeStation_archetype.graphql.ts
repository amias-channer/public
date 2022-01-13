/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TradeStation_archetype = {
    readonly " $fragmentRefs": FragmentRefs<"BidModalContent_archetype">;
    readonly " $refType": "TradeStation_archetype";
};
export type TradeStation_archetype$data = TradeStation_archetype;
export type TradeStation_archetype$key = {
    readonly " $data"?: TradeStation_archetype$data;
    readonly " $fragmentRefs": FragmentRefs<"TradeStation_archetype">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "chain"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "identity"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "TradeStation_archetype",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "chain",
          "variableName": "chain"
        },
        {
          "kind": "Variable",
          "name": "identity",
          "variableName": "identity"
        }
      ],
      "kind": "FragmentSpread",
      "name": "BidModalContent_archetype"
    }
  ],
  "type": "ArchetypeType",
  "abstractKey": null
};
(node as any).hash = '92250a62a291838db913b5e4b902b9ce';
export default node;
