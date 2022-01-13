import React from "react"
import styled, { css } from "styled-components"
import ErrorActions from "../../actions/errors"
import ExchangeActions from "../../actions/exchange"
import Block from "../../design-system/Block"
import Loader from "../../design-system/Loader/Loader.react"
import Modal from "../../design-system/Modal"
import {
  MultiStepContext,
  withMultiStepFlowContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import {
  getItemTrackingFn,
  trackOpenCheckoutModal,
} from "../../lib/analytics/events/itemEvents"
import { CheckoutModalQuery } from "../../lib/graphql/__generated__/CheckoutModalQuery.graphql"
import { getFirstNode, graphql, GraphQLProps } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { BigNumber, bn } from "../../lib/helpers/numberUtils"
import {
  isOrderV2Enabled,
  setTermsAcceptance,
  shouldUseMetaTransactions,
} from "../../lib/helpers/orders"
import { getTotalPrice } from "../../lib/helpers/price"
import { readQuantity, readRemainingQuantity } from "../../lib/helpers/quantity"
import {
  readCollectionVerificationStatus,
  readVerificationStatus,
} from "../../lib/helpers/verification"
import { dispatch } from "../../store"
import { $blue } from "../../styles/variables"
import AssetMedia from "../assets/AssetMedia.react"
import AssetQuantity from "../assets/AssetQuantity.react"
import AcknowledgementCheckboxes from "../collections/AcknowledgementCheckboxes.react"
import CollectionLink from "../collections/CollectionLink.react"
import UnapprovedBundlePanel from "../collections/UnapprovedBundlePanel.react"
import { VerificationIcon } from "../collections/VerificationIcon.react"
import ActionButton from "../common/ActionButton.react"
import { sizeMQ } from "../common/MediaQuery.react"
import ModalLoader from "../common/ModalLoader.react"
import Row from "../common/Row.react"
import NumericInput from "../forms/NumericInput.react"
import CollectionStatusModal from "../modals/CollectionStatusModal.react"
import FulfillActionModal from "../orders/FulfillActionModal.react"
import AddFundsModal from "./AddFundsModal.react"
import AskPrice from "./AskPrice.react"
import SellFees from "./SellFees.react"

const COLUMN_CLASS_NAMES = {
  0: "CheckoutModal--item-column",
  1: "CheckoutModal--price-column",
  2: "CheckoutModal--quantity-column",
  3: "CheckoutModal--total-column",
}

type BaseProps = {
  onClose: () => unknown
}

type Props = BaseProps & MultiStepContext

interface State {
  isFulfilling?: boolean
  isUsingFulfillActionModal: boolean
  quantity: string
  didAcknowledgeReviewWarning: boolean
  didAcknowledgeToSWarning: boolean
}

class CheckoutModal extends GraphQLComponent<CheckoutModalQuery, Props, State> {
  state: State = {
    isUsingFulfillActionModal: false,
    quantity: "1",
    didAcknowledgeReviewWarning: false,
    didAcknowledgeToSWarning: false,
  }

  async legacyFulfillOrder(order: CheckoutModalQuery["response"]["order"]) {
    const { onClose } = this.props
    onClose()
    await dispatch(ExchangeActions.legacyFulfillOrderV2(order))
  }

  private trackWithItem = (
    trackingFn: ReturnType<typeof getItemTrackingFn>,
  ) => {
    if (!this.props.data) {
      return
    }
    const { order } = this.props.data
    const ref = order.makerAssetBundle.assetQuantities.edges[0]?.node?.asset
    if (!ref) {
      return
    }
    trackingFn(ref)
  }

  componentDidUpdate(prev: Props & GraphQLProps<CheckoutModalQuery>) {
    const { data } = this.props
    const maxFulfillableQuantity = this.getMaxFulfillableQuantity()
    if (data && data !== prev.data && maxFulfillableQuantity) {
      this.setState({
        quantity:
          data.order.side === "ASK" ? "1" : maxFulfillableQuantity.toString(),
      })
    }
    if (!prev.data && !!data) {
      this.trackWithItem(trackOpenCheckoutModal)
    }
  }

  getMaxFulfillableQuantity() {
    const { data } = this.props
    if (!data) {
      return undefined
    }
    const order = data.order
    const { takerAssetBundle } = order
    const remainingQuantity = readRemainingQuantity(order)
    const takerQuantity = getFirstNode(takerAssetBundle.assetQuantities)
    const takerDecimals = takerQuantity?.asset.decimals
    const balance = bn(data.blockchain.balance, takerDecimals)
    return order.side === "ASK"
      ? remainingQuantity
      : BigNumber.min(remainingQuantity, balance)
  }

  getSellerAssetQuantity() {
    const { data } = this.props
    const order = data?.order

    return order?.side === "ASK"
      ? getFirstNode(order?.makerAssetBundle?.assetQuantities)
      : getFirstNode(order?.takerAssetBundle?.assetQuantities)
  }

  render() {
    const { data, onNext, onClose, onPrevious, variables } = this.props
    const { isFulfilling, quantity } = this.state
    if (!data) {
      return <ModalLoader />
    }
    const order = data.order
    const { makerAssetBundle, takerAssetBundle } = order
    const slug = makerAssetBundle.slug
    const sellerAssetQuantity = this.getSellerAssetQuantity()
    const buyerAssetQuantity =
      order.side === "ASK"
        ? getFirstNode(takerAssetBundle.assetQuantities)
        : getFirstNode(makerAssetBundle.assetQuantities)
    const maxFulfillableQuantity = this.getMaxFulfillableQuantity()
    if (
      !sellerAssetQuantity ||
      !buyerAssetQuantity ||
      !maxFulfillableQuantity
    ) {
      return <ModalLoader />
    }
    const sellerAsset = sellerAssetQuantity.asset
    const makerQuantity = getFirstNode(makerAssetBundle.assetQuantities)
    const takerQuantity = getFirstNode(takerAssetBundle.assetQuantities)
    const { dutchAuctionFinalPrice, openedAt, priceFnEndedAt } = order
    const totalPrice = takerQuantity
      ? getTotalPrice(
          bn(takerQuantity.quantity),
          dutchAuctionFinalPrice,
          openedAt,
          priceFnEndedAt,
        )
      : undefined
    const maxQuantity = readQuantity(sellerAssetQuantity)
    const resultantPrice = totalPrice?.div(maxQuantity).times(bn(quantity))
    const takerDecimals = takerQuantity?.asset.decimals
    const addFunds =
      order.side === "ASK" &&
      !isOrderV2Enabled({
        chain: sellerAsset.assetContract.chain,
        address: sellerAsset.assetContract.address,
        slug: sellerAsset.collection.slug,
      }) &&
      totalPrice &&
      takerQuantity &&
      resultantPrice
        ? bn(data.blockchain.balance, takerDecimals).lessThan(
            bn(resultantPrice, takerDecimals),
          )
        : false
    const takerAsset = getFirstNode(takerAssetBundle?.assetQuantities)?.asset
    const chainIdentifier = takerAsset?.assetContract.chain
    const symbol = takerAsset?.symbol
    const decimals =
      order.side === "ASK" ? sellerAssetQuantity.asset.decimals : undefined
    const isFulfillable = order.isFulfillable
    const takerAssetFillAmount =
      order.side === "ASK" && takerQuantity?.asset.decimals
        ? resultantPrice?.toString()
        : quantity
    const verificationStatus = readVerificationStatus(
      data?.order?.makerAssetBundle?.assetQuantities,
    )
    const isBundle = !!slug
    const shouldPromptTermsAcceptance =
      order.side === "ASK" &&
      !["verified", "safelisted"].includes(verificationStatus)

    const {
      wallet: { activeAccount },
      mutate,
    } = this.context

    const hasAcceptedTerms =
      !!activeAccount?.user?.hasAffirmativelyAcceptedOpenseaTerms

    const usdSpotPrice = takerAsset?.usdSpotPrice ?? 1

    return (
      <>
        <Modal.Header onPrevious={onPrevious}>
          <Modal.Title>
            {this.tr(
              order.side === "ASK" ? "Complete checkout" : "Accept this offer",
            )}
          </Modal.Title>
        </Modal.Header>

        <StyledBody>
          {shouldPromptTermsAcceptance && isBundle && <UnapprovedBundlePanel />}

          <div className="CheckoutModal--table">
            <Row
              className="CheckoutModal--row"
              columnIndexClassName={COLUMN_CLASS_NAMES}
              isHeader
            >
              <Text as="div" variant="bold">
                {this.tr("Item")}
              </Text>
              {maxQuantity.equals(bn(1)) ? undefined : (
                <Text as="div" variant="bold">
                  {this.tr("Price")}
                </Text>
              )}
              {maxQuantity.equals(bn(1)) ? undefined : (
                <Text as="div" variant="bold">
                  {this.tr("Quantity")}
                </Text>
              )}
              <Text as="div" variant="bold">
                {this.tr("Subtotal")}
              </Text>
            </Row>
            <Row columnIndexClassName={COLUMN_CLASS_NAMES}>
              <div className="CheckoutModal--item">
                <div className="CheckoutModal---item-image-container">
                  <div className="CheckoutModal--item-image-frame">
                    <AssetMedia
                      asset={sellerAsset}
                      className="CheckoutModal--item-image"
                      size={74}
                    />
                  </div>
                  {slug ? (
                    <>
                      <div className="CheckoutModal--bundle-card" />
                      <div className="CheckoutModal--bundle-second-card" />
                    </>
                  ) : null}
                </div>
                <div className="CheckoutModal--item-values">
                  {!slug ? (
                    <div className="CheckoutModal--item-collection">
                      <CollectionLink
                        collection={sellerAsset.collection}
                        isSmall
                      />
                      <Modal
                        trigger={open => (
                          <UnstyledButton onClick={open}>
                            <VerificationIcon
                              size="small"
                              verificationStatus={readCollectionVerificationStatus(
                                sellerAsset.collection,
                              )}
                            />
                          </UnstyledButton>
                        )}
                      >
                        <CollectionStatusModal
                          address={sellerAsset.assetContract.address}
                          blockExplorerLink={
                            sellerAsset.assetContract.blockExplorerLink
                          }
                          verificationStatus={readCollectionVerificationStatus(
                            sellerAsset.collection,
                          )}
                        />
                      </Modal>
                    </div>
                  ) : null}
                  <div className="CheckoutModal--item-name">
                    {slug ? makerAssetBundle.name : sellerAsset.name}
                  </div>
                </div>
              </div>
              {maxQuantity.equals(bn(1)) ? undefined : order.side === "ASK" ? (
                <div className="CheckoutModal--total">
                  <AskPrice
                    className="CheckoutModal--item-price"
                    data={order}
                  />
                  <AskPrice
                    className="CheckoutModal--item-price"
                    data={order}
                    secondary
                    variant="fiat"
                  />
                </div>
              ) : (
                <div className="CheckoutModal--total">
                  <AssetQuantity
                    className="CheckoutModal--item-price"
                    data={buyerAssetQuantity}
                    mapQuantity={q => q.div(maxQuantity)}
                    showWeth
                  />
                  <AssetQuantity
                    className="CheckoutModal--item-price"
                    data={buyerAssetQuantity}
                    mapQuantity={q => q.div(maxQuantity)}
                    secondary
                    showWeth
                    variant="fiat"
                  />
                </div>
              )}
              {maxQuantity.equals(bn(1)) ? undefined : (
                <div className="CheckoutModal--quantity">
                  {isFulfillable && maxQuantity.greaterThan(bn(1)) ? (
                    <NumericInput
                      className="CheckoutModal--quantity-input"
                      inputValue={quantity}
                      max={maxFulfillableQuantity}
                      maxDecimals={decimals ?? 0}
                      placeholder={maxFulfillableQuantity.toString()}
                      value={quantity}
                      onChange={({ value }) => {
                        if (value !== undefined) {
                          this.setState({ quantity: value })
                        }
                      }}
                    />
                  ) : (
                    maxQuantity.toString()
                  )}
                </div>
              )}
              <div className="CheckoutModal--total">
                {order.side === "ASK" ? (
                  quantity ? (
                    <>
                      <AskPrice
                        className="CheckoutModal--total-price"
                        data={order}
                        isTotal
                        partialQuantity={
                          isFulfillable ? bn(quantity) : maxQuantity
                        }
                      />
                      <AskPrice
                        className="CheckoutModal--item-price"
                        data={order}
                        isTotal
                        partialQuantity={
                          isFulfillable ? bn(quantity) : maxQuantity
                        }
                        secondary
                        variant="fiat"
                      />
                    </>
                  ) : null
                ) : (
                  <>
                    <AssetQuantity
                      className="CheckoutModal--total-price"
                      data={buyerAssetQuantity}
                      mapQuantity={q =>
                        quantity ? q.div(maxQuantity).times(quantity) : q
                      }
                      showWeth
                    />
                    <AssetQuantity
                      className="CheckoutModal--item-price"
                      data={buyerAssetQuantity}
                      mapQuantity={q =>
                        quantity ? q.div(maxQuantity).times(quantity) : q
                      }
                      secondary
                      variant="fiat"
                    />
                  </>
                )}
              </div>
            </Row>
            {order.side === "ASK" ? (
              <Row
                className="CheckoutModal--total-row"
                columnIndexClassName={{
                  0: "CheckoutModal--total-item-col",
                  1: "CheckoutModal--total-final-col",
                }}
                isHeader
              >
                <Text as="div" variant="bold">
                  {this.tr("Total")}
                </Text>
                <div className="CheckoutModal--total">
                  {quantity ? (
                    <>
                      <AskPrice
                        className="CheckoutModal--total-final-price"
                        data={order}
                        isTotal
                        partialQuantity={
                          isFulfillable ? bn(quantity) : maxQuantity
                        }
                      />
                      <AskPrice
                        className="CheckoutModal--total-item-price"
                        data={order}
                        isTotal
                        partialQuantity={
                          isFulfillable ? bn(quantity) : maxQuantity
                        }
                        secondary
                        variant="fiat"
                      />
                    </>
                  ) : null}
                </div>
              </Row>
            ) : (
              <Block marginTop="20px">
                <SellFees
                  collectionDataKey={takerQuantity?.asset.collection ?? null}
                  priceDataKey={makerQuantity?.asset ?? null}
                  quantity={
                    quantity
                      ? bn(buyerAssetQuantity.quantity)
                          .div(maxQuantity)
                          .times(quantity)
                      : bn(buyerAssetQuantity.quantity)
                  }
                />
              </Block>
            )}

            {(!hasAcceptedTerms ||
              (isBundle && shouldPromptTermsAcceptance)) && (
              <AcknowledgementCheckboxes
                hasAcceptedTerms={hasAcceptedTerms}
                isBundle={isBundle}
                isReviewChecked={this.state.didAcknowledgeReviewWarning}
                isToSChecked={this.state.didAcknowledgeToSWarning}
                onReviewChecked={value =>
                  this.setState({ didAcknowledgeReviewWarning: value })
                }
                onToSChecked={value =>
                  this.setState({ didAcknowledgeToSWarning: value })
                }
              />
            )}
          </div>
        </StyledBody>

        <Modal.Footer>
          {addFunds && symbol && resultantPrice ? (
            <>
              <Tooltip
                content={"Not enough " + symbol + " to complete purchase"}
              >
                <Block marginRight="24px">
                  <ActionButton isDisabled>{this.tr("Checkout")}</ActionButton>
                </Block>
              </Tooltip>
              <ActionButton
                type="secondary"
                onClick={() =>
                  onNext(
                    <AddFundsModal
                      assetId={sellerAssetQuantity.asset.relayId}
                      fundsToAdd={bn(resultantPrice, takerDecimals).mul(
                        usdSpotPrice,
                      )}
                      orderId={order.relayId}
                      variables={{ symbol, chain: chainIdentifier }}
                      onClose={onClose}
                    />,
                  )
                }
              >
                {symbol === "WETH" ? "Convert ETH" : "Add Funds"}
              </ActionButton>
            </>
          ) : takerAssetFillAmount ? (
            <ActionButton
              isDisabled={
                (isFulfillable && !quantity) ||
                (order.side === "ASK" &&
                  !hasAcceptedTerms &&
                  ((!this.state.didAcknowledgeReviewWarning &&
                    isBundle &&
                    shouldPromptTermsAcceptance) ||
                    !this.state.didAcknowledgeToSWarning))
              }
              onClick={async () => {
                this.setState({ isFulfilling: true })
                try {
                  // Handle legacy orders.
                  if (!isFulfillable) {
                    await this.legacyFulfillOrder(order)
                    return
                  }

                  if (!hasAcceptedTerms) {
                    await this.attempt(setTermsAcceptance(mutate))
                  }

                  // TODO dario: Handle OrderV2 bundle orders
                  onNext(
                    <FulfillActionModal
                      assetIDs={[sellerAssetQuantity.asset.relayId]}
                      chain={chainIdentifier ?? "MATIC"}
                      variables={{
                        orderId: order.relayId,
                        taker: variables.identity,
                        takerAssetFillAmount: takerAssetFillAmount.toString(),
                        useMetaTransactions: shouldUseMetaTransactions({
                          chain: chainIdentifier,
                          address: sellerAsset.assetContract.address,
                          slug: sellerAsset.collection.slug,
                        }),
                      }}
                    />,
                  )
                } catch (error) {
                  dispatch(
                    ErrorActions.show(
                      error,
                      "There was an error sending the purchase transaction. Please try again.",
                    ),
                  )
                }
                this.setState({ isFulfilling: false })
              }}
            >
              {isFulfilling ? (
                <Loader size="small" />
              ) : (
                this.tr(order.side === "ASK" ? "Checkout" : "Accept")
              )}
            </ActionButton>
          ) : null}
        </Modal.Footer>
      </>
    )
  }
}

export default withData<CheckoutModalQuery, BaseProps>(
  withMultiStepFlowContext(CheckoutModal),
  graphql`
    query CheckoutModalQuery(
      $orderId: OrderRelayID!
      $asset: AssetRelayID!
      $identity: IdentityInputType!
    ) {
      order(order: $orderId) {
        isFulfillable
        oldOrder
        relayer
        relayId
        side
        dutchAuctionFinalPrice
        openedAt
        priceFnEndedAt
        makerAssetBundle {
          slug
          name
          assetQuantities(first: 30) {
            edges {
              node {
                asset {
                  usdSpotPrice
                  assetContract {
                    address
                    chain
                    blockExplorerLink
                  }
                  collection {
                    name
                    slug
                    hidden
                    ...CollectionLink_collection
                    ...verification_data
                  }
                  decimals
                  imageUrl
                  name
                  symbol
                  relayId
                  ...AssetMedia_asset
                  ...Price_data
                  ...itemEvents_data
                }
                ...quantity_data
                quantity
                ...AssetQuantity_data
              }
            }
          }
        }
        takerAssetBundle {
          assetQuantities(first: 1) {
            edges {
              node {
                asset {
                  usdSpotPrice
                  assetContract {
                    address
                    chain
                    blockExplorerLink
                  }
                  collection {
                    name
                    slug
                    hidden
                    ...CollectionLink_collection
                    ...verification_data
                    ...SellFees_collection
                  }
                  decimals
                  imageUrl
                  name
                  symbol
                  relayId
                  ...AssetMedia_asset
                }
                ...quantity_data
                ...AssetQuantity_data
                quantity
              }
            }
          }
        }
        ...AskPrice_data
        ...orderLink_data
        ...quantity_remaining
      }
      blockchain {
        balance(asset: $asset, identity: $identity)
      }
    }
  `,
)

const StyledBody = styled(Modal.Body)`
  .CheckoutModal--description {
    flex: 1 0 100%;
  }

  .CheckoutModal--cta-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    width: 100%;

    .CheckoutModal--cta {
      margin-left: 20px;
    }
  }

  .CheckoutModal--fee-description {
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
  }

  .CheckoutModal--table {
    width: 100%;
    padding-top: 16px;

    ${sizeMQ({
      tabletS: css`
        padding: 16px 24px 0;
      `,
    })}

    .CheckoutModal--item-column,
    .CheckoutModal--price-column,
    .CheckoutModal--quantity-column,
    .CheckoutModal--total-column,
    .CheckoutModal--total-item-col,
    .CheckoutModal--total-final-col {
      background: ${props => props.theme.colors.card};
    }

    .CheckoutModal--item-column {
      padding-left: 0px;
    }

    .CheckoutModal--price-column {
      display: flex;
      justify-content: center;
      max-width: 115px;
    }

    .CheckoutModal--quantity-column {
      display: flex;
      justify-content: center;
      max-width: 100px;
    }

    .CheckoutModal--total-column {
      display: flex;
      justify-content: flex-end;
      padding-right: 0px;
      max-width: 115px;
    }

    .CheckoutModal--item {
      display: flex;
      justify-content: left;
      width: 100%;

      .CheckoutModal--item-collection {
        display: flex;
        align-items: center;
      }

      .CheckoutModal---item-image-container {
        display: flex;
        width: 76px;

        .CheckoutModal--item-image-frame {
          border: 1px solid
            ${props => props.theme.colors.withOpacity.gray.light};
          border-radius: 4px;
          height: 76px;
          min-width: 76px;
          z-index: 2;
          position: relative;
        }

        .CheckoutModal--bundle-card {
          border: 1px solid
            ${props => props.theme.colors.withOpacity.gray.light};
          background: white;
          border-radius: 4px;
          min-height: 76px;
          min-width: 76px;
          height: 76px;
          width: 76px;
          position: relative;
          left: -81px;
          top: -5px;
          z-index: 1;
        }

        .CheckoutModal--bundle-second-card {
          border: 1px solid
            ${props => props.theme.colors.withOpacity.gray.light};
          background: white;
          border-radius: 4px;
          min-height: 76px;
          min-width: 76px;
          height: 76px;
          width: 76px;
          position: relative;
          left: -162px;
          top: -10px;
        }
      }

      .CheckoutModal--item-values {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 16px;
        width: calc(100% - 86px);
      }

      .CheckoutModal--item-name {
        font-weight: 600;
        height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .CheckoutModal--item-price {
      font-size: 12px;
    }

    .CheckoutModal--total-price {
      font-size: 14px;
      justify-content: right;
    }

    .CheckoutModal--total-final-price {
      font-size: 18px;
      font-weight: 600;
      color: ${$blue};
    }

    .CheckoutModal--total-final-price-footnote {
      font-size: 10px;
      margin-top: 4px;
    }

    .CheckoutModal--quantity {
      .CheckoutModal--quantity-input {
        width: 50px;
        overflow: hidden;
      }
    }

    .CheckoutModal--fee {
      font-size: 14px;
    }

    .CheckoutModal--total-row {
      display: flex;
      justify-content: space-between;
    }

    .CheckoutModal--total-item-col {
      padding-left: 0px;
    }

    .CheckoutModal--total-final-col {
      padding-right: 0px;
    }

    .CheckoutModal--total {
      align-items: flex-end;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 54px;
      width: 100%;
    }

    .CheckoutModal--gas-label {
      align-items: center;
      display: flex;

      .CheckoutModal--gas-label-tooltip {
        line-height: 16px;

        .CheckoutModal--gas-label-tooltip-icon {
          font-size: 16px;
          margin-left: 4px;
        }
      }
    }
  }
`
