import React, { memo, ReactElement } from "react"
import moment from "moment"
import { useFragment } from "react-relay"
import styled, { css } from "styled-components"
import { CHAIN_IDENTIFIERS_TO_NAMES } from "../../constants"
import Block from "../../design-system/Block"
import Flex from "../../design-system/Flex"
import Skeleton from "../../design-system/Skeleton"
import SpaceBetween from "../../design-system/SpaceBetween"
import Tooltip from "../../design-system/Tooltip"
import { useTranslations } from "../../hooks/useTranslations"
import { AssetCardFooter_asset$key } from "../../lib/graphql/__generated__/AssetCardFooter_asset.graphql"
import { AssetCardFooter_assetBundle$key } from "../../lib/graphql/__generated__/AssetCardFooter_assetBundle.graphql"
import { getNodes, graphql } from "../../lib/graphql/graphql"
import { fromISO8601 } from "../../lib/helpers/datetime"
import { bn, quantityDisplay } from "../../lib/helpers/numberUtils"
import { getTotalPrice } from "../../lib/helpers/price"
import { selectClassNames } from "../../lib/helpers/styling"
import { themeVariant } from "../../styles/styleUtils"
import { HUES } from "../../styles/themes"
import { AnnotationImage } from "../common/AnnotationImage.react"
import Badge from "../common/Badge.react"
import Icon from "../common/Icon.react"
import { sizeMQ } from "../common/MediaQuery.react"
import VerifiedIcon from "../common/VerifiedIcon.react"
import KlaytnLogo from "../svgs/KlaytnLogo.react"
import PolygonLogo from "../svgs/PolygonLogo.react"
import AssetQuantity from "./AssetQuantity.react"

type Props = {
  assetDataKey: AssetCardFooter_asset$key | null
  assetBundleDataKey: AssetCardFooter_assetBundle$key | null
}

const getTokenIdSuffix = (tokenId: string) =>
  tokenId.substring(tokenId.length - 8)

const EXPIRATION_DURATION_IN_MILLISECONDS = moment
  .duration(1, "week")
  .asMilliseconds()
const EXPIRING_SOON_DURATION_IN_MILLISECONDS = moment
  .duration(6, "hour")
  .asMilliseconds()
const NEW_ASSET_DURATION_IN_MILLISECONDS = moment
  .duration(1, "day")
  .asMilliseconds()

const CHAIN_TO_LOGO: Record<string, ReactElement> = {
  MATIC: <PolygonLogo fill="gray" width={18} />,
  KLAYTN: <KlaytnLogo fill="gray" width={18} />,
}

