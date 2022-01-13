import React from "react"
import Modal from "../../design-system/Modal"
import {
  withMultiStepFlowContext,
  MultiStepContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import { CancelOrderActionModalQuery } from "../../lib/graphql/__generated__/CancelOrderActionModalQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import ActionButton from "../common/ActionButton.react"
import ModalLoader from "../common/ModalLoader.react"
import ActionPanelList from "./ActionPanelList.react"

type BaseProps = {
  onOrderCancelled?: () => unknown
  onClose: () => unknown
}

type Props = BaseProps & MultiStepContext

interface State {
  isConfirmed?: boolean
}

class CancelOrderActionModal extends GraphQLComponent<
  CancelOrderActionModalQuery,
  Props,
  State
> {
  state: State = {}

  render() {
    const { data, onPrevious } = this.props

    if (!data || !data.order) {
      return <ModalLoader />
    }

    const { isConfirmed } = this.state

    const { cancelActions, orderType, side } = data.order

    const isEnglish = orderType === "ENGLISH"
    const offerTerm = side === "ASK" ? "listing" : isEnglish ? "bid" : "offer"

    return (
      <>
        {!isConfirmed ? (
          <>
            <Modal.Header onPrevious={onPrevious}>
              <Modal.Title>
                Are you sure you want to cancel your {offerTerm}?
              </Modal.Title>
            </Modal.Header>

            <Modal.Footer>
              <ActionButton
                onClick={() => {
                  this.setState({ isConfirmed: true })
                }}
              >
                Confirm
              </ActionButton>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header
              onPrevious={() => this.setState({ isConfirmed: false })}
            >
              <Modal.Title>Cancel your {offerTerm}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <ActionPanelList
                data={cancelActions}
                onEnd={() => this.onOrderCancelled(offerTerm)}
              />
            </Modal.Body>
          </>
        )}
      </>
    )
  }

  onOrderCancelled = (offerTerm: string) => {
    const { onOrderCancelled, onClose } = this.props

    const successMessage = `Your ${offerTerm} was cancelled successfully!`

    onClose()
    this.showSuccessMessage(successMessage)

    onOrderCancelled?.()
  }
}

export default withData<CancelOrderActionModalQuery, BaseProps>(
  withMultiStepFlowContext(CancelOrderActionModal),
  graphql`
    query CancelOrderActionModalQuery(
      $orderId: OrderRelayID!
      $maker: IdentityInputType!
    ) {
      order(order: $orderId) {
        cancelActions(maker: $maker) {
          ...ActionPanelList_data
        }
        side
        orderType
      }
    }
  `,
)
