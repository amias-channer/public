/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ReportReason = "COPYRIGHT_INFRINGEMENT" | "EXPLICIT_AND_SENSITIVE_CONTENT" | "OTHER" | "%future added value";
export type ToolbarReportMutationVariables = {
    message?: string | null;
    asset?: string | null;
    reason?: ReportReason | null;
    originalCreatorUrl?: string | null;
};
export type ToolbarReportMutationResponse = {
    readonly flag: {
        readonly report: boolean | null;
    };
};
export type ToolbarReportMutation = {
    readonly response: ToolbarReportMutationResponse;
    readonly variables: ToolbarReportMutationVariables;
};



/*
mutation ToolbarReportMutation(
  $message: String
  $asset: AssetRelayID
  $reason: ReportReason
  $originalCreatorUrl: URL
) {
  flag {
    report(message: $message, asset: $asset, reason: $reason, originalCreatorUrl: $originalCreatorUrl)
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "asset"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "message"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "originalCreatorUrl"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "reason"
},
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "FlagMutationType",
    "kind": "LinkedField",
    "name": "flag",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "asset",
            "variableName": "asset"
          },
          {
            "kind": "Variable",
            "name": "message",
            "variableName": "message"
          },
          {
            "kind": "Variable",
            "name": "originalCreatorUrl",
            "variableName": "originalCreatorUrl"
          },
          {
            "kind": "Variable",
            "name": "reason",
            "variableName": "reason"
          }
        ],
        "kind": "ScalarField",
        "name": "report",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ToolbarReportMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ToolbarReportMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "2933119279843ab5efc239b7fa5dded1",
    "id": null,
    "metadata": {},
    "name": "ToolbarReportMutation",
    "operationKind": "mutation",
    "text": "mutation ToolbarReportMutation(\n  $message: String\n  $asset: AssetRelayID\n  $reason: ReportReason\n  $originalCreatorUrl: URL\n) {\n  flag {\n    report(message: $message, asset: $asset, reason: $reason, originalCreatorUrl: $originalCreatorUrl)\n  }\n}\n"
  }
};
})();
(node as any).hash = 'f66794ad53dcab07f193fb828a3db803';
export default node;
