/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ActionTypes = "ASK_FOR_ASSET_SWAP" | "ASK_FOR_DEPOSIT" | "ASSET_APPROVAL" | "ASSET_FREEZE_METADATA" | "ASSET_SWAP" | "ASSET_TRANSFER" | "CANCEL_ORDER" | "CREATE_ORDER" | "FULFILL" | "MATIC_EXIT" | "PAYMENT_ASSET_APPROVAL" | "WAIT_FOR_BALANCE" | "%future added value";
export type ClientSignatureStandard = "PERSONAL" | "TYPED_DATA_V1" | "TYPED_DATA_V3" | "TYPED_DATA_V4" | "%future added value";
export type ActionPanelList_data = {
    readonly actions: ReadonlyArray<{
        readonly actionType: ActionTypes;
        readonly signAndPost: {
            readonly orderData: string | null;
            readonly clientMessage: string;
            readonly serverSignature: string | null;
            readonly orderId: string | null;
        } | null;
        readonly metaTransaction: {
            readonly clientMessage: string;
            readonly clientSignatureStandard: ClientSignatureStandard;
            readonly functionSignature: string;
            readonly verifyingContract: string;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"ActionPanel_data">;
    }>;
    readonly " $refType": "ActionPanelList_data";
};
export type ActionPanelList_data$data = ActionPanelList_data;
export type ActionPanelList_data$key = {
    readonly " $data"?: ActionPanelList_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ActionPanelList_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "clientMessage",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActionPanelList_data",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ActionType",
      "kind": "LinkedField",
      "name": "actions",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "actionType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "SignAndPostType",
          "kind": "LinkedField",
          "name": "signAndPost",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "orderData",
              "storageKey": null
            },
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "serverSignature",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "orderId",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "MetaTransactionDataType",
          "kind": "LinkedField",
          "name": "metaTransaction",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "clientSignatureStandard",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "functionSignature",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "verifyingContract",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ActionPanel_data"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ActionDataType",
  "abstractKey": null
};
})();
(node as any).hash = 'f25a01554794702f4ebfba1887e45913';
export default node;
