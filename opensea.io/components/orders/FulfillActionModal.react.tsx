import React from "react"
import { ChainIdentifier } from "../../constants"
import Modal from "../../design-system/Modal"
import {
  MultiStepContext,
  withMultiStepFlowContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import { FulfillActionModalQuery } from "../../lib/graphql/__generated__/FulfillActionModalQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import ModalLoader from "../common/ModalLoader.react"
import AssetSuccessModalContent from "../modals/AssetSuccessModalContent.react"
import ActionPanelList from "./ActionPanelList.react"

type BaseProps = {
  assetIDs: string[]
  chain: ChainIdentifier
}

type Props = BaseProps & MultiStepContext

class FulfillActionModal extends GraphQLComponent<
  FulfillActionModalQuery,
  Props
> {
  render() {
    const { data, onReplace, assetIDs, onPrevious, chain } = this.props

    if (!data || !data.order) {
      return <ModalLoader />
    }

    const { fulfillmentActions, side } = data.order
    const title = side === "ASK" ? "Complete checkout" : "Accept your offer"

    const subtitle = `${
      side === "ASK" ? "To complete your purchase" : "To accept your offer"
    }, follow these steps:`

    return (
      <>
        <Modal.Header onPrevious={onPrevious}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Text variant="small">{subtitle}</Text>
          <ActionPanelList
            chain={chain}
            data={fulfillmentActions}
            onEnd={transaction =>
              transaction &&
              onReplace(
                <AssetSuccessModalContent
                  mode={side === "ASK" ? "bought" : "sold"}
                  transaction={transaction}
                  variables={{ assetIDs }}
                />,
              )
            }
          />
        </Modal.Body>
      </>
    )
  }
}

export default withData<FulfillActionModalQuery, BaseProps>(
  withMultiStepFlowContext(FulfillActionModal),
  graphql`
    query FulfillActionModalQuery(
      $orderId: OrderRelayID!
      $taker: IdentityInputType!
      $takerAssetFillAmount: String!
      $useMetaTransactions: Boolean
    ) {
      order(order: $orderId) {
        side
        relayId
        fulfillmentActions(
          taker: $taker
          takerAssetFillAmount: $takerAssetFillAmount
          useMetaTransactions: $useMetaTransactions
        ) {
          ...ActionPanelList_data
        }
      }
    }
  `,
)
