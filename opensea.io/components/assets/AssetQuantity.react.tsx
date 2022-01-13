import React from "react"
import { AssetQuantity_data } from "../../lib/graphql/__generated__/AssetQuantity_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { BigNumber, bn } from "../../lib/helpers/numberUtils"
import Price, { PriceProps } from "./Price.react"

interface Props
  extends Pick<
    PriceProps,
    "color" | "symbolVariant" | "variant" | "secondary"
  > {
  className?: string
  data: AssetQuantity_data
  mapQuantity?: (quantity: BigNumber) => BigNumber // Post-process the quantity value in the data.
  size?: number
  isInline?: boolean
  showWeth?: boolean
}

const AssetQuantity = ({
  className,
  data: { asset, quantity },
  mapQuantity,
  size,
  variant,
  secondary,
  isInline,
  showWeth,
  symbolVariant,
  color,
}: Props) => (
  <Price
    className={className}
    color={color}
    data={asset}
    isInline={isInline}
    quantity={bn(mapQuantity ? mapQuantity(bn(quantity)) : quantity)}
    secondary={secondary}
    showWeth={showWeth}
    size={size}
    symbolVariant={symbolVariant}
    variant={variant}
  />
)

export default fragmentize(AssetQuantity, {
  fragments: {
    data: graphql`
      fragment AssetQuantity_data on AssetQuantityType {
        asset {
          ...Price_data
        }
        quantity
      }
    `,
  },
})
