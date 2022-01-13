import React from "react"
import BigNumber from "bignumber.js"
import styled from "styled-components"
import { MOONPAY_API_CHECK_IP_URL } from "../../constants"
import Flex from "../../design-system/Flex"
import FlexVertical from "../../design-system/FlexVertical"
import Modal from "../../design-system/Modal"
import { useMultiStepFlowContext } from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import useAppContext from "../../hooks/useAppContext"
import { AddFundsModalQuery } from "../../lib/graphql/__generated__/AddFundsModalQuery.graphql"
import { graphql, LoadedGraphQLProps } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { isMultichain } from "../../lib/helpers/chainUtils"
import UniswapStationModal from "../auctions/UniswapStationModal.react"
import ActionButton from "../common/ActionButton.react"
import ModalLoader from "../common/ModalLoader.react"
import DepositModal from "./DepositModal.react"
import MoonPayModal from "./MoonPayModal"
import { MoonPayApiCheckIpResponse } from "./MoonPayModal/types"

interface State {
  isMoonPayAllowed: boolean
  isFetching: boolean
}

interface Props {
  fundsToAdd?: BigNumber
  onClose?: () => unknown
  onFundsAdded?: () => unknown
  assetId?: string
  orderId?: string
}

const AddFundsModalContent = ({
  fundsToAdd,
  onFundsAdded,
  onClose,
  variables,
  data,
  isMoonPayAllowed,
  assetId,
  orderId,
}: Props &
  LoadedGraphQLProps<AddFundsModalQuery> & { isMoonPayAllowed: boolean }) => {
  const { wallet } = useAppContext()
  const { onPrevious, onNext } = useMultiStepFlowContext()
  const viewer = wallet.getActiveAccountKey()
  if (!viewer) {
    return <></>
  }
  const { symbol, chain } = variables
  const tokenAddress = data.paymentAsset?.asset.assetContract.address
  const blockExplorerLink =
    data.paymentAsset?.asset.assetContract.blockExplorerLink

  if (!isMultichain(chain) && symbol === "WETH") {
    return (
      <UniswapStationModal
        tokenAddress={symbol ? tokenAddress : undefined}
        tokenAmount={fundsToAdd}
        tokenInfoLink={blockExplorerLink}
        tokenSymbol={symbol}
      />
    )
  }

  return (
    <>
      <Modal.Header onPrevious={onPrevious}>
        <Modal.Title>
          Add {!symbol ? "crypto" : symbol} to your wallet
        </Modal.Title>
      </Modal.Header>

      <StyledBody>
        <Text textAlign="center" variant="small">
          Select one of the options to deposit {!symbol ? "crypto" : symbol} to
          your wallet
        </Text>
        <FlexVertical>
          <Flex justifyContent="center">
            <ActionButton
              className="AddFundsModal--button "
              icon="insert_chart"
              type="tertiary"
              onClick={() =>
                onNext(
                  <DepositModal
                    address={viewer.address}
                    symbol={symbol}
                    onClose={onClose}
                  />,
                )
              }
            >
              Deposit from an exchange
            </ActionButton>
          </Flex>
          {symbol !== "ETH" && !isMultichain(chain) ? (
            <Flex justifyContent="center" marginTop="16px">
              <ActionButton
                className="AddFundsModal--button "
                icon="swap_vert"
                type="tertiary"
                onClick={() =>
                  onNext(
                    <UniswapStationModal
                      tokenAddress={symbol ? tokenAddress : undefined}
                      tokenAmount={fundsToAdd}
                      tokenInfoLink={blockExplorerLink}
                      tokenSymbol={symbol}
                    />,
                  )
                }
              >
                Swap {!symbol ? "crypto" : `ETH to ${symbol}`}
              </ActionButton>
            </Flex>
          ) : null}
          {isMoonPayAllowed && (
            <Flex justifyContent="center" marginTop="16px">
              <ActionButton
                className="AddFundsModal--button"
                icon="credit_card"
                type="tertiary"
                onClick={() =>
                  onNext(
                    <MoonPayModal
                      chain={chain}
                      checkoutVariables={
                        assetId && orderId
                          ? {
                              asset: assetId,
                              orderId,
                              identity: {
                                address: viewer?.address,
                                chain,
                              },
                            }
                          : undefined
                      }
                      fiatValue={fundsToAdd?.toNumber()}
                      symbol={symbol}
                      onClose={onClose}
                      onDone={onFundsAdded}
                    />,
                  )
                }
              >
                Buy with card
              </ActionButton>
            </Flex>
          )}
        </FlexVertical>
      </StyledBody>
    </>
  )
}

class AddFundsModal extends GraphQLComponent<AddFundsModalQuery, Props, State> {
  state: State = {
    isMoonPayAllowed: false,
    isFetching: true,
  }

  async componentDidMount() {
    await this.getIsMoonPayAllowed()
    this.setState({ isFetching: false })
  }

  async getIsMoonPayAllowed() {
    try {
      const response = await fetch(MOONPAY_API_CHECK_IP_URL)
      const json: MoonPayApiCheckIpResponse = await response.json()
      this.setState({ isMoonPayAllowed: !!json?.isBuyAllowed })
    } catch (e) {
      throw new Error(e)
    }
  }

  render() {
    const { isFetching, isMoonPayAllowed } = this.state
    const { data, onFundsAdded, onClose, fundsToAdd, variables } = this.props
    if (!data || isFetching) {
      return <ModalLoader />
    }

    return (
      <AddFundsModalContent
        assetId={this.props.assetId}
        data={data}
        fundsToAdd={fundsToAdd}
        isMoonPayAllowed={isMoonPayAllowed}
        orderId={this.props.orderId}
        refetch={this.props.refetch}
        variables={variables}
        onClose={onClose}
        onFundsAdded={onFundsAdded}
      />
    )
  }
}

export default withData<AddFundsModalQuery, Props>(
  AddFundsModal,
  graphql`
    query AddFundsModalQuery($symbol: String!, $chain: ChainScalar) {
      paymentAsset(symbol: $symbol, chain: $chain) {
        asset {
          symbol
          assetContract {
            blockExplorerLink
            address
            chain
          }
        }
      }
    }
  `,
)

const StyledBody = styled(Modal.Body)`
  .AddFundsModal--button {
    font-size: 14px;
    width: 100%;
    max-width: 260px;

    > * {
      justify-content: left;
    }
  }
`
