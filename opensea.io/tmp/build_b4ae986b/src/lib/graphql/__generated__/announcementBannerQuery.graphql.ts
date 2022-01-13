/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AnnouncementBannerDisplayMode = "ALL_PAGES" | "CHAIN" | "HOMEPAGE_ONLY" | "%future added value";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type announcementBannerQueryVariables = {};
export type announcementBannerQueryResponse = {
    readonly announcementBanner: {
        readonly text: string;
        readonly url: string | null;
        readonly heading: string;
        readonly headingMobile: string;
        readonly ctaText: string;
        readonly chain: {
            readonly id: string;
            readonly identifier: ChainIdentifier;
        } | null;
        readonly displayMode: AnnouncementBannerDisplayMode;
    } | null;
};
export type announcementBannerQuery = {
    readonly response: announcementBannerQueryResponse;
    readonly variables: announcementBannerQueryVariables;
};



/*
query announcementBannerQuery {
  announcementBanner {
    text
    url
    heading
    headingMobile
    ctaText
    chain {
      id
      identifier
    }
    displayMode
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "heading",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "headingMobile",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctaText",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "ChainType",
  "kind": "LinkedField",
  "name": "chain",
  "plural": false,
  "selections": [
    (v5/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "identifier",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayMode",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "announcementBannerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AnnouncementBannerType",
        "kind": "LinkedField",
        "name": "announcementBanner",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "announcementBannerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AnnouncementBannerType",
        "kind": "LinkedField",
        "name": "announcementBanner",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c6b2ec8dfdfdc8c21439e536d5f63e61",
    "id": null,
    "metadata": {},
    "name": "announcementBannerQuery",
    "operationKind": "query",
    "text": "query announcementBannerQuery {\n  announcementBanner {\n    text\n    url\n    heading\n    headingMobile\n    ctaText\n    chain {\n      id\n      identifier\n    }\n    displayMode\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '82ff0bd8a8408318c8e49d10616e15dc';
export default node;
