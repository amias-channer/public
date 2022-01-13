/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CardDisplayStyle = "CONTAIN" | "COVER" | "PADDED" | "%future added value";
export type ChainIdentifier = "BAOBAB" | "BSC" | "BSC_TESTNET" | "ETHEREUM" | "FLOW" | "GOERLI" | "KLAYTN" | "LOCAL" | "MATIC" | "MUMBAI" | "RINKEBY" | "XDAI" | "%future added value";
export type OrderV2OrderType = "BASIC" | "DUTCH" | "ENGLISH" | "%future added value";
export type TraitDisplayType = "AUTHOR" | "BOOST_NUMBER" | "BOOST_PERCENTAGE" | "DATE" | "NONE" | "NUMBER" | "%future added value";
export type ArchetypeInputType = {
    assetContractAddress: string;
    tokenId: string;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
};
export type itemQueryVariables = {
    archetype: ArchetypeInputType;
    chain?: | "ETHEREUM" | "MATIC" | "KLAYTN" | "XDAI" | "BSC" | "FLOW" | "LOCAL" | "RINKEBY" | "MUMBAI" | "BAOBAB" | "BSC_TESTNET" | "GOERLI" | "%future added value" | null;
};
export type itemQueryResponse = {
    readonly archetype: {
        readonly asset: {
            readonly assetContract: {
                readonly address: string;
                readonly chain: ChainIdentifier;
                readonly blockExplorerLink: string;
            };
            readonly assetOwners: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly quantity: string;
                        readonly owner: {
                            readonly " $fragmentRefs": FragmentRefs<"AccountLink_data">;
                        };
                    } | null;
                } | null>;
            } | null;
            readonly creator: {
                readonly " $fragmentRefs": FragmentRefs<"AccountLink_data">;
            } | null;
            readonly animationUrl: string | null;
            readonly backgroundColor: string | null;
            readonly collection: {
                readonly description: string | null;
                readonly displayData: {
                    readonly cardDisplayStyle: CardDisplayStyle | null;
                };
                readonly hidden: boolean;
                readonly imageUrl: string | null;
                readonly name: string;
                readonly slug: string;
                readonly " $fragmentRefs": FragmentRefs<"CollectionLink_collection" | "Boost_collection" | "Property_collection" | "NumericTrait_collection" | "SocialBar_data" | "verification_data">;
            };
            readonly decimals: number | null;
            readonly description: string | null;
            readonly imageUrl: string | null;
            readonly numVisitors: number;
            readonly isDelisted: boolean;
            readonly isListable: boolean;
            readonly name: string | null;
            readonly relayId: string;
            readonly tokenId: string;
            readonly hasUnlockableContent: boolean;
            readonly favoritesCount: number;
            readonly traits: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly relayId: string;
                        readonly displayType: TraitDisplayType | null;
                        readonly floatValue: number | null;
                        readonly intValue: string | null;
                        readonly traitType: string;
                        readonly value: string | null;
                        readonly " $fragmentRefs": FragmentRefs<"Boost_trait" | "Property_trait" | "NumericTrait_trait" | "Date_trait">;
                    } | null;
                } | null>;
            };
            readonly " $fragmentRefs": FragmentRefs<"AssetCardHeader_data" | "assetInputType" | "AssetMedia_asset" | "EnsManualEntryModal_asset" | "Toolbar_asset" | "asset_url" | "itemEvents_data" | "ChainInfo_data">;
        } | null;
        readonly ownedQuantity: string | null;
        readonly ownershipCount: number;
        readonly quantity: string;
        readonly " $fragmentRefs": FragmentRefs<"TradeStation_archetype" | "BidModalContent_archetype">;
    } | null;
    readonly tradeSummary: {
        readonly bestAsk: {
            readonly closedAt: string | null;
            readonly orderType: OrderV2OrderType;
            readonly maker: {
                readonly " $fragmentRefs": FragmentRefs<"wallet_accountKey">;
            };
            readonly relayId: string;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"BidModalContent_trade" | "TradeStation_data">;
    };
    readonly assetEvents: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly relayId: string;
            } | null;
        } | null>;
    } | null;
};
export type itemQuery = {
    readonly response: itemQueryResponse;
    readonly variables: itemQueryVariables;
};



