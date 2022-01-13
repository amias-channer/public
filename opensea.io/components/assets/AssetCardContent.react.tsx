import React, { Suspense } from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import { IS_SERVER } from "../../constants"
import Block from "../../design-system/Block"
import Flex from "../../design-system/Flex"
import Skeleton from "../../design-system/Skeleton"
import UnstyledButton from "../../design-system/UnstyledButton"
import { AssetCardContent_asset$key } from "../../lib/graphql/__generated__/AssetCardContent_asset.graphql"
import { AssetCardContent_assetBundle$key } from "../../lib/graphql/__generated__/AssetCardContent_assetBundle.graphql"
import { getNodes, graphql } from "../../lib/graphql/graphql"
import AssetContextMenu, {
  AssetContextMenuSelection,
} from "../common/AssetContextMenu"
import Carousel from "../common/Carousel.react"
import CenterAligned from "../common/CenterAligned.react"
import Icon from "../common/Icon.react"
import AssetMedia from "./AssetMedia.react"

type Props = {
  assetDataKey: AssetCardContent_asset$key | null
  assetBundleDataKey: AssetCardContent_assetBundle$key | null
  size: number
  showContextMenu?: boolean
  selectionContext?: AssetContextMenuSelection
}

export const AssetCardContent = ({
  assetDataKey,
  assetBundleDataKey,
  size,
  showContextMenu,
  selectionContext,
}: Props) => {
  const asset = useFragment(
    graphql`
      fragment AssetCardContent_asset on AssetType
      @argumentDefinitions(
        showContextMenu: { type: "Boolean", defaultValue: false }
      ) {
        relayId
        name
        ...AssetMedia_asset

        assetContract {
          address
          chain
          openseaVersion
        }
        tokenId
        collection {
          slug
        }
        isDelisted
        ...AssetContextMenu_data
          @arguments(identity: {})
          @include(if: $showContextMenu)
      }
    `,
    assetDataKey,
  )

  const assetBundle = useFragment(
    graphql`
      fragment AssetCardContent_assetBundle on AssetBundleType {
        assetQuantities(first: 18) {
          edges {
            node {
              asset {
                relayId
                ...AssetMedia_asset
              }
            }
          }
        }
      }
    `,
    assetBundleDataKey,
  )

  const renderContent = () => {
    if (asset) {
      return <AssetMedia asset={asset} size={size} useCustomPlayButton />
    }

    if (assetBundle) {
      const assets = getNodes(assetBundle.assetQuantities).map(aq => aq.asset)
      return (
        <Carousel dotType="dot" dots>
          {assets.map(asset => (
            <AssetMedia
              asset={asset}
              key={asset.relayId}
              size={size}
              useCustomPlayButton
            />
          ))}
        </Carousel>
      )
    }

    return (
      <Skeleton>
        <Skeleton.Block />
      </Skeleton>
    )
  }

  const renderContextMenu = () => {
    if (!asset || !showContextMenu || IS_SERVER) {
      return null
    }

    return (
      <Suspense fallback={null}>
        <AssetContextMenu dataKey={asset} selection={selectionContext}>
          <CenterAligned
            className="AssetCardContent--button AssetCardContent--select"
            onClick={event => {
              event.preventDefault()
            }}
          >
            <UnstyledButton
              onClick={event => {
                event.stopPropagation()
                event.preventDefault()
              }}
            >
              <Icon aria-label="More" value="more_vert" />
            </UnstyledButton>
          </CenterAligned>
        </AssetContextMenu>
      </Suspense>
    )
  }

  const renderActions = () => {
    return (
      <Flex
        className="AssetCardContent--actions"
        position="absolute"
        right="12px"
        top="12px"
        zIndex={1}
      >
        {renderContextMenu()}
      </Flex>
    )
  }

  return (
    <StyledContainer
      padding="0 8px"
      position="relative"
      style={{ height: size, width: size }}
    >
      {renderActions()}
      {renderContent()}
    </StyledContainer>
  )
}

const StyledContainer = styled(Block)`
  border-radius: ${props => props.theme.borderRadius.default};

  .AssetCardContent--actions {
    display: none;

    .AssetCardContent--button {
      background-color: ${props => props.theme.colors.card};
      border-radius: ${props => props.theme.borderRadius.default};
      color: ${props => props.theme.colors.text.body};

      opacity: 0.9;
      margin-left: 4px;
      padding: 4px;

      .AssetCardContent--link {
        display: flex;
        color: inherit;
      }

      &:hover {
        box-shadow: ${props => props.theme.shadow};
        opacity: 1;
      }
    }
  }
`

export default AssetCardContent
