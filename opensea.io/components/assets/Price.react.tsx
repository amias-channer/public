import React from "react"
import styled from "styled-components"
import { CHAIN_IDENTIFIERS_TO_NAMES, WETH_URL } from "../../constants"
import { Avatar } from "../../design-system/Avatar"
import Block from "../../design-system/Block"
import Tooltip from "../../design-system/Tooltip"
import { Price_data } from "../../lib/graphql/__generated__/Price_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { isMultichain } from "../../lib/helpers/chainUtils"
import {
  BigNumber,
  bn,
  display,
  displayUSD,
} from "../../lib/helpers/numberUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import { UnreachableCaseError } from "../../lib/helpers/type"
import { themeVariant } from "../../styles/styleUtils"
import ExternalLink from "../common/ExternalLink.react"
import Overflow from "../common/Overflow.react"

export interface PriceProps {
  className?: string
  data: Price_data
  variant?: "token" | "fiat"
  secondary?: boolean
  isInline?: boolean
  quantity: BigNumber
  size?: number
  showWeth?: boolean
  symbolVariant?: "raw" | "avatar" | "both"
  color?: string
}

const Price = ({
  className,
  data: {
    decimals,
    imageUrl,
    symbol,
    usdSpotPrice,
    assetContract: { blockExplorerLink, chain },
  },
  quantity,
  size,
  variant = "token",
  secondary,
  isInline,
  symbolVariant = "avatar",
  color,
}: PriceProps) => {
  const price = bn(quantity, decimals)
  switch (variant) {
    case "fiat": {
      if (usdSpotPrice === null) {
        return null
      }
      const fiatPrice = price.times(usdSpotPrice)
      const fiatPriceDisplay = fiatPrice.isZero()
        ? "$0.00"
        : fiatPrice < bn(0.01)
        ? "< $0.01"
        : `$${displayUSD(fiatPrice)}`

      return (
        <DivContainer className={className} color={color}>
          <Overflow
            className={selectClassNames("Price", {
              "fiat-amount": true,
              "fiat-amount-secondary": secondary,
            })}
          >
            {secondary ? `(${fiatPriceDisplay})` : fiatPriceDisplay}
          </Overflow>
        </DivContainer>
      )
    }
    case "token": {
      const sizeToUse = size ?? 16

      return (
        <DivContainer
          className={selectClassNames(
            "Price",
            { main: true, isInline },
            className,
          )}
          color={color}
        >
          {symbolVariant === "raw" ? null : (
            <Tooltip
              content={
                symbol
                  ? `${symbol}${
                      isMultichain(chain)
                        ? ` on ${CHAIN_IDENTIFIERS_TO_NAMES[chain]}`
                        : ""
                    }`
                  : "Unknown currency"
              }
            >
              <Block cursor="pointer">
                <ExternalLink
                  url={symbol === "WETH" ? WETH_URL : blockExplorerLink}
                >
                  <Avatar
                    className={selectClassNames("Price", {
                      "eth-icon": symbol === "ETH" && chain === "ETHEREUM",
                    })}
                    size={sizeToUse}
                    src={imageUrl ?? ""}
                  />
                </ExternalLink>
              </Block>
            </Tooltip>
          )}
          <Overflow className="Price--amount">
            {display(price, symbol || undefined)}{" "}
            <span className="Price--raw-symbol">
              {symbolVariant === "avatar" ? "" : symbol}
            </span>
          </Overflow>
        </DivContainer>
      )
    }

    default:
      throw new UnreachableCaseError(variant)
  }
}

export default fragmentize(Price, {
  fragments: {
    data: graphql`
      fragment Price_data on AssetType {
        decimals
        imageUrl
        symbol
        usdSpotPrice
        assetContract {
          blockExplorerLink
          chain
        }
      }
    `,
  },
})

const DivContainer = styled.div<{ color?: string }>`
  color: ${props => props.color || props.theme.colors.text.body};
  width: fit-content;
  max-width: 100%;

  &.Price--main {
    align-items: center;
    display: flex;
    font-weight: 600;
  }

  &.Price--isInline {
    display: inline-flex;
  }

  .Price--amount {
    margin-left: 0.3em;
    width: 100%;
  }

  .Price--raw-symbol {
    font-weight: normal;
  }

  .Price--fiat-amount {
    font-weight: normal;
  }
  .Price--fiat-amount-secondary {
    color: ${props => props.theme.colors.text.subtle};
  }

  .Price--eth-icon {
    ${themeVariant({
      variants: {
        dark: {
          filter: "brightness(3)",
        },
      },
    })}
  }
`
