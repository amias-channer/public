import { fetch, graphql } from "../../lib/graphql/graphql"
import { bn } from "../../lib/helpers/numberUtils"
import { swapActionsQuery } from "../graphql/__generated__/swapActionsQuery.graphql"

type SwapActionParams = {
  amount: string
  fromAsset: string
  toAsset: string
}

export const querySwapActions = async ({
  amount,
  fromAsset,
  toAsset,
}: SwapActionParams) => {
  const {
    blockchain: { swapActions },
  } = await fetch<swapActionsQuery>(
    graphql`
      query swapActionsQuery(
        $fromAssetQuantity: AssetQuantityInputType!
        $toAsset: AssetRelayID!
      ) {
        blockchain {
          swapActions(
            fromAssetQuantity: $fromAssetQuantity
            toAsset: $toAsset
          ) {
            actions {
              actionType
              transaction {
                ...trader_transaction
              }
              maticExit {
                rootChainManagerAddress
                chainIdentifier
              }
            }
            ...ActionPanelList_data
          }
        }
      }
    `,
    {
      fromAssetQuantity: {
        quantity: bn(amount, -18).toString(),
        asset: fromAsset,
      },
      toAsset: toAsset,
    },
  )

  return swapActions
}
