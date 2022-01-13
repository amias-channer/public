import React from "react"
import moment, { Moment } from "moment"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Button from "../../design-system/Button"
import DatePicker from "../../design-system/DatePicker"
import Modal from "../../design-system/Modal"
import {
  MultiStepContext,
  withMultiStepFlowContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import { SellModalContentQuery } from "../../lib/graphql/__generated__/SellModalContentQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { bn } from "../../lib/helpers/numberUtils"
import {
  getMaxExpiryDate,
  getTotalAssetQuantity,
  shouldUseMetaTransactions,
} from "../../lib/helpers/orders"
import Icon from "../common/Icon.react"
import { sizeMQ } from "../common/MediaQuery.react"
import ModalLoader from "../common/ModalLoader.react"
import Label from "../forms/Label.react"
import NumericInput from "../forms/NumericInput.react"
import Frame, { FrameConfiscator, FrameProvider } from "../layout/Frame.react"
import Panel from "../layout/Panel.react"
import AssetSuccessModalContent from "../modals/AssetSuccessModalContent.react"
import OrderCreateActionModal from "../orders/OrderCreateActionModal.react"
import PaymentTokenInputV2 from "./PaymentTokenInputV2.react"
import SellFees from "./SellFees.react"

interface BaseProps {
  onOrderCreated?: () => unknown
  shouldLinkToAsset?: boolean
}

type Props = BaseProps & MultiStepContext

interface State {
  quantity: string
  pricePerUnit: string
  paymentAssetRelayId: string
  errorText: string
  showZeroPriceWarning?: boolean
  expirationDate: Moment
  scheduledDate: Moment
}

// TODO: handle bundles
class SellModalContent extends GraphQLComponent<
  SellModalContentQuery,
  Props,
  State
> {
  state: State = this.syncState(() => ({
    quantity: "1",
    pricePerUnit: "",
    errorText: "Please fill out all fields",
    paymentAssetRelayId: this.getPaymentAssets()?.[0]?.relayId ?? "",
    expirationDate: getMaxExpiryDate(),
    scheduledDate: moment(),
  }))

  onOrderCreated = () => {
    const { data, onReplace, onOrderCreated, shouldLinkToAsset } = this.props

    const assetIDs = data?.archetype?.asset?.relayId

    if (assetIDs) {
      onReplace(
        <AssetSuccessModalContent
          mode="listed"
          shouldLinkToAsset={shouldLinkToAsset}
          variables={{ assetIDs: [assetIDs] }}
        />,
      )
    }

    onOrderCreated?.()
  }

  validate = () => {
    const { pricePerUnit, quantity } = this.state

    const bnPricePerUnit = bn(pricePerUnit)
    const bnQuantity = bn(quantity)

    if (!bnPricePerUnit.greaterThan(0) || !bnQuantity.greaterThan(0)) {
      this.setState({ errorText: "Please fill out all fields" })

      return false
    }

    this.setState({ errorText: "" })
    return true
  }

  onSubmit = () => {
    const { data, onNext } = this.props
    const { pricePerUnit, quantity, expirationDate, scheduledDate } = this.state
    const { wallet } = this.context

    const address = data?.archetype?.asset?.assetContract.address
    const chain = data?.archetype?.asset?.assetContract.chain
    const paymentAsset = this.getCurrentPaymentAsset()
    const slug = data?.archetype?.asset?.collection.slug
    const makerAssetId = data?.archetype?.asset?.relayId
    const takerAssetId = paymentAsset?.asset.relayId
    if (this.validate() && makerAssetId && takerAssetId) {
      onNext(
        <OrderCreateActionModal
          mode="ask"
          variables={{
            maker: {
              address: wallet.getActiveAccountKey()?.address,
              chain,
            },
            makerAssetQuantities: [
              {
                asset: makerAssetId,
                quantity,
              },
            ],
            takerAssetQuantities: [
              {
                asset: takerAssetId,
                quantity: getTotalAssetQuantity({
                  pricePerUnit,
                  quantity,
                  decimals: paymentAsset?.asset.decimals,
                }).toString(),
              },
            ],
            useMetaTransactions: shouldUseMetaTransactions({
              chain,
              address: address,
              slug,
            }),
            expiration: expirationDate.unix(),
            openedAt: scheduledDate.utc().format(),
          }}
          onEnd={this.onOrderCreated}
        />,
      )
    }
  }

  getPaymentAssets() {
    const { data } = this.props

    // HACK: We want to filter out ETH from valid payment assets due to 0x protocol
    return data?.archetype?.asset?.collection.paymentAssets.filter(
      paymentAsset =>
        !(
          paymentAsset.asset.symbol === "ETH" &&
          paymentAsset.asset.assetContract.chain === "ETHEREUM"
        ),
    )
  }

  getCurrentPaymentAsset = () => {
    const { paymentAssetRelayId } = this.state

    return this.getPaymentAssets()?.find(
      paymentAsset => paymentAsset.relayId === paymentAssetRelayId,
    )
  }

  renderSellerFee = () => {
    const { data } = this.props
    const { pricePerUnit, quantity } = this.state

    const paymentAsset = this.getCurrentPaymentAsset()
    const asset = paymentAsset?.asset

    return (
      <SellFees
        collectionDataKey={data?.archetype?.asset?.collection ?? null}
        priceDataKey={asset ?? null}
        quantity={getTotalAssetQuantity({
          pricePerUnit,
          quantity,
          decimals: asset?.decimals,
        })}
      />
    )
  }

  render() {
    const { data } = this.props

    if (!data) {
      return <ModalLoader />
    }

    const {
      quantity,
      paymentAssetRelayId,
      pricePerUnit,
      errorText,
      scheduledDate,
      expirationDate,
    } = this.state

    const isFungible =
      !!data.archetype?.quantity && data.archetype?.quantity !== "1"
    const ownedQuantity = (
      data.archetype?.ownedQuantity
        ? bn(data.archetype?.ownedQuantity, data.archetype?.asset?.decimals)
        : bn(0)
    ).toString()

    const paymentAssets = this.getPaymentAssets()

    const now = moment()

    return (
      <>
        <Modal.Header>
          <Modal.Title>{this.tr("Sell your item")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <DivContainer>
            <Frame>
              <FrameProvider>
                <Panel icon="local_offer" mode="start-open" title="Set price">
                  {/* TODO: Find a better way to handle this, or set up framing in general */}
                  <FrameConfiscator>
                    {isFungible ? (
                      <Label
                        label="Quantity"
                        subLabel={`${ownedQuantity} available`}
                      >
                        <NumericInput
                          inputValue={quantity}
                          isRequired
                          max={bn(ownedQuantity)}
                          maxDecimals={data.archetype?.asset?.decimals ?? 0}
                          placeholder={ownedQuantity}
                          value={quantity}
                          onChange={({ value }) =>
                            value !== undefined &&
                            this.setState({ quantity: value }, this.validate)
                          }
                        />
                      </Label>
                    ) : null}
                    <Label
                      label={this.tr(isFungible ? "Price per item" : "Price")}
                    >
                      {paymentAssets ? (
                        <PaymentTokenInputV2
                          dataKey={paymentAssets}
                          paymentAssetRelayId={paymentAssetRelayId}
                          price={pricePerUnit}
                          onChange={({ paymentAssetRelayId, price }) => {
                            this.setState(
                              ({ showZeroPriceWarning }) => ({
                                paymentAssetRelayId,
                                pricePerUnit: price?.toString() ?? "",
                                showZeroPriceWarning: !bn(price).eq(0)
                                  ? false
                                  : showZeroPriceWarning,
                              }),
                              this.validate,
                            )
                          }}
                        />
                      ) : null}
                    </Label>

                    {this.renderSellerFee()}
                  </FrameConfiscator>
                </Panel>

                <Panel icon="timelapse" title="Schedule listing">
                  <Block className="SellModalContent--dates">
                    <Label
                      className="SellModalContent--date SellModalContent--schedule-date"
                      label="Start date"
                    >
                      <DatePicker
                        max={moment.min(
                          now.clone().add(1, "month"),
                          expirationDate,
                        )}
                        min={now}
                        value={scheduledDate}
                        withTime
                        onChange={scheduledDate =>
                          this.setState({ scheduledDate })
                        }
                      />
                    </Label>
                    <Label className="SellModalContent--date" label="End date">
                      <DatePicker
                        max={scheduledDate.clone().add(6, "months")}
                        min={scheduledDate}
                        value={expirationDate}
                        withTime
                        onChange={expirationDate =>
                          this.setState({ expirationDate })
                        }
                      />
                    </Label>
                  </Block>
                </Panel>
              </FrameProvider>
            </Frame>
            <Text
              as="div"
              marginBottom="6px"
              marginTop="30px"
              textAlign="center"
            >
              Listed sell price and scheduled dates cannot be edited once your
              item is listed
              <Tooltip
                content={
                  <>
                    If you need to make modifications, you will need to cancel
                    your listing and relist the item with the updated price and
                    scheduled dates
                  </>
                }
              >
                <Block display="inline" marginLeft="4px" verticalAlign="sub">
                  <Icon
                    color="gray"
                    cursor="pointer"
                    size={20}
                    value="info"
                    variant="outlined"
                  />
                </Block>
              </Tooltip>
            </Text>
          </DivContainer>
        </Modal.Body>

        <Modal.Footer>
          <Tooltip content={errorText} disabled={!errorText}>
            <span>
              <Button disabled={!!errorText} onClick={this.onSubmit}>
                {this.tr("Complete listing")}
              </Button>
            </span>
          </Tooltip>
        </Modal.Footer>
      </>
    )
  }
}

const DivContainer = styled.div`
  .SellModalContent--dates {
    display: block;

    .SellModalContent--schedule-date {
      margin-right: 0;
    }
  }

  ${sizeMQ({
    phoneXl: css`
      .SellModalContent--dates {
        display: flex;

        .SellModalContent--date {
          flex: 1 1 0;
        }

        .SellModalContent--schedule-date {
          margin-right: 20px;
        }
      }
    `,
  })}
`

export default withData<SellModalContentQuery, BaseProps>(
  withMultiStepFlowContext(SellModalContent),
  graphql`
    query SellModalContentQuery(
      $archetype: ArchetypeInputType!
      $chain: ChainScalar
    ) {
      archetype(archetype: $archetype) {
        asset {
          assetContract {
            address
            chain
          }
          decimals
          relayId
          collection {
            ...SellFees_collection
            paymentAssets(chain: $chain) {
              asset {
                relayId
                assetContract {
                  chain
                }
                decimals
                symbol
                ...Price_data
              }
              relayId
              ...PaymentTokenInputV2_data
            }
            slug
          }
        }
        quantity
        ownedQuantity(identity: {})
      }
    }
  `,
)
