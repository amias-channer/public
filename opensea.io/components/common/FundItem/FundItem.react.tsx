import React, { forwardRef, memo } from "react"
import styled from "styled-components"
import { ChainIdentifier, CHAIN_IDENTIFIERS_TO_NAMES } from "../../../constants"
import ItemComponent from "../../../design-system/Item"
import ItemSkeleton from "../../../design-system/ItemSkeleton"
import { ListItem } from "../../../design-system/List"
import Tooltip from "../../../design-system/Tooltip"
import {
  bn,
  normalizePriceDisplay,
  displayUSD,
} from "../../../lib/helpers/numberUtils"
import { selectClassNames } from "../../../lib/helpers/styling"
import { themeVariant } from "../../../styles/styleUtils"

export type FundItemProps = {
  symbol: string
  chain: ChainIdentifier
  name?: string | null
  quantity?: string
  image?: string | null
  usdPrice?: string | null
  className?: string
  onClick?: () => unknown
  actions?: React.ReactNode
  Item?: typeof ItemComponent | typeof ListItem
}

const FundItemBase = forwardRef<HTMLDivElement | HTMLLIElement, FundItemProps>(
  function FundItem(
    {
      Item = ItemComponent,
      actions,
      symbol,
      chain,
      name,
      quantity,
      image,
      usdPrice,
      className,
      onClick,
    },
    ref,
  ) {
    return (
      <DivContainer>
        <Item
          className={className}
          ref={
            ref as React.ForwardedRef<HTMLDivElement> &
              React.ForwardedRef<HTMLLIElement>
          }
          onClick={onClick}
        >
          {image && (
            <Item.Avatar
              className={selectClassNames("FundItem", {
                "eth-icon": symbol === "ETH" && chain === "ETHEREUM",
              })}
              src={image}
            />
          )}
          <Item.Content>
            <Tooltip content={name}>
              <Item.Title cursor="pointer" width="fit-content">
                {symbol}
              </Item.Title>
            </Tooltip>

            {chain && (
              <Item.Description>
                {CHAIN_IDENTIFIERS_TO_NAMES[chain]}
              </Item.Description>
            )}
          </Item.Content>
          {quantity ? (
            <Item.Side>
              <Item.Title>{normalizePriceDisplay(quantity)}</Item.Title>
              {usdPrice && (
                <Item.Description>
                  ${displayUSD(bn(usdPrice).times(bn(quantity)))} USD
                </Item.Description>
              )}
            </Item.Side>
          ) : null}
          {actions && <Item.Action>{actions}</Item.Action>}
        </Item>
      </DivContainer>
    )
  },
)

const FundItemSkeleton = memo(function FundItemSkeleton({
  actions,
}: Partial<FundItemProps>) {
  return (
    <ItemSkeleton>
      <ItemSkeleton.Avatar outline />
      <ItemSkeleton.Content>
        <ItemSkeleton.Title />
        <ItemSkeleton.Description />
      </ItemSkeleton.Content>

      <ItemSkeleton.Side>
        <ItemSkeleton.Title direction="rtl" />
        <ItemSkeleton.Description direction="rtl" />
      </ItemSkeleton.Side>

      {actions && <ItemSkeleton.Action height="24px" width="24px" />}
    </ItemSkeleton>
  )
})

const DivContainer = styled.div`
  .FundItem--eth-icon {
    ${themeVariant({
      variants: {
        dark: {
          filter: "brightness(3)",
        },
      },
    })}
  }
`

export const FundItem = Object.assign(FundItemBase, {
  Skeleton: FundItemSkeleton,
})

export default FundItem
