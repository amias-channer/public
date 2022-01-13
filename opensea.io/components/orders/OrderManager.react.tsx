import React from "react"
import styled, { css } from "styled-components"
import ExchangeActions from "../../actions/exchange"
import TokenActions from "../../actions/tokens"
import Block from "../../design-system/Block"
import Modal from "../../design-system/Modal"
import MultiStepModal from "../../design-system/Modal/MultiStepModal.react"
import { OrderManagerQuery } from "../../lib/graphql/__generated__/OrderManagerQuery.graphql"
import { getNodes, graphql, GraphQLProps } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { first } from "../../lib/helpers/array"
import { chainIdentifierWithTrailingSlash } from "../../lib/helpers/chainUtils"
import { bn, display } from "../../lib/helpers/numberUtils"
import {
  isOrderV2Enabled,
  shouldShowMultichainModal,
} from "../../lib/helpers/orders"
import { pluralize } from "../../lib/helpers/stringUtils"
import { Asset } from "../../reducers/assets"
import { buildOrder } from "../../reducers/auctions"
import { Bundle } from "../../reducers/bundles"
import { Category } from "../../reducers/categories"
import { Token } from "../../reducers/tokens"
import { dispatch } from "../../store"
import { $red } from "../../styles/variables"
import ActionButton from "../common/ActionButton.react"
import { sizeMQ } from "../common/MediaQuery.react"
import PaymentTokenInput from "../forms/PaymentTokenInput.react"
import MultiChainTradingGate from "../modals/MultiChainTradingGate.react"
import NetworkUnsupportedGate from "../modals/NetworkUnsupportedGate.react"
import SellModalContent from "../trade/SellModalContent.react"
import CancelOrderActionModal from "./CancelOrderActionModal"

const ORDER_PAGE_SIZE = 10

interface Props {
  className?: string
  onOrdersChanged: () => unknown
  collectionSlug?: string
  sellRoute: string
}

interface State {
  legacyOrderCancelModalOpen: boolean
  priceDropModalOpen: boolean
  newAmount?: string
  loading: boolean
  errorMessage?: string
  tokens: Token[]
}

class OrderManager extends GraphQLComponent<OrderManagerQuery, Props, State> {
  state: State = {
    legacyOrderCancelModalOpen: false,
    priceDropModalOpen: false,
    loading: false,
    tokens: [],
  }

  async componentDidUpdate(
    prevProps: Props & GraphQLProps<OrderManagerQuery>,
    prevState: State,
  ) {
    super.componentDidUpdate(prevProps, prevState)
    if (!prevState.priceDropModalOpen && this.state.priceDropModalOpen) {
      // TODO remove TokenActions dependency
      const tokenStore = await dispatch(TokenActions.findAll())
      this.setState({ tokens: tokenStore.tokens })
    }
  }

  onCancel = async () => {
    const { data, onOrdersChanged } = this.props

    const makerOrders = getNodes(data?.orders)
      .map(o => o.oldOrder)
      .filter((o): o is string => o !== null)
      .map(o => buildOrder(JSON.parse(o)))

    try {
      this.setState({
        loading: true,
      })

      await Promise.all(
        makerOrders.map(o => dispatch(ExchangeActions.cancelOrder(o))),
      )

      onOrdersChanged()

      this.setState({ legacyOrderCancelModalOpen: false })
    } catch (error) {
      // Do nothing, already handled
    } finally {
      this.setState({
        loading: false,
      })
    }
  }

