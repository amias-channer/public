import React from "react"
import { ChainIdentifier } from "../../constants"
import Modal from "../../design-system/Modal"
import {
  MultiStepContext,
  withMultiStepFlowContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Tr from "../../i18n/Tr.react"
import { TransferModalContentQuery } from "../../lib/graphql/__generated__/TransferModalContentQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { bn } from "../../lib/helpers/numberUtils"
import { shouldUseMetaTransactions } from "../../lib/helpers/orders"
import ActionButton from "../common/ActionButton.react"
import ModalLoader from "../common/ModalLoader.react"
import AddressInput from "../forms/AddressInput.react"
import Label from "../forms/Label.react"
import NumericInput from "../forms/NumericInput.react"
import TransferActionsModalContent from "./TransferActionsModalContent.react"

interface State {
  addressInput: string
  quantity: string
  address?: string
}

type BaseProps = {
  chain?: ChainIdentifier
  children?: React.ReactNode
  shouldLinkToAsset?: boolean
}

type Props = BaseProps & MultiStepContext

class TransferModalContent extends GraphQLComponent<
  TransferModalContentQuery,
  Props,
  State
> {
  state: State = this.syncState(data => ({
    addressInput: "",
    quantity: data?.archetype?.ownedQuantity ? "1" : "",
  }))

  handleSubmit = async () => {
    const { address, quantity } = this.state
    const { wallet } = this.context
    const { data, shouldLinkToAsset, onNext } = this.props
    const asset = data?.archetype?.asset

    // TODO: prevent transferring to self
    const accountKey = wallet.getActiveAccountKey()
    const relayId = asset?.relayId
    if (address && accountKey && relayId) {
      onNext(
        <TransferActionsModalContent
          shouldLinkToAsset={shouldLinkToAsset}
          variables={{
            sender: accountKey.address,
            transferAssetInputs: [
              {
                assetQuantity: {
                  asset: relayId,
                  quantity: quantity,
                },
                recipient: address,
              },
            ],
            useMetaTransactions: shouldUseMetaTransactions({
              chain: asset?.chain.identifier,
              address: asset?.assetContract.address,
              slug: asset?.collection.slug,
            }),
          }}
        />,
      )
    }
  }

  render() {
    const { data } = this.props

    if (!data) {
      return <ModalLoader />
    }

    const asset = data.archetype?.asset
    const ownedQuantity = data.archetype?.ownedQuantity
    const quantityData = data.archetype?.quantity
    const decimals = asset?.decimals
    const { addressInput, address, quantity } = this.state
    const amount = quantityData ? bn(quantityData, decimals) : undefined
    const isFungible = amount ? amount.greaterThan(bn(1)) : false
    const owned = ownedQuantity ? bn(ownedQuantity, decimals) : undefined

    return (
      <>
        <Modal.Header>
          <Modal.Title>Transfer your item</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isFungible ? (
            <Label label="Quantity" subLabel={`${ownedQuantity} owned`}>
              <NumericInput
                inputValue={quantity}
                isRequired
                max={owned}
                maxDecimals={decimals ?? undefined}
                value={quantity}
                onChange={({ value }) =>
                  value !== undefined && this.setState({ quantity: value })
                }
              />
            </Label>
          ) : null}
          <Label label="Address">
            <AddressInput
              className="TransferModalContent--input"
              inputValue={addressInput}
              placeholder="e.g. 0x1ed3... or destination.eth"
              value={address}
              onChange={({ value, inputValue }) =>
                this.setState({
                  address: value,
                  addressInput: inputValue,
                })
              }
            />
          </Label>
        </Modal.Body>

        <Modal.Footer>
          <ActionButton
            isDisabled={!this.state.address}
            style={{ width: "300px" }}
            onClick={this.handleSubmit}
          >
            <Tr>Transfer</Tr>
          </ActionButton>
        </Modal.Footer>
      </>
    )
  }
}

export default withData<TransferModalContentQuery, BaseProps>(
  withMultiStepFlowContext(TransferModalContent),
  graphql`
    query TransferModalContentQuery($archetype: ArchetypeInputType!) {
      archetype(archetype: $archetype) {
        asset {
          assetContract {
            address
          }
          relayId
          decimals
          chain {
            identifier
          }
          collection {
            slug
          }
        }
        ownedQuantity(identity: {})
        quantity
      }
    }
  `,
)
