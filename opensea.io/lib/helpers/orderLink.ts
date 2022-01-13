import { orderLink_data } from "../graphql/__generated__/orderLink_data.graphql"
import { getFirstNode, graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"

export const readOrderLink = inlineFragmentize<
  orderLink_data,
  string | undefined
>(
  graphql`
    fragment orderLink_data on OrderV2Type @inline {
      makerAssetBundle {
        assetQuantities(first: 30) {
          edges {
            node {
              asset {
                externalLink
                collection {
                  externalUrl
                }
              }
            }
          }
        }
      }
    }
  `,
  ({ makerAssetBundle: { assetQuantities } }) => {
    const asset = getFirstNode(assetQuantities)?.asset
    return asset?.externalLink || asset?.collection.externalUrl || undefined
  },
)
