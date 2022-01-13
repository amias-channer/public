import React from "react"
import Modal from "../../design-system/Modal"
import {
  withMultiStepFlowContext,
  MultiStepContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import { TransferActionsModalContentQuery } from "../../lib/graphql/__generated__/TransferActionsModalContentQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { filter } from "../../lib/helpers/array"
import ModalLoader from "../common/ModalLoader.react"
import AssetSuccessModalContent from "../modals/AssetSuccessModalContent.react"
import ActionPanelList from "../orders/ActionPanelList.react"

type BaseProps = {
  shouldLinkToAsset?: boolean
}

type Props = BaseProps & MultiStepContext

class TransferActions extends GraphQLComponent<
  TransferActionsModalContentQuery,
  Props
> {
  render() {
    const {
      data,
      variables: { transferAssetInputs },
      shouldLinkToAsset,
      onReplace,
    } = this.props

    if (!data) {
      return <ModalLoader />
    }

    const assetIDs = filter(
      transferAssetInputs.map(assetInput => assetInput.assetQuantity?.asset),
    )

    return (
      <>
        <Modal.Header>
          <Modal.Title>{this.tr("Complete your listing")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Text variant="small">
            {this.tr("To complete your transfer, follow these steps")}
          </Text>
          <ActionPanelList
            data={data.blockchain.transferActions}
            onEnd={transaction =>
              transaction &&
              onReplace(
                <AssetSuccessModalContent
                  mode="transferred"
                  shouldLinkToAsset={shouldLinkToAsset}
                  transaction={transaction}
                  variables={{
                    assetIDs,
                  }}
                />,
              )
            }
          />
        </Modal.Body>
      </>
    )
  }
}

export default withData<TransferActionsModalContentQuery, BaseProps>(
  withMultiStepFlowContext(TransferActions),
  graphql`
    query TransferActionsModalContentQuery(
      $sender: AddressScalar!
      $transferAssetInputs: [TransferAssetInputType!]!
      $useMetaTransactions: Boolean
    ) {
      blockchain {
        transferActions(
          sender: $sender
          transferAssetInputs: $transferAssetInputs
          useMetaTransactions: $useMetaTransactions
        ) {
          ...ActionPanelList_data
        }
      }
    }
  `,
)