const AssetCardFooterBase = ({ assetDataKey, assetBundleDataKey }: Props) => {
  const { tr } = useTranslations()
  const asset = useFragment(
    graphql`
      fragment AssetCardFooter_asset on AssetType
      @argumentDefinitions(
        identity: { type: "IdentityInputType", defaultValue: {} }
        shouldShowQuantity: { type: "Boolean", defaultValue: false }
      ) {
        ownedQuantity(identity: $identity) @include(if: $shouldShowQuantity)
        name
        tokenId
        collection {
          name
          isVerified
        }
        hasUnlockableContent
        isDelisted
        isFrozen
        assetContract {
          address
          chain
          openseaVersion
        }
        assetEventData {
          firstTransfer {
            timestamp
          }
          lastSale {
            unitPriceQuantity {
              ...AssetQuantity_data
            }
          }
        }
        decimals
        orderData {
          bestBid {
            orderType
            paymentAssetQuantity {
              ...AssetQuantity_data
            }
          }
          bestAsk {
            closedAt
            orderType
            dutchAuctionFinalPrice
            openedAt
            priceFnEndedAt
            quantity
            decimals
            paymentAssetQuantity {
              quantity
              ...AssetQuantity_data
            }
          }
        }
      }
    `,
    assetDataKey,
  )

  const assetBundle = useFragment(
    graphql`
      fragment AssetCardFooter_assetBundle on AssetBundleType {
        name
        assetCount
        assetQuantities(first: 18) {
          edges {
            node {
              asset {
                collection {
                  name
                  relayId
                  isVerified
                }
              }
            }
          }
        }
        assetEventData {
          lastSale {
            unitPriceQuantity {
              ...AssetQuantity_data
            }
          }
        }
        orderData {
          bestBid {
            orderType
            paymentAssetQuantity {
              ...AssetQuantity_data
            }
          }
          bestAsk {
            closedAt
            orderType
            dutchAuctionFinalPrice
            openedAt
            priceFnEndedAt
            quantity
            decimals
            paymentAssetQuantity {
              quantity
              ...AssetQuantity_data
            }
          }
        }
      }
    `,
    assetBundleDataKey,
  )

  const getCollectionName = () => {
    if (asset) {
      return asset.collection.name
    }

    if (assetBundle) {
      const nameTuples: Array<[string, string]> = getNodes(
        assetBundle.assetQuantities,
      ).map(aq => [aq.asset.collection.relayId, aq.asset.collection.name])
      const nameMap = new Map(nameTuples)
      if (nameMap.size === 1) {
        return nameTuples[0][1]
      }
    }
    return ""
  }

  const isCollectionVerified = () => {
    if (asset) {
      return asset.collection.isVerified
    }

    if (assetBundle) {
      const quantities = getNodes(assetBundle.assetQuantities)
      const collectionIds = new Set(
        quantities.map(aq => aq.asset.collection.relayId),
      )
      if (collectionIds.size === 1) {
        return quantities[0].asset.collection.isVerified
      }
    }
    return false
  }

  const renderPrice = () => {
    const orderData = (asset || assetBundle)?.orderData
    const bestAsk = orderData?.bestAsk
    const bestBid = orderData?.bestBid

    if (asset?.isDelisted) {
      return null
    }

    if (bestAsk?.orderType === "ENGLISH") {
      return bestBid
        ? bestBid.paymentAssetQuantity && (
            <div className="AssetCardFooter--price">
              <div className="AssetCardFooter--price-header">
                {tr("Top Bid")}
              </div>
              <AssetQuantity
                className="AssetCardFooter--price-amount"
                data={bestBid.paymentAssetQuantity}
                size={14}
              />
            </div>
          )
        : bestAsk.paymentAssetQuantity && (
            <div className="AssetCardFooter--price">
              <div className="AssetCardFooter--price-header">
                {tr("Min Bid")}
              </div>
              <AssetQuantity
                className="AssetCardFooter--price-amount"
                data={bestAsk.paymentAssetQuantity}
                size={14}
              />
            </div>
          )
    }
    if (bestAsk && bestAsk.paymentAssetQuantity) {
      const { dutchAuctionFinalPrice, openedAt, priceFnEndedAt } = bestAsk
      return (
        <div className="AssetCardFooter--price">
          <div className="AssetCardFooter--price-header">{tr("Price")}</div>
          <AssetQuantity
            className="AssetCardFooter--price-amount"
            data={bestAsk.paymentAssetQuantity}
            mapQuantity={q =>
              bestAsk.quantity
                ? getTotalPrice(
                    q,
                    dutchAuctionFinalPrice,
                    openedAt,
                    priceFnEndedAt,
                  ).div(
                    bn(
                      bestAsk.quantity,
                      bestAsk.decimals ? parseInt(bestAsk.decimals) : undefined,
                    ),
                  )
                : getTotalPrice(
                    q,
                    dutchAuctionFinalPrice,
                    openedAt,
                    priceFnEndedAt,
                  )
            }
            size={14}
          />
        </div>
      )
    }
    return bestBid
      ? bestBid.paymentAssetQuantity && (
          <div className="AssetCardFooter--price">
            <div className="AssetCardFooter--price-header">
              {tr("Best Offer")}
            </div>
            <AssetQuantity
              className="AssetCardFooter--price-amount"
              data={bestBid.paymentAssetQuantity}
              size={14}
            />
          </div>
        )
      : null
  }

  const renderAnnotations = () => {
    const orderData = (asset || assetBundle)?.orderData
    const bestAsk = orderData?.bestAsk
    const bestBid = orderData?.bestBid
    const firstTransferTimestamp =
      asset?.assetEventData.firstTransfer?.timestamp
    const lastSale = (asset || assetBundle)?.assetEventData.lastSale
    const expiration = bestAsk?.closedAt
      ? fromISO8601(bestAsk.closedAt)
      : undefined
    const expirationDuration = expiration?.diff(moment())
    const quantity = asset?.ownedQuantity
    const quantityDisplayed = quantity
      ? bn(quantity, asset?.decimals || 0)
      : undefined
    const chain = asset?.assetContract.chain

    if (asset?.isDelisted) {
      return (
        <div className="AssetCardFooter--annotations">
          <div className="AssetCardFooter--annotation-badges">
            <div className="AssetCardFooter--annotations-item">
              <div className="AssetCardFooter--annotations-item-text">
                <Badge
                  className="AssetCardFooter--annotation-pill"
                  icon="cancel"
                  text={"Delisted"}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }

    const chainLogo = chain ? CHAIN_TO_LOGO[chain] : null
    return (
      <div className="AssetCardFooter--annotations">
        <Flex>
          {chain ? (
            <Tooltip
              content={`Blockchain: ${CHAIN_IDENTIFIERS_TO_NAMES[chain]}`}
            >
              {chainLogo ? (
                <div className="AssetCardFooter--chain--container">
                  {chainLogo}
                </div>
              ) : undefined}
            </Tooltip>
          ) : null}
          {asset?.hasUnlockableContent && (
            <Tooltip content={tr("Includes unlockable")}>
              <AnnotationImage
                hoverColor={HUES.seaBlue}
                icon={quantityDisplayed ? "lock_open" : "lock"}
              />
            </Tooltip>
          )}
          {asset?.isFrozen && (
            <Tooltip content={tr("Metadata: Frozen")}>
              <AnnotationImage hoverColor={HUES.aqua} icon="ac_unit" />
            </Tooltip>
          )}
          {assetBundle?.assetCount && (
            <Tooltip
              content={tr(
                `Bundle: ${assetBundle?.assetCount.toString()} items`,
              )}
            >
              <AnnotationImage icon="filter" iconSize={17} variant="round" />
            </Tooltip>
          )}
          {quantityDisplayed && bn(quantityDisplayed).greaterThan(bn(1)) ? (
            <Block data-testid="OwnedQuantity" marginRight="8px">
              <Tooltip
                content={`${quantityDisplay(quantityDisplayed)} copies owned`}
              >
                <Badge
                  icon="filter_none"
                  text={`x${quantityDisplay(quantityDisplayed)}`}
                />
              </Tooltip>
            </Block>
          ) : null}
          {firstTransferTimestamp &&
          moment().diff(fromISO8601(firstTransferTimestamp)) <
            NEW_ASSET_DURATION_IN_MILLISECONDS ? (
            <Badge
              className="AssetCardFooter--pill AssetCardFooter--pill-new"
              text={tr("New")}
            />
          ) : null}
        </Flex>
        {expiration &&
        expirationDuration &&
        expirationDuration > 0 &&
        expirationDuration < EXPIRATION_DURATION_IN_MILLISECONDS ? (
          <div
            className={selectClassNames("AssetCardFooter", {
              "annotations-expiration": true,
              ...(expiration.diff(moment()) <
              EXPIRING_SOON_DURATION_IN_MILLISECONDS
                ? {
                    "expiring-soon": true,
                    pill: true,
                  }
                : {}),
            })}
          >
            <Icon
              className="AssetCardFooter--annotations-icon"
              value="timelapse"
            />
            <div>{expiration.toNow(true)} left</div>
          </div>
        ) : lastSale?.unitPriceQuantity ? (
          <div className="AssetCardFooter--annotations-item">
            <div className="AssetCardFooter--annotations-item-text">
              {tr("Last")}
            </div>
            <AssetQuantity data={lastSale.unitPriceQuantity} size={11} />
          </div>
        ) : bestAsk && bestBid ? (
          bestBid.paymentAssetQuantity && (
            <div className="AssetCardFooter--annotations-item">
              <div className="AssetCardFooter--annotations-item-text">
                {tr("Offer for")}
              </div>
              <AssetQuantity data={bestBid.paymentAssetQuantity} size={11} />
            </div>
          )
        ) : null}
      </div>
    )
  }

  return (
    <StyledContainer flexDirection="column" padding="12px 16px">
      <SpaceBetween>
        <Block flex="2 0" minWidth={0}>
          <div className="AssetCardFooter--collection">
            {getCollectionName()}
            {isCollectionVerified() && (
              <Tooltip content={tr("Verified Collection")}>
                <div className="AssetCardFooter--collection-state-icon-container">
                  <VerifiedIcon
                    className="AssetCardFooter--collection-state-icon"
                    size={"small"}
                  />
                </div>
              </Tooltip>
            )}
          </div>
          <div className="AssetCardFooter--name">
            {(asset || assetBundle)?.name ||
              (asset?.tokenId && getTokenIdSuffix(asset.tokenId))}
          </div>
        </Block>
        {renderPrice()}
      </SpaceBetween>
      {renderAnnotations()}
    </StyledContainer>
  )
}

const AssetCardFooterSkeleton = memo(function AssetCardFooterSkeleton() {
  return (
    <Skeleton padding="12px 16px">
      <Skeleton.Row>
        <Skeleton.Line height="14px" width="35%" />
        <Skeleton.Line direction="rtl" height="14px" width="20%" />
      </Skeleton.Row>
      <Skeleton.Row>
        <Skeleton.Line height="14px" width="50%" />
        <Skeleton.Line direction="rtl" height="14px" width="25%" />
      </Skeleton.Row>
      <Skeleton.Row>
        <Skeleton.Line height="14px" width="35%" />
        <Skeleton.Line direction="rtl" height="14px" width="20%" />
      </Skeleton.Row>
    </Skeleton>
  )
})

const StyledContainer = styled(SpaceBetween)`
  .AssetCardFooter--collection {
    color: ${props => props.theme.colors.text.subtle};
    font-size: 2.67vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;

    .AssetCardFooter--collection-state-icon-container {
      overflow: hidden;
      width: 14px;
      height: 14px;
      margin-left: 3px;
      display: flex;
    }

    .AssetCardFooter--collection-state-icon {
      width: 14px;
      height: 14px;
    }
  }

  .AssetCardFooter--name {
    color: ${props => props.theme.colors.text.body};
    font-size: 2.93vw;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .AssetCardFooter--price {
    flex: 1 0;
    max-width: 50%;
    align-items: flex-end;
    flex-direction: column;
    display: flex;

    .AssetCardFooter--price-header {
      color: ${props => props.theme.colors.text.subtle};
      font-size: 2.67vw;
      text-align: right;
    }

    .AssetCardFooter--price-amount {
      font-size: 3.47vw;
      height: 3.47vw;
      justify-content: flex-end;
    }
  }

  .AssetCardFooter--annotations {
    display: flex;
    justify-content: space-between;
    font-size: 2.44vw;
    font-weight: 500;
    line-height: 1;
    margin-top: 12px;

    .AssetCardFooter--chain--container {
      margin-right: 4px;
      ${({ theme }) =>
        themeVariant({
          variants: {
            dark: {
              svg: {
                fill: theme.colors.gray,
              },
              "&:hover svg": {
                fill: theme.colors.fog,
              },
            },
            light: {
              svg: {
                fill: theme.colors.gray,
              },
              "&:hover svg": {
                fill: theme.colors.oil,
              },
            },
          },
        })}
    }

    .AssetCardFooter--pill {
      align-items: center;
      background-color: ${props => props.theme.colors.gray};
      border-radius: 4px;
      color: ${props => props.theme.colors.charcoal};
      display: flex;
      margin-left: 0.25em;

      &.AssetCardFooter--pill-new {
        background-color: #23dc7d;
        color: white;

        .AssetCardFooter--annotations-icon {
          color: white;
        }
      }

      &.AssetCardFooter--expiring-soon {
        background-color: transparent;
      }
    }

    .AssetCardFooter--annotations-expiration {
      align-items: center;
      color: ${props => props.theme.colors.text.subtle};
      display: flex;
      margin-left: auto;
    }

    .AssetCardFooter--annotations-icon {
      color: ${props => props.theme.colors.text.subtle};
      font-size: 2.67vw;
      margin-right: 0.25em;
    }

    .AssetCardFooter--annotations-item {
      align-items: center;
      color: ${props => props.theme.colors.text.subtle};
      display: flex;
      margin-left: auto;

      .AssetCardFooter--annotations-item-text {
        margin-right: 0.5em;
      }
    }
  }

  ${sizeMQ({
    small: css`
      padding: 12px;

      .AssetCardFooter--collection {
        font-size: 11px;
      }

      .AssetCardFooter--name {
        font-size: 12px;
        line-height: 18px;
        letter-spacing: 0.1px;
      }

      .AssetCardFooter--price {
        .AssetCardFooter--price-header {
          font-size: 11px;
        }

        .AssetCardFooter--price-amount {
          font-size: 14px;
          height: initial;
        }
      }

      .AssetCardFooter--annotations {
        font-size: 11px;

        .AssetCardFooter--pill {
          background-color: ${props => props.theme.colors.gray}88;
        }

        .AssetCardFooter--annotations-icon {
          font-size: 14px;
        }
      }
    `,
  })}
`

export const AssetCardFooter = Object.assign(AssetCardFooterBase, {
  Skeleton: AssetCardFooterSkeleton,
})

export default AssetCardFooter
