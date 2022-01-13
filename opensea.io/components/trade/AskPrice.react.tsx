import React from "react"
import { AskPrice_data } from "../../lib/graphql/__generated__/AskPrice_data.graphql"
import { fragmentize, getFirstNode, graphql } from "../../lib/graphql/graphql"
import { BigNumber } from "../../lib/helpers/numberUtils"
import { getTotalPrice } from "../../lib/helpers/price"
import { readQuantity } from "../../lib/helpers/quantity"
import AssetQuantity from "../assets/AssetQuantity.react"
import { PriceProps } from "../assets/Price.react"

interface Props
  extends Pick<PriceProps, "symbolVariant" | "variant" | "secondary"> {
  className?: string
  data: AskPrice_data
  mapQuantity?: (quantity: BigNumber) => BigNumber
  size?: number
  isTotal?: boolean
  partialQuantity?: BigNumber
}

class AskPrice extends React.Component<Props> {
  interval: number | undefined

  componentDidMount() {
    this.interval = window.setInterval(() => this.forceUpdate(), 1000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  render() {
    const {
      className,
      data,
      variant,
      secondary,
      mapQuantity,
      size,
      isTotal,
      partialQuantity,
      symbolVariant,
    } = this.props
    const askPrice = getFirstNode(data.takerAssetBundle?.assetQuantities)
    const assetQuantity = getFirstNode(data.makerAssetBundle?.assetQuantities)
    if (!askPrice || !assetQuantity) {
      return null
    }
    const { dutchAuctionFinalPrice, openedAt, priceFnEndedAt } = data
    const getDisplayPrice = (quantity: BigNumber) => {
      return getTotalPrice(
        quantity,
        dutchAuctionFinalPrice,
        openedAt,
        priceFnEndedAt,
      )
    }
    return (
      <AssetQuantity
        className={className}
        data={askPrice}
        mapQuantity={q => {
          const result = isTotal
            ? partialQuantity
              ? getDisplayPrice(q)
                  .div(readQuantity(assetQuantity))
                  .times(partialQuantity)
              : getDisplayPrice(q)
            : getDisplayPrice(q).div(readQuantity(assetQuantity))
          return mapQuantity?.(result) || result
        }}
        secondary={secondary}
        size={size}
        symbolVariant={symbolVariant}
        variant={variant}
      />
    )
  }
}

export default fragmentize(AskPrice, {
  fragments: {
    data: graphql`
      fragment AskPrice_data on OrderV2Type {
        dutchAuctionFinalPrice
        openedAt
        priceFnEndedAt
        makerAssetBundle {
          assetQuantities(first: 30) {
            edges {
              node {
                ...quantity_data
              }
            }
          }
        }
        takerAssetBundle {
          assetQuantities(first: 1) {
            edges {
              node {
                ...AssetQuantity_data
              }
            }
          }
        }
      }
    `,
  },
})
