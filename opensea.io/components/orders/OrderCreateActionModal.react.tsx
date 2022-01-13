import React from "react"
import styled from "styled-components"
import Modal from "../../design-system/Modal"
import {
  MultiStepContext,
  withMultiStepFlowContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import { ActionTransaction } from "../../lib/chain/trader"
import { OrderCreateActionModalQuery } from "../../lib/graphql/__generated__/OrderCreateActionModalQuery.graphql"
import { graphql, GraphQLProps } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import ModalLoader from "../common/ModalLoader.react"
import ActionPanelList from "./ActionPanelList.react"

type BaseProps = {
  mode: "ask" | "bid"
  isEnglishAuction?: boolean
  onEnd?: (transaction?: ActionTransaction) => unknown
}

type Props = BaseProps & MultiStepContext

interface State {
  currentStep: number
}

class OrderCreateActionModal extends GraphQLComponent<
  OrderCreateActionModalQuery,
  Props,
  State
> {
  state: State = {
    currentStep: 1,
  }

  shouldComponentUpdate(
    nextProps: Props & GraphQLProps<OrderCreateActionModalQuery>,
  ) {
    return !!nextProps.data
  }

  render() {
    const { data, mode, isEnglishAuction, onEnd, onPrevious } = this.props
    const actions = data?.blockchain?.orderCreateActions

    if (!data || !actions) {
      return <ModalLoader />
    }

    const title = {
      ask: "Complete your listing",
      bid: isEnglishAuction ? "Place your bid" : "Make your offer",
    }[mode]

    const subtitle = `${
      {
        ask: "To complete your listing",
        bid: isEnglishAuction ? "To place your bid" : "To make your offer",
      }[mode]
    }, follow these steps:`

    return (
      <>
        <Modal.Header onPrevious={onPrevious}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <StyledBody>
          <Text className="OrderCreateActionModal--text">{subtitle}</Text>
          <ActionPanelList data={actions} onEnd={onEnd} />
        </StyledBody>
      </>
    )
  }
}

export default withData<OrderCreateActionModalQuery, BaseProps>(
  withMultiStepFlowContext(OrderCreateActionModal),
  graphql`
    query OrderCreateActionModalQuery(
      $maker: IdentityInputType!
      $makerAssetQuantities: [AssetQuantityInputType!]!
      $takerAssetQuantities: [AssetQuantityInputType!]!
      $expiration: Int
      $useMetaTransactions: Boolean
      $openedAt: DateTime
    ) {
      blockchain {
        orderCreateActions(
          maker: $maker
          makerAssets: $makerAssetQuantities
          takerAssets: $takerAssetQuantities
          expiration: $expiration
          useMetaTransactions: $useMetaTransactions
          openedAt: $openedAt
        ) {
          ...ActionPanelList_data
        }
      }
    }
  `,
)

const StyledBody = styled(Modal.Body)`
  .OrderCreateActionModal--text {
    color: ${props => props.theme.colors.text.subtle};
  }
`
