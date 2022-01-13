import BigNumber from "bignumber.js"
import { quantity_data } from "../graphql/__generated__/quantity_data.graphql"
import { quantity_remaining } from "../graphql/__generated__/quantity_remaining.graphql"
import { getFirstNode, graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"
import { bn } from "./numberUtils"

export const readQuantity = inlineFragmentize<quantity_data, BigNumber>(
  graphql`
    fragment quantity_data on AssetQuantityType @inline {
      asset {
        decimals
      }
      quantity
    }
  `,
  ({ asset: { decimals }, quantity }) => bn(quantity, decimals),
)

export const readRemainingQuantity = inlineFragmentize<
  quantity_remaining,
  BigNumber
>(
  graphql`
    fragment quantity_remaining on OrderV2Type @inline {
      makerAsset: makerAssetBundle {
        assetQuantities(first: 1) {
          edges {
            node {
              asset {
                decimals
              }
              quantity
            }
          }
        }
      }
      takerAsset: takerAssetBundle {
        assetQuantities(first: 1) {
          edges {
            node {
              asset {
                decimals
              }
              quantity
            }
          }
        }
      }
      remainingQuantity
      side
    }
  `,
  ({ makerAsset, takerAsset, remainingQuantity, side }) => {
    const assetQuantity =
      side === "ASK"
        ? getFirstNode(makerAsset.assetQuantities)
        : getFirstNode(takerAsset.assetQuantities)
    return bn(
      remainingQuantity ?? assetQuantity?.quantity ?? 0,
      assetQuantity?.asset.decimals,
    )
  },
)
