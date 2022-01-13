import { FragmentRefs } from "relay-runtime"
import { verification_data } from "../graphql/__generated__/verification_data.graphql"
import { Connection, getNodes, graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"

export type VerificationStatus =
  | "verified"
  | "safelisted"
  | "mintable"
  | "unapproved"

export const readCollectionVerificationStatus = inlineFragmentize<
  verification_data,
  VerificationStatus
>(
  graphql`
    fragment verification_data on CollectionType @inline {
      isMintable
      isSafelisted
      isVerified
    }
  `,
  ({ isMintable, isVerified, isSafelisted }) =>
    isMintable
      ? "mintable"
      : isVerified
      ? "verified"
      : isSafelisted
      ? "safelisted"
      : "unapproved",
)

type VerificationStatusAssetQuantities = {
  readonly asset: {
    readonly collection: {
      readonly " $fragmentRefs": FragmentRefs<"verification_data">
    }
  }
}

export const readVerificationStatus = (
  assetQuantities: Connection<VerificationStatusAssetQuantities>,
) => {
  const allAssetQuantities = getNodes(assetQuantities)
  return allAssetQuantities.reduce((bundleStatus, assetQuantity) => {
    const itemStatus = readCollectionVerificationStatus(
      assetQuantity.asset.collection,
    )
    if (
      (bundleStatus === "verified" && itemStatus !== "verified") ||
      (bundleStatus === "safelisted" &&
        (itemStatus === "mintable" || itemStatus === "unapproved")) ||
      (bundleStatus === "mintable" && itemStatus === "unapproved")
    ) {
      return itemStatus
    }
    return bundleStatus
  }, "verified")
}