/*
query itemQuery(
  $archetype: ArchetypeInputType!
  $chain: ChainScalar
) {
  archetype(archetype: $archetype) {
    asset {
      ...AssetCardHeader_data
      ...assetInputType
      assetContract {
        address
        chain
        blockExplorerLink
        id
      }
      assetOwners(first: 1) {
        edges {
          node {
            quantity
            owner {
              ...AccountLink_data
              id
            }
            id
          }
        }
      }
      creator {
        ...AccountLink_data
        id
      }
      animationUrl
      backgroundColor
      collection {
        description
        displayData {
          cardDisplayStyle
        }
        hidden
        imageUrl
        name
        slug
        ...CollectionLink_collection
        ...Boost_collection
        ...Property_collection
        ...NumericTrait_collection
        ...SocialBar_data
        ...verification_data
        id
      }
      decimals
      description
      imageUrl
      numVisitors
      isDelisted
      isListable
      name
      relayId
      tokenId
      hasUnlockableContent
      favoritesCount
      traits(first: 100) {
        edges {
          node {
            relayId
            displayType
            floatValue
            intValue
            traitType
            value
            ...Boost_trait
            ...Property_trait
            ...NumericTrait_trait
            ...Date_trait
            id
          }
        }
      }
      ...AssetMedia_asset
      ...EnsManualEntryModal_asset
      ...Toolbar_asset
      ...asset_url
      ...itemEvents_data
      ...ChainInfo_data
      id
    }
    ownedQuantity(identity: {})
    ownershipCount
    quantity
    ...TradeStation_archetype_3wquQ2
    ...BidModalContent_archetype_3wquQ2
  }
  tradeSummary(archetype: $archetype) {
    bestAsk {
      closedAt
      orderType
      maker {
        ...wallet_accountKey
        id
      }
      relayId
      id
    }
    ...BidModalContent_trade
    ...TradeStation_data
  }
  assetEvents(archetype: $archetype, first: 11) {
    edges {
      node {
        relayId
        id
      }
    }
  }
}

fragment AccountLink_data on AccountType {
  address
  user {
    publicUsername
    id
  }
  ...ProfileImage_data
  ...wallet_accountKey
  ...accounts_url
}

fragment AskPrice_data on OrderV2Type {
  dutchAuctionFinalPrice
  openedAt
  priceFnEndedAt
  makerAssetBundle {
    assetQuantities(first: 30) {
      edges {
        node {
          ...quantity_data
          id
        }
      }
    }
    id
  }
  takerAssetBundle {
    assetQuantities(first: 1) {
      edges {
        node {
          ...AssetQuantity_data
          id
        }
      }
    }
    id
  }
}

fragment AssetCardHeader_data on AssetType {
  relayId
  favoritesCount
  isDelisted
  isFavorite
}

fragment AssetMedia_asset on AssetType {
  animationUrl
  backgroundColor
  collection {
    description
    displayData {
      cardDisplayStyle
    }
    imageUrl
    hidden
    name
    slug
    id
  }
  description
  name
  tokenId
  imageUrl
  isDelisted
}

fragment AssetQuantity_data on AssetQuantityType {
  asset {
    ...Price_data
    id
  }
  quantity
}

fragment BidModalContent_archetype_3wquQ2 on ArchetypeType {
  asset {
    assetContract {
      address
      chain
      id
    }
    decimals
    relayId
    collection {
      slug
      paymentAssets(chain: $chain) {
        relayId
        asset {
          assetContract {
            address
            chain
            id
          }
          decimals
          symbol
          usdSpotPrice
          relayId
          id
        }
        ...PaymentTokenInputV2_data
        id
      }
      ...verification_data
      id
    }
    id
  }
  quantity
  ownedQuantity(identity: {})
}

fragment BidModalContent_trade on TradeSummaryType {
  bestAsk {
    closedAt
    isFulfillable
    oldOrder
    orderType
    relayId
    makerAssetBundle {
      assetQuantities(first: 30) {
        edges {
          node {
            asset {
              collection {
                ...verification_data
                id
              }
              id
            }
            id
          }
        }
      }
      id
    }
    takerAssetBundle {
      assetQuantities(first: 1) {
        edges {
          node {
            quantity
            asset {
              decimals
              relayId
              id
            }
            id
          }
        }
      }
      id
    }
    id
  }
  bestBid {
    relayId
    makerAssetBundle {
      assetQuantities(first: 1) {
        edges {
          node {
            quantity
            asset {
              decimals
              id
            }
            ...AssetQuantity_data
            id
          }
        }
      }
      id
    }
    id
  }
}

fragment Boost_collection on CollectionType {
  numericTraits {
    key
    value {
      max
      min
    }
  }
  slug
}

fragment Boost_trait on TraitType {
  displayType
  floatValue
  intValue
  traitType
}

fragment ChainInfo_data on AssetType {
  assetContract {
    openseaVersion
    address
    chain
    blockExplorerLink
    id
  }
  isEditableByOwner {
    value
  }
  tokenId
  isFrozen
  frozenAt
  tokenMetadata
}

fragment CollectionLink_collection on CollectionType {
  slug
  name
  ...verification_data
}

fragment Date_trait on TraitType {
  traitType
  floatValue
  intValue
}

fragment EnsManualEntryModal_asset on AssetType {
  assetContract {
    address
    id
  }
  tokenId
}

fragment NumericTrait_collection on CollectionType {
  numericTraits {
    key
    value {
      max
      min
    }
  }
  slug
}

fragment NumericTrait_trait on TraitType {
  displayType
  floatValue
  intValue
  maxValue
  traitType
}

fragment PaymentAsset_data on PaymentAssetType {
  asset {
    assetContract {
      chain
      id
    }
    imageUrl
    symbol
    id
  }
}

fragment PaymentTokenInputV2_data on PaymentAssetType {
  relayId
  asset {
    decimals
    symbol
    usdSpotPrice
    id
  }
  ...PaymentAsset_data
}

fragment Price_data on AssetType {
  decimals
  imageUrl
  symbol
  usdSpotPrice
  assetContract {
    blockExplorerLink
    chain
    id
  }
}

fragment ProfileImage_data on AccountType {
  imageUrl
  address
}

fragment Property_collection on CollectionType {
  slug
  stats {
    totalSupply
    id
  }
}

fragment Property_trait on TraitType {
  displayType
  traitCount
  traitType
  value
}

fragment SocialBar_data on CollectionType {
  discordUrl
  externalUrl
  instagramUsername
  isEditable
  mediumUsername
  slug
  telegramUrl
  twitterUsername
  relayId
  ...collection_url
}

fragment Toolbar_asset on AssetType {
  ...asset_url
  ...itemEvents_data
  assetContract {
    address
    chain
    id
  }
  collection {
    externalUrl
    name
    slug
    id
  }
  externalLink
  name
  relayId
  tokenId
}

fragment TradeStation_archetype_3wquQ2 on ArchetypeType {
  ...BidModalContent_archetype_3wquQ2
}

fragment TradeStation_data on TradeSummaryType {
  bestAsk {
    isFulfillable
    closedAt
    dutchAuctionFinalPrice
    openedAt
    orderType
    priceFnEndedAt
    englishAuctionReservePrice
    relayId
    maker {
      ...wallet_accountKey
      id
    }
    makerAssetBundle {
      assetQuantities(first: 30) {
        edges {
          node {
            asset {
              relayId
              assetContract {
                chain
                id
              }
              collection {
                slug
                ...verification_data
                id
              }
              ...itemEvents_data
              id
            }
            ...quantity_data
            id
          }
        }
      }
      id
    }
    taker {
      ...wallet_accountKey
      id
    }
    takerAssetBundle {
      assetQuantities(first: 1) {
        edges {
          node {
            quantity
            asset {
              symbol
              decimals
              relayId
              usdSpotPrice
              id
            }
            ...AssetQuantity_data
            id
          }
        }
      }
      id
    }
    ...AskPrice_data
    ...orderLink_data
    ...quantity_remaining
    id
  }
  bestBid {
    makerAssetBundle {
      assetQuantities(first: 1) {
        edges {
          node {
            quantity
            ...AssetQuantity_data
            id
          }
        }
      }
      id
    }
    id
  }
  ...BidModalContent_trade
}

fragment accounts_url on AccountType {
  address
  user {
    publicUsername
    id
  }
}

fragment assetInputType on AssetType {
  tokenId
  assetContract {
    address
    chain
    id
  }
}

fragment asset_url on AssetType {
  assetContract {
    address
    chain
    id
  }
  tokenId
}

fragment collection_url on CollectionType {
  slug
}

fragment itemEvents_data on AssetType {
  assetContract {
    address
    chain
    id
  }
  tokenId
}

fragment orderLink_data on OrderV2Type {
  makerAssetBundle {
    assetQuantities(first: 30) {
      edges {
        node {
          asset {
            externalLink
            collection {
              externalUrl
              id
            }
            id
          }
          id
        }
      }
    }
    id
  }
}

fragment quantity_data on AssetQuantityType {
  asset {
    decimals
    id
  }
  quantity
}

fragment quantity_remaining on OrderV2Type {
  makerAsset: makerAssetBundle {
    assetQuantities(first: 1) {
      edges {
        node {
          asset {
            decimals
            id
          }
          quantity
          id
        }
      }
    }
    id
  }
  takerAsset: takerAssetBundle {
    assetQuantities(first: 1) {
      edges {
        node {
          asset {
            decimals
            id
          }
          quantity
          id
        }
      }
    }
    id
  }
  remainingQuantity
  side
}

fragment verification_data on CollectionType {
  isMintable
  isSafelisted
  isVerified
}

fragment wallet_accountKey on AccountType {
  address
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "archetype"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "chain"
  }
],
v1 = {
  "kind": "Variable",
  "name": "archetype",
  "variableName": "archetype"
},
v2 = [
  (v1/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "blockExplorerLink",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v8 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "AccountLink_data"
  }
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "animationUrl",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v12 = {
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
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hidden",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMintable",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSafelisted",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isVerified",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numVisitors",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDelisted",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isListable",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relayId",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tokenId",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasUnlockableContent",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "favoritesCount",
  "storageKey": null
},
v28 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayType",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "floatValue",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "intValue",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "traitType",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetContractType",
  "kind": "LinkedField",
  "name": "assetContract",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/)
  ],
  "storageKey": null
},
v35 = [
  (v34/*: any*/),
  (v25/*: any*/)
],
v36 = {
  "kind": "Literal",
  "name": "identity",
  "value": {}
},
v37 = {
  "alias": null,
  "args": [
    (v36/*: any*/)
  ],
  "kind": "ScalarField",
  "name": "ownedQuantity",
  "storageKey": "ownedQuantity(identity:{})"
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ownershipCount",
  "storageKey": null
},
v39 = {
  "kind": "Variable",
  "name": "chain",
  "variableName": "chain"
},
v40 = [
  (v39/*: any*/),
  (v36/*: any*/)
],
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "closedAt",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderType",
  "storageKey": null
},
v43 = [
  (v1/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 11
  }
],
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v45 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "UserType",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "publicUsername",
        "storageKey": null
      },
      (v44/*: any*/)
    ],
    "storageKey": null
  },
  (v14/*: any*/),
  (v44/*: any*/)
],
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalUrl",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "usdSpotPrice",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalLink",
  "storageKey": null
},
v50 = [
  (v3/*: any*/),
  (v44/*: any*/)
],
v51 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetContractType",
  "kind": "LinkedField",
  "name": "assetContract",
  "plural": false,
  "selections": [
    (v5/*: any*/),
    (v4/*: any*/),
    (v44/*: any*/)
  ],
  "storageKey": null
},
v52 = [
  {
    "alias": null,
    "args": (v6/*: any*/),
    "concreteType": "AssetQuantityTypeConnection",
    "kind": "LinkedField",
    "name": "assetQuantities",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AssetQuantityTypeEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AssetQuantityType",
            "kind": "LinkedField",
            "name": "node",
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
                  (v20/*: any*/),
                  (v44/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/),
              (v44/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "assetQuantities(first:1)"
  },
  (v44/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "itemQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ArchetypeType",
        "kind": "LinkedField",
        "name": "archetype",
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": "AssetOwnershipTypeConnection",
                "kind": "LinkedField",
                "name": "assetOwners",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AssetOwnershipTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetOwnershipType",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AccountType",
                            "kind": "LinkedField",
                            "name": "owner",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetOwners(first:1)"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "creator",
                "plural": false,
                "selections": (v8/*: any*/),
                "storageKey": null
              },
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "CollectionType",
                "kind": "LinkedField",
                "name": "collection",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "CollectionLink_collection"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "Boost_collection"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "Property_collection"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "NumericTrait_collection"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "SocialBar_data"
                  },
                  {
                    "kind": "InlineDataFragmentSpread",
                    "name": "verification_data",
                    "selections": [
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/)
                    ]
                  }
                ],
                "storageKey": null
              },
              (v20/*: any*/),
              (v11/*: any*/),
              (v14/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              (v23/*: any*/),
              (v15/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              (v27/*: any*/),
              {
                "alias": null,
                "args": (v28/*: any*/),
                "concreteType": "TraitTypeConnection",
                "kind": "LinkedField",
                "name": "traits",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TraitTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "TraitType",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v24/*: any*/),
                          (v29/*: any*/),
                          (v30/*: any*/),
                          (v31/*: any*/),
                          (v32/*: any*/),
                          (v33/*: any*/),
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "Boost_trait"
                          },
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "Property_trait"
                          },
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "NumericTrait_trait"
                          },
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "Date_trait"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "traits(first:100)"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AssetCardHeader_data"
              },
              {
                "kind": "InlineDataFragmentSpread",
                "name": "assetInputType",
                "selections": [
                  (v25/*: any*/),
                  (v34/*: any*/)
                ]
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AssetMedia_asset"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "EnsManualEntryModal_asset"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "Toolbar_asset"
              },
              {
                "kind": "InlineDataFragmentSpread",
                "name": "asset_url",
                "selections": (v35/*: any*/)
              },
              {
                "kind": "InlineDataFragmentSpread",
                "name": "itemEvents_data",
                "selections": (v35/*: any*/)
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ChainInfo_data"
              }
            ],
            "storageKey": null
          },
          (v37/*: any*/),
          (v38/*: any*/),
          (v7/*: any*/),
          {
            "args": (v40/*: any*/),
            "kind": "FragmentSpread",
            "name": "TradeStation_archetype"
          },
          {
            "args": (v40/*: any*/),
            "kind": "FragmentSpread",
            "name": "BidModalContent_archetype"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "TradeSummaryType",
        "kind": "LinkedField",
        "name": "tradeSummary",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrderV2Type",
            "kind": "LinkedField",
            "name": "bestAsk",
            "plural": false,
            "selections": [
              (v41/*: any*/),
              (v42/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "maker",
                "plural": false,
                "selections": [
                  {
                    "kind": "InlineDataFragmentSpread",
                    "name": "wallet_accountKey",
                    "selections": [
                      (v3/*: any*/)
                    ]
                  }
                ],
                "storageKey": null
              },
              (v24/*: any*/)
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "BidModalContent_trade"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TradeStation_data"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v43/*: any*/),
        "concreteType": "AssetEventTypeConnection",
        "kind": "LinkedField",
        "name": "assetEvents",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AssetEventTypeEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetEventType",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v24/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "itemQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ArchetypeType",
        "kind": "LinkedField",
        "name": "archetype",
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
              (v24/*: any*/),
              (v27/*: any*/),
              (v22/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isFavorite",
                "storageKey": null
              },
              (v25/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetContractType",
                "kind": "LinkedField",
                "name": "assetContract",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v44/*: any*/),
                  (v5/*: any*/),
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
                "args": (v6/*: any*/),
                "concreteType": "AssetOwnershipTypeConnection",
                "kind": "LinkedField",
                "name": "assetOwners",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AssetOwnershipTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetOwnershipType",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AccountType",
                            "kind": "LinkedField",
                            "name": "owner",
                            "plural": false,
                            "selections": (v45/*: any*/),
                            "storageKey": null
                          },
                          (v44/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "assetOwners(first:1)"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "creator",
                "plural": false,
                "selections": (v45/*: any*/),
                "storageKey": null
              },
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "CollectionType",
                "kind": "LinkedField",
                "name": "collection",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "NumericTraitTypePair",
                    "kind": "LinkedField",
                    "name": "numericTraits",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "key",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "NumericTraitType",
                        "kind": "LinkedField",
                        "name": "value",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "max",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "min",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CollectionStatsType",
                    "kind": "LinkedField",
                    "name": "stats",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "totalSupply",
                        "storageKey": null
                      },
                      (v44/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "discordUrl",
                    "storageKey": null
                  },
                  (v46/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "instagramUsername",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isEditable",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "mediumUsername",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "telegramUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "twitterUsername",
                    "storageKey": null
                  },
                  (v24/*: any*/),
                  (v44/*: any*/),
                  {
                    "alias": null,
                    "args": [
                      (v39/*: any*/)
                    ],
                    "concreteType": "PaymentAssetType",
                    "kind": "LinkedField",
                    "name": "paymentAssets",
                    "plural": true,
                    "selections": [
                      (v24/*: any*/),
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
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v44/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v20/*: any*/),
                          (v47/*: any*/),
                          (v48/*: any*/),
                          (v24/*: any*/),
                          (v44/*: any*/),
                          (v14/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v44/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v20/*: any*/),
              (v11/*: any*/),
              (v14/*: any*/),
              (v21/*: any*/),
              (v23/*: any*/),
              (v15/*: any*/),
              (v26/*: any*/),
              {
                "alias": null,
                "args": (v28/*: any*/),
                "concreteType": "TraitTypeConnection",
                "kind": "LinkedField",
                "name": "traits",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TraitTypeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "TraitType",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v24/*: any*/),
                          (v29/*: any*/),
                          (v30/*: any*/),
                          (v31/*: any*/),
                          (v32/*: any*/),
                          (v33/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "traitCount",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "maxValue",
                            "storageKey": null
                          },
                          (v44/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "traits(first:100)"
              },
              (v49/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "AbleToType",
                "kind": "LinkedField",
                "name": "isEditableByOwner",
                "plural": false,
                "selections": [
                  (v33/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isFrozen",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "frozenAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "tokenMetadata",
                "storageKey": null
              },
              (v44/*: any*/)
            ],
            "storageKey": null
          },
          (v37/*: any*/),
          (v38/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "TradeSummaryType",
        "kind": "LinkedField",
        "name": "tradeSummary",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrderV2Type",
            "kind": "LinkedField",
            "name": "bestAsk",
            "plural": false,
            "selections": [
              (v41/*: any*/),
              (v42/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "maker",
                "plural": false,
                "selections": (v50/*: any*/),
                "storageKey": null
              },
              (v24/*: any*/),
              (v44/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isFulfillable",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "oldOrder",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetBundleType",
                "kind": "LinkedField",
                "name": "makerAssetBundle",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 30
                      }
                    ],
                    "concreteType": "AssetQuantityTypeConnection",
                    "kind": "LinkedField",
                    "name": "assetQuantities",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetQuantityTypeEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetQuantityType",
                            "kind": "LinkedField",
                            "name": "node",
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
                                    "concreteType": "CollectionType",
                                    "kind": "LinkedField",
                                    "name": "collection",
                                    "plural": false,
                                    "selections": [
                                      (v17/*: any*/),
                                      (v18/*: any*/),
                                      (v19/*: any*/),
                                      (v44/*: any*/),
                                      (v16/*: any*/),
                                      (v46/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v44/*: any*/),
                                  (v24/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "AssetContractType",
                                    "kind": "LinkedField",
                                    "name": "assetContract",
                                    "plural": false,
                                    "selections": [
                                      (v4/*: any*/),
                                      (v44/*: any*/),
                                      (v3/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v25/*: any*/),
                                  (v20/*: any*/),
                                  (v49/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v44/*: any*/),
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "assetQuantities(first:30)"
                  },
                  (v44/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetBundleType",
                "kind": "LinkedField",
                "name": "takerAssetBundle",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "concreteType": "AssetQuantityTypeConnection",
                    "kind": "LinkedField",
                    "name": "assetQuantities",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetQuantityTypeEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetQuantityType",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AssetType",
                                "kind": "LinkedField",
                                "name": "asset",
                                "plural": false,
                                "selections": [
                                  (v20/*: any*/),
                                  (v24/*: any*/),
                                  (v44/*: any*/),
                                  (v47/*: any*/),
                                  (v48/*: any*/),
                                  (v14/*: any*/),
                                  (v51/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v44/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "assetQuantities(first:1)"
                  },
                  (v44/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "dutchAuctionFinalPrice",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "openedAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "priceFnEndedAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "englishAuctionReservePrice",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AccountType",
                "kind": "LinkedField",
                "name": "taker",
                "plural": false,
                "selections": (v50/*: any*/),
                "storageKey": null
              },
              {
                "alias": "makerAsset",
                "args": null,
                "concreteType": "AssetBundleType",
                "kind": "LinkedField",
                "name": "makerAssetBundle",
                "plural": false,
                "selections": (v52/*: any*/),
                "storageKey": null
              },
              {
                "alias": "takerAsset",
                "args": null,
                "concreteType": "AssetBundleType",
                "kind": "LinkedField",
                "name": "takerAssetBundle",
                "plural": false,
                "selections": (v52/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "remainingQuantity",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "side",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "OrderV2Type",
            "kind": "LinkedField",
            "name": "bestBid",
            "plural": false,
            "selections": [
              (v24/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetBundleType",
                "kind": "LinkedField",
                "name": "makerAssetBundle",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "concreteType": "AssetQuantityTypeConnection",
                    "kind": "LinkedField",
                    "name": "assetQuantities",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetQuantityTypeEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AssetQuantityType",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AssetType",
                                "kind": "LinkedField",
                                "name": "asset",
                                "plural": false,
                                "selections": [
                                  (v20/*: any*/),
                                  (v44/*: any*/),
                                  (v14/*: any*/),
                                  (v47/*: any*/),
                                  (v48/*: any*/),
                                  (v51/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v44/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "assetQuantities(first:1)"
                  },
                  (v44/*: any*/)
                ],
                "storageKey": null
              },
              (v44/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v43/*: any*/),
        "concreteType": "AssetEventTypeConnection",
        "kind": "LinkedField",
        "name": "assetEvents",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AssetEventTypeEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetEventType",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v24/*: any*/),
                  (v44/*: any*/)
                ],
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
    "cacheID": "e03a3e5d98a4212f59d2f774b421b0b8",
    "id": null,
    "metadata": {},
    "name": "itemQuery",
    "operationKind": "query",
    "text": "query itemQuery(\n  $archetype: ArchetypeInputType!\n  $chain: ChainScalar\n) {\n  archetype(archetype: $archetype) {\n    asset {\n      ...AssetCardHeader_data\n      ...assetInputType\n      assetContract {\n        address\n        chain\n        blockExplorerLink\n        id\n      }\n      assetOwners(first: 1) {\n        edges {\n          node {\n            quantity\n            owner {\n              ...AccountLink_data\n              id\n            }\n            id\n          }\n        }\n      }\n      creator {\n        ...AccountLink_data\n        id\n      }\n      animationUrl\n      backgroundColor\n      collection {\n        description\n        displayData {\n          cardDisplayStyle\n        }\n        hidden\n        imageUrl\n        name\n        slug\n        ...CollectionLink_collection\n        ...Boost_collection\n        ...Property_collection\n        ...NumericTrait_collection\n        ...SocialBar_data\n        ...verification_data\n        id\n      }\n      decimals\n      description\n      imageUrl\n      numVisitors\n      isDelisted\n      isListable\n      name\n      relayId\n      tokenId\n      hasUnlockableContent\n      favoritesCount\n      traits(first: 100) {\n        edges {\n          node {\n            relayId\n            displayType\n            floatValue\n            intValue\n            traitType\n            value\n            ...Boost_trait\n            ...Property_trait\n            ...NumericTrait_trait\n            ...Date_trait\n            id\n          }\n        }\n      }\n      ...AssetMedia_asset\n      ...EnsManualEntryModal_asset\n      ...Toolbar_asset\n      ...asset_url\n      ...itemEvents_data\n      ...ChainInfo_data\n      id\n    }\n    ownedQuantity(identity: {})\n    ownershipCount\n    quantity\n    ...TradeStation_archetype_3wquQ2\n    ...BidModalContent_archetype_3wquQ2\n  }\n  tradeSummary(archetype: $archetype) {\n    bestAsk {\n      closedAt\n      orderType\n      maker {\n        ...wallet_accountKey\n        id\n      }\n      relayId\n      id\n    }\n    ...BidModalContent_trade\n    ...TradeStation_data\n  }\n  assetEvents(archetype: $archetype, first: 11) {\n    edges {\n      node {\n        relayId\n        id\n      }\n    }\n  }\n}\n\nfragment AccountLink_data on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n  ...ProfileImage_data\n  ...wallet_accountKey\n  ...accounts_url\n}\n\nfragment AskPrice_data on OrderV2Type {\n  dutchAuctionFinalPrice\n  openedAt\n  priceFnEndedAt\n  makerAssetBundle {\n    assetQuantities(first: 30) {\n      edges {\n        node {\n          ...quantity_data\n          id\n        }\n      }\n    }\n    id\n  }\n  takerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          ...AssetQuantity_data\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment AssetCardHeader_data on AssetType {\n  relayId\n  favoritesCount\n  isDelisted\n  isFavorite\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    description\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    hidden\n    name\n    slug\n    id\n  }\n  description\n  name\n  tokenId\n  imageUrl\n  isDelisted\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment BidModalContent_archetype_3wquQ2 on ArchetypeType {\n  asset {\n    assetContract {\n      address\n      chain\n      id\n    }\n    decimals\n    relayId\n    collection {\n      slug\n      paymentAssets(chain: $chain) {\n        relayId\n        asset {\n          assetContract {\n            address\n            chain\n            id\n          }\n          decimals\n          symbol\n          usdSpotPrice\n          relayId\n          id\n        }\n        ...PaymentTokenInputV2_data\n        id\n      }\n      ...verification_data\n      id\n    }\n    id\n  }\n  quantity\n  ownedQuantity(identity: {})\n}\n\nfragment BidModalContent_trade on TradeSummaryType {\n  bestAsk {\n    closedAt\n    isFulfillable\n    oldOrder\n    orderType\n    relayId\n    makerAssetBundle {\n      assetQuantities(first: 30) {\n        edges {\n          node {\n            asset {\n              collection {\n                ...verification_data\n                id\n              }\n              id\n            }\n            id\n          }\n        }\n      }\n      id\n    }\n    takerAssetBundle {\n      assetQuantities(first: 1) {\n        edges {\n          node {\n            quantity\n            asset {\n              decimals\n              relayId\n              id\n            }\n            id\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n  bestBid {\n    relayId\n    makerAssetBundle {\n      assetQuantities(first: 1) {\n        edges {\n          node {\n            quantity\n            asset {\n              decimals\n              id\n            }\n            ...AssetQuantity_data\n            id\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment Boost_collection on CollectionType {\n  numericTraits {\n    key\n    value {\n      max\n      min\n    }\n  }\n  slug\n}\n\nfragment Boost_trait on TraitType {\n  displayType\n  floatValue\n  intValue\n  traitType\n}\n\nfragment ChainInfo_data on AssetType {\n  assetContract {\n    openseaVersion\n    address\n    chain\n    blockExplorerLink\n    id\n  }\n  isEditableByOwner {\n    value\n  }\n  tokenId\n  isFrozen\n  frozenAt\n  tokenMetadata\n}\n\nfragment CollectionLink_collection on CollectionType {\n  slug\n  name\n  ...verification_data\n}\n\nfragment Date_trait on TraitType {\n  traitType\n  floatValue\n  intValue\n}\n\nfragment EnsManualEntryModal_asset on AssetType {\n  assetContract {\n    address\n    id\n  }\n  tokenId\n}\n\nfragment NumericTrait_collection on CollectionType {\n  numericTraits {\n    key\n    value {\n      max\n      min\n    }\n  }\n  slug\n}\n\nfragment NumericTrait_trait on TraitType {\n  displayType\n  floatValue\n  intValue\n  maxValue\n  traitType\n}\n\nfragment PaymentAsset_data on PaymentAssetType {\n  asset {\n    assetContract {\n      chain\n      id\n    }\n    imageUrl\n    symbol\n    id\n  }\n}\n\nfragment PaymentTokenInputV2_data on PaymentAssetType {\n  relayId\n  asset {\n    decimals\n    symbol\n    usdSpotPrice\n    id\n  }\n  ...PaymentAsset_data\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n  address\n}\n\nfragment Property_collection on CollectionType {\n  slug\n  stats {\n    totalSupply\n    id\n  }\n}\n\nfragment Property_trait on TraitType {\n  displayType\n  traitCount\n  traitType\n  value\n}\n\nfragment SocialBar_data on CollectionType {\n  discordUrl\n  externalUrl\n  instagramUsername\n  isEditable\n  mediumUsername\n  slug\n  telegramUrl\n  twitterUsername\n  relayId\n  ...collection_url\n}\n\nfragment Toolbar_asset on AssetType {\n  ...asset_url\n  ...itemEvents_data\n  assetContract {\n    address\n    chain\n    id\n  }\n  collection {\n    externalUrl\n    name\n    slug\n    id\n  }\n  externalLink\n  name\n  relayId\n  tokenId\n}\n\nfragment TradeStation_archetype_3wquQ2 on ArchetypeType {\n  ...BidModalContent_archetype_3wquQ2\n}\n\nfragment TradeStation_data on TradeSummaryType {\n  bestAsk {\n    isFulfillable\n    closedAt\n    dutchAuctionFinalPrice\n    openedAt\n    orderType\n    priceFnEndedAt\n    englishAuctionReservePrice\n    relayId\n    maker {\n      ...wallet_accountKey\n      id\n    }\n    makerAssetBundle {\n      assetQuantities(first: 30) {\n        edges {\n          node {\n            asset {\n              relayId\n              assetContract {\n                chain\n                id\n              }\n              collection {\n                slug\n                ...verification_data\n                id\n              }\n              ...itemEvents_data\n              id\n            }\n            ...quantity_data\n            id\n          }\n        }\n      }\n      id\n    }\n    taker {\n      ...wallet_accountKey\n      id\n    }\n    takerAssetBundle {\n      assetQuantities(first: 1) {\n        edges {\n          node {\n            quantity\n            asset {\n              symbol\n              decimals\n              relayId\n              usdSpotPrice\n              id\n            }\n            ...AssetQuantity_data\n            id\n          }\n        }\n      }\n      id\n    }\n    ...AskPrice_data\n    ...orderLink_data\n    ...quantity_remaining\n    id\n  }\n  bestBid {\n    makerAssetBundle {\n      assetQuantities(first: 1) {\n        edges {\n          node {\n            quantity\n            ...AssetQuantity_data\n            id\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n  ...BidModalContent_trade\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment assetInputType on AssetType {\n  tokenId\n  assetContract {\n    address\n    chain\n    id\n  }\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment collection_url on CollectionType {\n  slug\n}\n\nfragment itemEvents_data on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment orderLink_data on OrderV2Type {\n  makerAssetBundle {\n    assetQuantities(first: 30) {\n      edges {\n        node {\n          asset {\n            externalLink\n            collection {\n              externalUrl\n              id\n            }\n            id\n          }\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment quantity_data on AssetQuantityType {\n  asset {\n    decimals\n    id\n  }\n  quantity\n}\n\nfragment quantity_remaining on OrderV2Type {\n  makerAsset: makerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          asset {\n            decimals\n            id\n          }\n          quantity\n          id\n        }\n      }\n    }\n    id\n  }\n  takerAsset: takerAssetBundle {\n    assetQuantities(first: 1) {\n      edges {\n        node {\n          asset {\n            decimals\n            id\n          }\n          quantity\n          id\n        }\n      }\n    }\n    id\n  }\n  remainingQuantity\n  side\n}\n\nfragment verification_data on CollectionType {\n  isMintable\n  isSafelisted\n  isVerified\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n}\n"
  }
};
})();
(node as any).hash = '2e486abc6f3538061cdee133d4eff34d';
export default node;
