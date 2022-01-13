import React, { useContext, useState } from "react"
import { NO_SIMILAR_ITEMS_IMG } from "../../../constants"
import Block from "../../../design-system/Block"
import Gallery, { GalleryVariant } from "../../../design-system/Gallery"
import Text from "../../../design-system/Text"
import { Asset_data } from "../../../lib/graphql/__generated__/Asset_data.graphql"
import { AssetSearchList_data } from "../../../lib/graphql/__generated__/AssetSearchList_data.graphql"
import { PageProps, fragmentize, graphql } from "../../../lib/graphql/graphql"
import { first, flatMap } from "../../../lib/helpers/array"
import { isMultichain, isSupportedChain } from "../../../lib/helpers/chainUtils"
import { selectClassNames } from "../../../lib/helpers/styling"
import { AccountPageContext } from "../../../pages/account"
import Asset from "../../assets/Asset.react"
import { isChainDependantAction } from "../../assets/AssetSelection.react"
import { AssetContextMenuSelection } from "../../common/AssetContextMenu"
import Image from "../../common/Image.react"

export type AssetSearchListAsset = NonNullable<AssetSearchList_data[0]["asset"]>

type AssetSearchListSelectionContext = Omit<
  AssetContextMenuSelection,
  "select"
> & {
  select: (asset: AssetSearchListAsset) => unknown
}

export interface AssetSearchListProps {
  className?: string
  data: AssetSearchList_data | null
  exclude?: string[]
  variant?: GalleryVariant
  singlePage?: boolean
  page: PageProps
  pageSize: number
  selectionContext?: AssetSearchListSelectionContext
  selection?: Array<AssetSearchListAsset>
  showContextMenu?: boolean
  showSellButtons?: boolean
  onClick?: (assetData: Asset_data | null, index: number) => void
  showPlaceholderAssets?: boolean
}

export const AssetSearchList = ({
  className,
  data,
  exclude,
  singlePage,
  variant,
  page,
  pageSize,
  selection,
  showContextMenu,
  showSellButtons,
  selectionContext,
  onClick,
  showPlaceholderAssets,
}: AssetSearchListProps) => {
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false)
  const { exclude: accountsPageExclude } = useContext(AccountPageContext)

  const resultRelayIds = new Set()
  const results = flatMap(
    (data || []).filter(data => {
      if (!data.asset) {
        return true
      }

      if (accountsPageExclude.includes(data.asset.relayId)) {
        return false
      }

      if (exclude?.includes(data.asset.tokenId)) {
        return false
      }

      return true
    }),
    result => {
      const relayId = result.asset?.relayId || result.assetBundle?.relayId
      if (!relayId || resultRelayIds.has(relayId)) {
        return []
      }
      resultRelayIds.add(relayId)
      return [result]
    },
  )

  const items = Array(
    (data ? results.length : pageSize) + (isLoadingNextPage ? pageSize : 0),
  )
    .fill(null)
    .map((_, i) => results[i] ?? null) as (typeof results[number] | null)[]

  if (items.length === 0 && !showPlaceholderAssets) {
    return (
      <Block className={className} paddingTop="24px">
        <Image height={100} url={NO_SIMILAR_ITEMS_IMG} />
        <Text textAlign="center">No items to display</Text>
      </Block>
    )
  }

  return (
    <Block className={className}>
      <Gallery
        evenSidePadding={singlePage}
        getKey={(item, index) =>
          item?.asset?.relayId || item?.assetBundle?.relayId || index
        }
        gridGap={8}
        itemMinWidth={260}
        items={items}
        pagination={
          singlePage
            ? undefined
            : {
                disableLoader: true,
                page,
                size: pageSize,
                onLoad: () => setIsLoadingNextPage(false),
                onLoadStart: () => setIsLoadingNextPage(true),
              }
        }
        variant={variant}
      >
        {({ item, itemWidth, containerWidth, index }) => {
          const isMultichainAssetSelected = selection?.some(a =>
            isMultichain(a.assetContract.chain),
          )
          const selectionContainsDifferentChains = selection?.some(
            a => a.assetContract.chain !== item?.asset?.assetContract.chain,
          )

          const asset = item?.asset

          return (
            <Asset
              className={selectClassNames("AssetSearchList", {
                asset: true,
                "asset-hidden": !!data && !isLoadingNextPage && !item,
              })}
              containerWidth={containerWidth}
              data={showPlaceholderAssets ? null : item}
              isDisabled={
                selectionContext?.action &&
                isChainDependantAction(selectionContext.action) &&
                (!showContextMenu ||
                  !isSupportedChain(asset?.assetContract.chain) ||
                  selectionContainsDifferentChains ||
                  (isMultichainAssetSelected &&
                    selection?.length === 1 &&
                    first(selection)?.relayId !== asset?.relayId))
              }
              isSelected={selection?.some(a => a.relayId === asset?.relayId)}
              selectionContext={
                selectionContext && asset
                  ? {
                      action: selectionContext.action,
                      activate: selectionContext.activate,
                      select: () => selectionContext.select(asset),
                    }
                  : undefined
              }
              showContextMenu={showContextMenu}
              showSellButton={showSellButtons}
              width={itemWidth}
              onClick={assetData => assetData && onClick?.(assetData, index)}
            />
          )
        }}
      </Gallery>
    </Block>
  )
}

export default fragmentize(AssetSearchList, {
  fragments: {
    data: graphql`
      fragment AssetSearchList_data on SearchResultType
      @relay(plural: true)
      @argumentDefinitions(
        identity: { type: "IdentityInputType" }
        shouldShowQuantity: { type: "Boolean", defaultValue: false }
        showContextMenu: { type: "Boolean", defaultValue: false }
      ) {
        asset {
          assetContract {
            address
            chain
          }
          relayId
          tokenId
          ...AssetSelectionItem_data
          ...asset_url
        }
        assetBundle {
          relayId
        }
        ...Asset_data
          @arguments(
            identity: $identity
            shouldShowQuantity: $shouldShowQuantity
            showContextMenu: $showContextMenu
          )
      }
    `,
  },
})
