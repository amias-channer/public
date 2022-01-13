/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type NSFWPreference = "CENSOR" | "HIDE" | "SHOW" | "%future added value";
export type UserModifyMutationInput = {
    email?: string | null;
    username?: string | null;
    bidReceivedEmailsPriceThreshold?: string | null;
    bio?: string | null;
    hasAffirmativelyAcceptedOpenseaTerms?: boolean | null;
    receiveItemSoldEmails?: boolean | null;
    receiveBidReceivedEmails?: boolean | null;
    receiveBidItemPriceChangeEmails?: boolean | null;
    receiveNewAssetReceivedEmails?: boolean | null;
    receiveOutbidEmails?: boolean | null;
    receiveReferralEmails?: boolean | null;
    receiveAuctionCreationEmails?: boolean | null;
    receiveAuctionExpirationEmails?: boolean | null;
    receiveBidInvalidEmails?: boolean | null;
    receiveBundleInvalidEmails?: boolean | null;
    receivePurchaseEmails?: boolean | null;
    receiveCancellationEmails?: boolean | null;
    receiveNewsletter?: boolean | null;
    receiveOwnedAssetUpdateEmails?: boolean | null;
    receiveStorefrontWhitelistedEmails?: boolean | null;
    nsfwPreference?: NSFWPreference | null;
    clientMutationId?: string | null;
};
export type ordersTermsAcceptanceMutationVariables = {
    input: UserModifyMutationInput;
};
export type ordersTermsAcceptanceMutationResponse = {
    readonly users: {
        readonly modify: {
            readonly relayId: string;
        };
    };
};
export type ordersTermsAcceptanceMutation = {
    readonly response: ordersTermsAcceptanceMutationResponse;
    readonly variables: ordersTermsAcceptanceMutationVariables;
};



/*
mutation ordersTermsAcceptanceMutation(
  $input: UserModifyMutationInput!
) {
  users {
    modify(input: $input) {
      relayId
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ordersTermsAcceptanceMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "UserMutationType",
        "kind": "LinkedField",
        "name": "users",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "UserType",
            "kind": "LinkedField",
            "name": "modify",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ordersTermsAcceptanceMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "UserMutationType",
        "kind": "LinkedField",
        "name": "users",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "UserType",
            "kind": "LinkedField",
            "name": "modify",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6d3496aa31dbe423fa0bd2e92079868a",
    "id": null,
    "metadata": {},
    "name": "ordersTermsAcceptanceMutation",
    "operationKind": "mutation",
    "text": "mutation ordersTermsAcceptanceMutation(\n  $input: UserModifyMutationInput!\n) {\n  users {\n    modify(input: $input) {\n      relayId\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '56de9920c569fe785e113840e1181ebf';
export default node;