  onPriceDrop = async () => {
    const { data, onOrdersChanged } = this.props
    const { newAmount } = this.state
    const lowestOrder = getNodes(data?.orders)[0]
    const paymentAssetQuantity = getNodes(
      lowestOrder?.takerAssetBundle.assetQuantities,
    )[0]
    const previousAmount = bn(
      paymentAssetQuantity.quantity,
      paymentAssetQuantity.asset.decimals,
    )
    const oldOrder = lowestOrder.oldOrder
      ? buildOrder(JSON.parse(lowestOrder.oldOrder))
      : undefined
    let errorMessage
    if (!oldOrder?.asset && !oldOrder?.assetBundle) {
      errorMessage = "Values missing."
      this.setState({ errorMessage })
      return
    }

    const amount = bn(newAmount || previousAmount)

    if (amount.isNaN()) {
      errorMessage = "The new sale price must be a number."
    }
    if (
      amount.lessThanOrEqualTo(0) &&
      !confirm("Are you sure you want to make this free?")
    ) {
      errorMessage = "Please try again with a positive price."
    }
    if (amount.greaterThanOrEqualTo(previousAmount)) {
      errorMessage =
        "The new sale price must be lower than the current price. If you need to set a higher price, cancel the listing and re-list."
    }
    if (errorMessage) {
      this.setState({ errorMessage })
      return
    }

    const extraBountyBPS = +oldOrder.makerReferrerFee
    const expirationTime = oldOrder?.waitingForBestCounterOrder
      ? +oldOrder.listingTime
      : +oldOrder.expirationTime

    try {
      this.setState({
        loading: true,
        errorMessage: undefined,
      })

      const asset = oldOrder.asset
      const assetBundle = oldOrder.assetBundle

      if (assetBundle) {
        const bundle = oldOrder.assetOrBundle as Required<Bundle>
        await dispatch(
          ExchangeActions.placeBundleSellOrder({
            bundleName: bundle.name,
            bundleDescription: bundle.description,
            bundleExternalLink: bundle.externalLink,
            assets: bundle.assets as Required<Asset>[],
            collection: bundle.collection as Required<Category>,
            startAmount: +amount,
            endAmount: +amount,
            expirationTime,
            paymentTokenAddress: oldOrder.paymentToken,
            buyerAddress: oldOrder.taker,
            extraBountyBasisPoints: extraBountyBPS,
            waitForHighestBid: oldOrder.waitingForBestCounterOrder,
          }),
        )
      } else if (asset) {
        await dispatch(
          ExchangeActions.placeSellOrder({
            asset: asset,
            startAmount: +amount,
            endAmount: +amount,
            quantity: +bn(oldOrder.quantity, asset.decimals),
            expirationTime,
            paymentTokenAddress: oldOrder.paymentToken,
            buyerAddress: oldOrder.taker,
            extraBountyBasisPoints: extraBountyBPS,
            waitForHighestBid: oldOrder.waitingForBestCounterOrder,
          }),
        )
      }

      onOrdersChanged()

      this.setState({
        priceDropModalOpen: false,
      })
    } catch (error) {
      this.setState({
        errorMessage: error.toString(),
      })
    } finally {
      this.setState({
        loading: false,
      })
    }
  }

  renderCancelModal() {
    const { data } = this.props
    const { legacyOrderCancelModalOpen } = this.state
    const orderCount = getNodes(data?.orders).length
    const onClose = () => this.setState({ legacyOrderCancelModalOpen: false })
    return (
      <Modal
        isOpen={legacyOrderCancelModalOpen}
        key="CancelModal"
        onClose={onClose}
      >
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to cancel your{" "}
            {pluralize("listing", orderCount)}?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {orderCount > 1 ? (
            <p>
              Canceling your listings will unpublish them on OpenSea and
              requires transactions to make sure they will never be fulfillable.
              {orderCount >= ORDER_PAGE_SIZE
                ? ` You can cancel up to ${ORDER_PAGE_SIZE} at a time.`
                : ""}
            </p>
          ) : (
            <p>
              Canceling your listing will unpublish this sale from OpenSea and
              requires a transaction to make sure it will never be fulfillable.
            </p>
          )}
          {orderCount > 1 && (
            <small className="OrderManager--note">
              This will cancel your{" "}
              {orderCount >= ORDER_PAGE_SIZE ? "lowest " : ""}
              {getNodes(data?.orders).length} orders.
            </small>
          )}
        </Modal.Body>

        <Modal.Footer>
          <ActionButton type="tertiary" onClick={onClose}>
            Never mind
          </ActionButton>
          <Block marginLeft="24px">
            <ActionButton onClick={this.onCancel}>Cancel Listing</ActionButton>
          </Block>
        </Modal.Footer>
      </Modal>
    )
  }

