import React from "react"
import AppComponent from "../../AppComponent.react"
import { CHAIN_IDENTIFIERS_TO_NAMES, ChainIdentifier } from "../../constants"
import Block from "../../design-system/Block"
import Modal from "../../design-system/Modal"
import Text from "../../design-system/Text"
import {
  Feature,
  MultiChainTradingGateMutation,
} from "../../lib/graphql/__generated__/MultiChainTradingGateMutation.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { shouldShowMultichainModal } from "../../lib/helpers/orders"
import { $sea_blue } from "../../styles/variables"
import ActionButton from "../common/ActionButton.react"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"
import EmailInput from "../forms/EmailInput.react"

const CHAIN_IDENTIFIER_TO_FEATURE: { [K in ChainIdentifier]?: Feature } = {
  MATIC: "MATIC_TRADING",
  MUMBAI: "MATIC_TRADING",
  BSC: "BSC_TRADING",
  BSC_TESTNET: "BSC_TRADING",
  KLAYTN: "KLAYTN_TRADING",
  BAOBAB: "KLAYTN_TRADING",
  XDAI: "XDAI_TRADING",
}

interface Props {
  chainIdentifier?: ChainIdentifier
  collectionSlug?: string
  isFungible?: boolean
}

interface State {
  email: string
  emailInput: string
  message: string
  subscribed: boolean
}

export default class MultiChainTradingGate extends AppComponent<Props> {
  state: State = { email: "", emailInput: "", message: "", subscribed: false }

  handleSubmit = async () => {
    const { chainIdentifier } = this.props
    const { email } = this.state
    const feature =
      chainIdentifier && CHAIN_IDENTIFIER_TO_FEATURE[chainIdentifier]
    // TODO: Pass feature directly into MultiChainTradingGate as a prop
    if (!feature) {
      throw new Error(
        `No feature corresponds to the chain identifier "${chainIdentifier}".`,
      )
    }

    if (email && chainIdentifier) {
      const { mutate } = this.context
      this.setState({ message: "Joining..." })
      try {
        await mutate<MultiChainTradingGateMutation>(
          graphql`
            mutation MultiChainTradingGateMutation(
              $feature: Feature!
              $email: String!
            ) {
              waitlist {
                join(feature: $feature, email: $email)
              }
            }
          `,
          {
            feature,
            email,
          },
        )
        this.setState({
          message: "You have been added to the waitlist",
          subscribed: true,
        })
      } catch (error) {
        this.setState({ message: error.message })
      }
    }
  }

  renderModal = () => {
    const { chainIdentifier } = this.props
    const { email, emailInput, message, subscribed } = this.state

    if (!chainIdentifier) {
      return null
    }

    const chainName = CHAIN_IDENTIFIERS_TO_NAMES[chainIdentifier]

    return (
      <>
        <Modal.Body>
          <Icon
            style={{ color: $sea_blue, fontSize: "94px" }}
            value="directions_boat"
          />

          <Text variant="h3">{chainName} trading coming soon!</Text>
          <Text>
            Enter your email below to get notified when trading for {chainName}{" "}
            assets is available.
          </Text>

          {chainIdentifier === "MATIC" && (
            <Text>
              If you'd like to experience an alpha trading experience, check out{" "}
              <Link href="https://matic.opensea.io">matic.opensea.io</Link>.
            </Text>
          )}

          <EmailInput
            className="MultiChainTradingGate--input"
            inputValue={emailInput}
            placeholder="boaty@mcboat.com"
            value={email}
            onChange={({ value, inputValue }) =>
              this.setState({
                email: value,
                emailInput: inputValue,
                message: "",
              })
            }
          />

          <Text>{message}</Text>
        </Modal.Body>

        <Modal.Footer>
          <ActionButton
            isDisabled={subscribed}
            type="primary"
            onClick={this.handleSubmit}
          >
            Keep Me Posted
          </ActionButton>
        </Modal.Footer>
      </>
    )
  }

  render() {
    const { chainIdentifier, children, collectionSlug, isFungible } = this.props

    const condition =
      chainIdentifier &&
      shouldShowMultichainModal(chainIdentifier, collectionSlug, isFungible)

    if (!condition) {
      return children
    }

    return (
      <Modal
        trigger={open => (
          <Block
            onClickCapture={event => {
              event.stopPropagation()
              event.preventDefault()
              open()
            }}
          >
            {children}
          </Block>
        )}
      >
        {this.renderModal}
      </Modal>
    )
  }
}
