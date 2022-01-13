import { _FragmentRefs } from "relay-runtime"
import { CHAIN_IDENTIFIER_ENUM_MAPPING } from "../../constants"
import { asset_edit_url } from "../graphql/__generated__/asset_edit_url.graphql"
import { asset_url } from "../graphql/__generated__/asset_url.graphql"
import { assetInputType } from "../graphql/__generated__/assetInputType.graphql"
import { graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"
import { chainIdentifierWithTrailingSlash } from "./chainUtils"

const readAssetUrlIdentifier = inlineFragmentize<asset_url>(
  graphql`
    fragment asset_url on AssetType @inline {
      assetContract {
        address
        chain
      }
      tokenId
    }
  `,
  identifiers => identifiers,
)

export const getAssetUrl = (
  ref: asset_url | _FragmentRefs<"asset_url">,
  action?: "bid" | "sell" | "order" | "transfer" | "cancel",
) => {
  const {
    tokenId,
    assetContract: { address, chain },
  } = readAssetUrlIdentifier(ref)

  return `/assets/${
    chain !== "ETHEREUM" && chain !== "RINKEBY"
      ? `${CHAIN_IDENTIFIER_ENUM_MAPPING[chain]}/`
      : ""
  }${address}/${tokenId}/${action ? action : ""}`
}

const readAssetInputType = inlineFragmentize<assetInputType>(
  graphql`
    fragment assetInputType on AssetType @inline {
      tokenId
      assetContract {
        address
        chain
      }
      tokenId
    }
  `,
  identifiers => identifiers,
)

export const getAssetInputType = (
  ref: assetInputType | _FragmentRefs<"assetInputType">,
) => {
  const {
    assetContract: { address, chain },
    tokenId,
  } = readAssetInputType(ref)
  return { assetContractAddress: address, chain, tokenId }
}

const readAssetEditUrlIdentifier = inlineFragmentize<asset_edit_url>(
  graphql`
    fragment asset_edit_url on AssetType @inline {
      assetContract {
        address
        chain
      }
      tokenId
      collection {
        slug
      }
    }
  `,
  identifiers => identifiers,
)

export const getAssetEditUrl = (
  ref: asset_edit_url | _FragmentRefs<"asset_edit_url">,
) => {
  const {
    tokenId,
    assetContract: { address, chain },
    collection: { slug },
  } = readAssetEditUrlIdentifier(ref)
  return `/collection/${slug}/asset/${chainIdentifierWithTrailingSlash(
    chain,
  )}${address}/${tokenId}/edit`
}
