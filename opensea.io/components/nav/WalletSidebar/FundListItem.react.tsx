import React, { memo } from "react"
import { ChainIdentifier, CHAIN_IDENTIFIERS_TO_NAMES } from "../../../constants"
import { useWallet } from "../../../containers/WalletProvider.react"
import Dropdown, {
  RenderDropdownContentProps,
} from "../../../design-system/Dropdown"
import { ListItem } from "../../../design-system/List"
import Tooltip from "../../../design-system/Tooltip"
import UnstyledButton from "../../../design-system/UnstyledButton"
import { useTranslations } from "../../../hooks/useTranslations"
import { trackClickSideBarWalletMoreOptions } from "../../../lib/analytics/events/walletEvents"
import FundItem from "../../common/FundItem"
import Icon from "../../common/Icon.react"
import AddFundsModalV2 from "../../trade/AddFundsModalV2.react"
import SwapModal from "./SwapModal.react"
import { SwapIdentifier } from "./types"
import { isWrappedToken } from "./utils"

type Props = {
  symbol: string
  name?: string
  quantity: string
  chain: ChainIdentifier
  image?: string
  usdPrice?: string
  refetch: () => unknown
  supportedSwaps: ReadonlyArray<SwapIdentifier>
}

const FundListItemBase = memo(function FundListItem({
  image,
  symbol,
  name,
  chain,
  usdPrice,
  quantity,
  refetch,
  supportedSwaps,
}: Props) {
  const { tr } = useTranslations()
  const { chain: userChain } = useWallet()
  const isOnChain = chain === userChain
  const isMaticReverseSwap = chain === "MUMBAI" || chain === "MATIC"
  const from: SwapIdentifier = {
    chain: { identifier: chain },
    symbol,
  }

  const renderSwapItem = ({
    Item,
    close,
    to,
  }: RenderDropdownContentProps & { to: SwapIdentifier }) => {
    const isWrapping = to.chain.identifier === chain
    let actionTitle
    if (isWrapping) {
      if (isWrappedToken(symbol)) {
        actionTitle = "Unwrap"
      } else {
        actionTitle = "Wrap"
      }
    } else {
      actionTitle = `Bridge to ${
        CHAIN_IDENTIFIERS_TO_NAMES[to.chain.identifier]
      }`
    }

    const key = `${to.symbol}-${to.chain}`
    const itemContent = (
      <>
        <Item.Avatar icon="sync" />
        <Item.Content>
          <Item.Title>{actionTitle}</Item.Title>
        </Item.Content>
      </>
    )

    if (isMaticReverseSwap) {
      return (
        <Item href="https://wallet.matic.network/" key={key} onClick={close}>
          {itemContent}
        </Item>
      )
    }

    if (!isOnChain) {
      const tooltip = isWrapping
        ? `Please switch to ${
            CHAIN_IDENTIFIERS_TO_NAMES[chain]
          } chain to ${actionTitle.toLowerCase()} ${symbol}`
        : `Please switch to ${
            CHAIN_IDENTIFIERS_TO_NAMES[chain]
          } chain to bridge to ${
            CHAIN_IDENTIFIERS_TO_NAMES[to.chain.identifier]
          }`

      return (
        <Tooltip content={tooltip} key={key} placement="left">
          <div>
            <Item disabled key={key}>
              {itemContent}
            </Item>
          </div>
        </Tooltip>
      )
    }

    return (
      <SwapModal
        from={from}
        key={key}
        to={to}
        trigger={open => (
          <Item
            key={key}
            onClick={() => {
              open()
              close()
            }}
          >
            {itemContent}
          </Item>
        )}
        onSuccess={refetch}
      />
    )
  }

  const actions = (
    <Dropdown
      content={({ close, List, Item }) => (
        <List>
          <AddFundsModalV2
            trigger={open => (
              <Item
                onClick={() => {
                  open()
                  close()
                }}
              >
                <Item.Avatar icon="add_circle_outline" />
                <Item.Content>
                  <Item.Title>Add {symbol}</Item.Title>
                </Item.Content>
              </Item>
            )}
            variables={{ symbol, chain }}
          />

          {supportedSwaps.map(swap =>
            renderSwapItem({ close, List, Item, to: swap }),
          )}
        </List>
      )}
    >
      <Tooltip content={tr("More")}>
        <UnstyledButton
          onClick={() =>
            trackClickSideBarWalletMoreOptions({
              symbol,
              chain,
            })
          }
        >
          <Icon aria-label="More" value="more_vert" />
        </UnstyledButton>
      </Tooltip>
    </Dropdown>
  )

  return (
    <FundItem
      Item={ListItem}
      actions={actions}
      chain={chain}
      image={image}
      name={name}
      quantity={quantity}
      symbol={symbol}
      usdPrice={usdPrice}
    />
  )
})

const FundListItemSkeleton = memo(function FundListItemSkeleton() {
  return <FundItem.Skeleton actions />
})

export const FundListItem = Object.assign(FundListItemBase, {
  Skeleton: FundListItemSkeleton,
})

export default FundListItem
