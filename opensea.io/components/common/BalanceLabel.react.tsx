import React from "react"
import Block from "../../design-system/Block"
import SpaceBetween from "../../design-system/SpaceBetween"
import Text from "../../design-system/Text"
import {
  bn,
  normalizePriceDisplay,
  displayUSD,
} from "../../lib/helpers/numberUtils"

export type BalanceLabelProps = {
  label: string
  symbol: string
  quantity: string
  usdPrice: string
  className?: string
}

const BalanceLabel = ({
  label,
  symbol,
  quantity,
  usdPrice,
  className,
  ...labelProps
}: BalanceLabelProps) => {
  const balanceQuantity = `${normalizePriceDisplay(quantity)} ${symbol}`
  const balanceValue = `($${displayUSD(bn(usdPrice).times(bn(quantity)))} USD)`
  return (
    <SpaceBetween className={className}>
      <Block marginBottom="4px" marginLeft="4px">
        <Text
          as="label"
          className="BalanceLabel--main"
          variant="bold"
          {...labelProps}
        >
          {label}
        </Text>
      </Block>
      <div>
        <Text as="label" data-testid="balance-quantity-label" variant="small">
          Balance: {balanceQuantity}{" "}
        </Text>
        <Text as="label" data-testid="balance-price-label" variant="info">
          {balanceValue}
        </Text>
      </div>
    </SpaceBetween>
  )
}

export default BalanceLabel