  renderPriceDropModal() {
    const { data } = this.props
    const { priceDropModalOpen, newAmount, tokens, errorMessage } = this.state
    const assetQuantities = getNodes(data?.orders)[0]?.takerAssetBundle
      .assetQuantities
    const paymentAssetQuantity = getNodes(assetQuantities)[0]
    const paymentToken = tokens.find(
      t => t.symbol === paymentAssetQuantity?.asset.symbol,
    )
    const placeholder =
      paymentAssetQuantity &&
      display(
        bn(paymentAssetQuantity.quantity, paymentAssetQuantity.asset.decimals),
        paymentAssetQuantity.asset.symbol || undefined,
      )
    const onClose = () => this.setState({ priceDropModalOpen: false })

    return (
      <Modal isOpen={priceDropModalOpen} key="PriceDropModal" onClose={onClose}>
        <Modal.Header>
          <Modal.Title>Lower the listing price</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {paymentToken && (
            <PaymentTokenInput
              placeholder={placeholder}
              token={paymentToken}
              value={newAmount || ""}
              onChange={value => this.setState({ newAmount: value })}
            />
          )}
          {errorMessage && (
            <>
              <br />
              <p className="OrderManager--modal-error-text">{errorMessage}</p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <ActionButton type="tertiary" onClick={onClose}>
            Never mind
          </ActionButton>
          <Block marginLeft="24px">
            <ActionButton onClick={this.onPriceDrop}>
              Set New Price
            </ActionButton>
          </Block>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const {
      className,
      data,
      sellRoute,
      variables: {
        archetype: { assetContractAddress, tokenId },
        chain,
      },
      collectionSlug,
      onOrdersChanged,
    } = this.props

    const { wallet } = this.context
    const makerOrders = getNodes(data?.orders)
    const order = first(makerOrders)
    const isOrderV2 = isOrderV2Enabled({
      chain,
      address: assetContractAddress,
      slug: collectionSlug,
    })
    return (
      <DivContainer className={className}>
        <div className="OrderManager--cta-container">
          <NetworkUnsupportedGate chainIdentifier={chain}>
            <MultiChainTradingGate
              chainIdentifier={chain}
              collectionSlug={collectionSlug}
            >
              {data?.archetype?.asset?.isEditable.value ? (
                <ActionButton
                  className="OrderManager--second-button"
                  href={`/collection/${collectionSlug}/asset/${chainIdentifierWithTrailingSlash(
                    chain,
                  )}${assetContractAddress}/${tokenId}/edit`}
                  type="secondary"
                >
                  Edit
                </ActionButton>
              ) : null}

              <MultiStepModal
                size="large"
                trigger={open => {
                  // TODO: Remove, but is needed for now due to the href
                  const sellButtonHref =
                    (chain &&
                      shouldShowMultichainModal(chain, collectionSlug)) ||
                    isOrderV2
                      ? undefined
                      : sellRoute

                  return order ? (
                    <>
                      <ActionButton
                        className="OrderManager--second-button"
                        type="secondary"
                        onClick={() => {
                          if (isOrderV2) {
                            open()
                          } else {
                            this.setState({ legacyOrderCancelModalOpen: true })
                          }
                        }}
                      >
                        Cancel {pluralize("Listing", makerOrders.length)}
                      </ActionButton>

                      {isOrderV2 ? null : (
                        <ActionButton
                          onClick={() =>
                            this.setState({ priceDropModalOpen: true })
                          }
                        >
                          Lower Price
                        </ActionButton>
                      )}
                    </>
                  ) : (
                    <ActionButton
                      href={sellButtonHref}
                      onClick={!sellButtonHref ? open : undefined}
                    >
                      {this.tr("Sell")}
                    </ActionButton>
                  )
                }}
              >
                {onClose =>
                  order ? (
                    <CancelOrderActionModal
                      variables={{
                        orderId: order.relayId,
                        maker: { address: wallet.address, chain },
                      }}
                      onClose={onClose}
                      onOrderCancelled={onOrdersChanged}
                    />
                  ) : (
                    <SellModalContent
                      variables={{
                        archetype: { assetContractAddress, chain, tokenId },
                        chain,
                      }}
                      onOrderCreated={onOrdersChanged}
                    />
                  )
                }
              </MultiStepModal>
            </MultiChainTradingGate>
          </NetworkUnsupportedGate>
        </div>
        {this.renderCancelModal()}
        {this.renderPriceDropModal()}
      </DivContainer>
    )
  }
}

export default withData<OrderManagerQuery, Props>(
  OrderManager,
  graphql`
    query OrderManagerQuery(
      $archetype: ArchetypeInputType!
      $bundle: BundleSlug
      $isBundle: Boolean!
      $chain: ChainScalar
    ) {
      orders(
        first: 20
        isValid: true
        isExpired: false
        maker: {}
        makerArchetype: $archetype
        sortAscending: true
        sortBy: TAKER_ASSETS_USD_PRICE
        takerAssetIsPayment: true
      ) @skip(if: $isBundle) {
        edges {
          node {
            relayId
            oldOrder
            takerAssetBundle {
              assetQuantities(first: 1) {
                edges {
                  node {
                    asset {
                      symbol
                      decimals
                    }
                    quantity
                  }
                }
              }
            }
          }
        }
      }
      orders(
        first: 20
        isValid: true
        maker: {}
        makerAssetBundle: $bundle
        sortAscending: true
        sortBy: TAKER_ASSETS_USD_PRICE
        takerAssetIsPayment: true
      ) @include(if: $isBundle) {
        edges {
          node {
            relayId
            oldOrder
            takerAssetBundle {
              assetQuantities(first: 1) {
                edges {
                  node {
                    asset {
                      symbol
                      decimals
                    }
                    quantity
                  }
                }
              }
            }
          }
        }
      }
      bundle(bundle: $bundle) @include(if: $isBundle) {
        ...BidModalContent_bundle @arguments(chain: $chain)
      }
      archetype(archetype: $archetype) @skip(if: $isBundle) {
        asset {
          isEditable {
            value
          }
        }
        ...BidModalContent_archetype @arguments(identity: {}, chain: $chain)
      }
      tradeSummary(archetype: $archetype) @skip(if: $isBundle) {
        ...BidModalContent_trade
      }
    }
  `,
)

const DivContainer = styled.div`
  bottom: 0px;
  position: fixed;
  top: auto;
  width: 100%;
  right: 0px;
  padding: 10px 20px;
  z-index: 2;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  .OrderManager--cta-container {
    align-items: center;
    display: flex;
    flex: 1 0;
    justify-content: flex-end;

    .OrderManager--second-button {
      margin-right: 10px;
    }
  }

  .Modal {
    .OrderManager--cta-container {
      margin: 10px 0px 20px;
      justify-content: center;
      .OrderManager--cta {
        padding: 18px;
      }
    }
    .OrderManager--modal-error-text {
      color: ${$red};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .OrderManager--note {
    text-align: center;
    display: block;
    opacity: 0.5;
    font-size: 13px;
  }

  .OrderManager--loader {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  ${sizeMQ({
    tabletL: css`
      position: sticky;
      top: 72px;
      height: 70px;

      .OrderManager--cta-container {
        max-width: 1280px;
        margin: auto;
        padding: 0 20px;
      }
    `,
  })}
`
