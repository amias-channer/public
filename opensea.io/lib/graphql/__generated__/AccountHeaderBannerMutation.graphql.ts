/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AccountMutationInput = {
    accountSignature?: AccountSignature | null;
    bannerImage?: unknown | null;
    bio?: string | null;
    identity?: IdentityInputType | null;
    nickname?: string | null;
    profileImage?: unknown | null;
    clientMutationId?: string | null;
};
export type AccountSignature = {
    address: string;
    message: string;
    signature: string;
};
export type IdentityInputType = {
    address?: string | null;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
    name?: string | null;
    username?: string | null;
};
export type AccountHeaderBannerMutationVariables = {
    input: AccountMutationInput;
};
export type AccountHeaderBannerMutationResponse = {
    readonly account: {
        readonly bannerImageUrl: string | null;
    } | null;
};
export type AccountHeaderBannerMutation = {
    readonly response: AccountHeaderBannerMutationResponse;
    readonly variables: AccountHeaderBannerMutationVariables;
};



/*
mutation AccountHeaderBannerMutation(
  $input: AccountMutationInput!
) {
  account(input: $input) {
    bannerImageUrl
    id
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
  "name": "bannerImageUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AccountHeaderBannerMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AccountType",
        "kind": "LinkedField",
        "name": "account",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "AccountHeaderBannerMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AccountType",
        "kind": "LinkedField",
        "name": "account",
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
    ]
  },
  "params": {
    "cacheID": "704f354656ea26b03bfdd1d38bf4702f",
    "id": null,
    "metadata": {},
    "name": "AccountHeaderBannerMutation",
    "operationKind": "mutation",
    "text": "mutation AccountHeaderBannerMutation(\n  $input: AccountMutationInput!\n) {\n  account(input: $input) {\n    bannerImageUrl\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '94a5a9847c3cfadb0d314577deb9196d';
export default node;
