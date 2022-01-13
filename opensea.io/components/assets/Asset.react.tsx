import React from "react"
import styled, { css } from "styled-components"
import AssetActions from "../../actions/assets"
import Modal from "../../design-system/Modal"
import { Asset_data } from "../../lib/graphql/__generated__/Asset_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { getAssetUrl } from "../../lib/helpers/asset"
import { selectClassNames } from "../../lib/helpers/styling"
import { dispatch } from "../../store"
import { $blue } from "../../styles/variables"
import { AssetContextMenuSelection } from "../common/AssetContextMenu"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"
import DelistedNoticeModal from "../modals/DelistedNoticeModal.react"
import AssetCardContent from "./AssetCardContent.react"
import AssetCardFooter from "./AssetCardFooter.react"
import AssetCardHeader from "./AssetCardHeader.react"

interface Props {
  className?: string
  data: Asset_data | null
  isDisabled?: boolean
  isSelected?: boolean
  showContextMenu?: boolean
  showSellButton?: boolean
  width: number
  containerWidth: number
  selectionContext?: AssetContextMenuSelection
  onClick?: (assetDataKey: Asset_data | null) => void
}

const BORDER_WIDTH = 1
const BORDER_GAP = BORDER_WIDTH * 2

const Asset = ({
  data,
  width,
  isSelected,
  showContextMenu,
  className,
  isDisabled,
  containerWidth,
  selectionContext,
  onClick,
}: Props) => {
  const isSelectionActive = Boolean(selectionContext?.action)

  const renderContent = () => {
    return (
      <AssetCardContent
        assetBundleDataKey={data?.assetBundle ?? null}
        assetDataKey={data?.asset ?? null}
        selectionContext={selectionContext}
        showContextMenu={showContextMenu && !isSelectionActive}
        size={width - BORDER_GAP}
      />
    )
  }

  const renderFooter = () => {
    if (!data) {
      return <AssetCardFooter.Skeleton />
    }
    return (
      <AssetCardFooter
        assetBundleDataKey={data.assetBundle ?? null}
        assetDataKey={data.asset ?? null}
      />
    )
  }

  const renderHeader = () => {
    if (data?.assetBundle) {
      return <AssetCardHeader.Container />
    } else if (data?.asset) {
      return <AssetCardHeader dataKey={data?.asset} />
    } else {
      return <AssetCardHeader.Skeleton />
    }
  }

  const assetCard = (
    <>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </>
  )

  const isHidingAction =
    selectionContext?.action === "hide" || selectionContext?.action === "unhide"

  return (
    <DivContainer
      className={selectClassNames(
        "Asset",
        { isDisabled, isSelected, isSelectionActive, loaded: !!data },
        className,
      )}
      style={{ width: containerWidth === 0 ? "100%" : width }}
    >
      {data?.asset?.isDelisted ? (
        <Modal
          closable={false}
          disabled={isHidingAction}
          trigger={open => (
            <div
              className={selectClassNames("Asset", {
                anchor: true,
                delisted: true,
              })}
              onClick={event => {
                if (selectionContext && isHidingAction) {
                  event.preventDefault()
                  selectionContext.select()
                } else {
                  open()
                }
              }}
            >
              {assetCard}
            </div>
          )}
        >
          {onClose => (
            <DelistedNoticeModal variant="account" onClose={onClose} />
          )}
        </Modal>
      ) : (
        <>
          <Link
            className={selectClassNames("Asset", {
              anchor: true,
              "placeholder-background": !data,
            })}
            href={
              data?.asset
                ? getAssetUrl(data.asset)
                : data?.assetBundle
                ? `/bundles/${data.assetBundle.slug}`
                : undefined
            }
            onClick={event => {
              if (isSelectionActive && selectionContext) {
                event.preventDefault()
                selectionContext.select()
              } else if (onClick) {
                onClick(data)
              } else if (data?.asset) {
                // TODO: Temp code to use old asset page
                dispatch(AssetActions.bootstrapV2(data.asset))
              }
            }}
          >
            {assetCard}
          </Link>
        </>
      )}

      {isSelected && <Icon className="Asset--selected-icon" value="check" />}
    </DivContainer>
  )
}

export default fragmentize(Asset, {
  fragments: {
    data: graphql`
      fragment Asset_data on SearchResultType
      @argumentDefinitions(
        identity: { type: "IdentityInputType", defaultValue: {} }
        shouldShowQuantity: { type: "Boolean", defaultValue: false }
        showContextMenu: { type: "Boolean", defaultValue: false }
      ) {
        asset {
          assetContract {
            chain
          }
          isDelisted
          ...AssetCardHeader_data
          ...AssetCardContent_asset
            @arguments(showContextMenu: $showContextMenu)
          ...AssetCardFooter_asset
            @arguments(
              identity: $identity
              shouldShowQuantity: $shouldShowQuantity
            )
          ...AssetMedia_asset
          ...asset_url
          ...itemEvents_data
        }

        assetBundle {
          slug
          ...AssetCardContent_assetBundle
          ...AssetCardFooter_assetBundle
        }
      }
    `,
  },
})

const DivContainer = styled.article`
  height: 100%;
  background-color: ${props => props.theme.colors.card};
  border: ${BORDER_WIDTH}px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  position: relative;

  &:hover {
    box-shadow: ${props => props.theme.shadow};
    transition: 0.1s;
  }

  &.Asset--isSelectionActive {
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }

  &.Asset--isSelected {
    opacity: 1;
    box-shadow: 0 0 2px 2px ${$blue};
  }

  &.Asset--isDisabled {
    opacity: 0.3;
    pointer-events: none;

    &:hover {
      opacity: 0.3;
    }

    .Asset--anchor {
      cursor: default;
    }
  }

  .Asset--anchor {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    &.Asset--placeholder-background {
      background: ${props => props.theme.colors.card};
    }

    .Asset--bundle-images {
      height: 64%;

      .Asset--pill {
        align-items: center;
        border-radius: 4px;
        display: flex;
        padding: 2px 4px;
        position: absolute;
        font-size: 11px;
        top: 6px;
        left: 6px;

        .Asset--bundle-icon {
          margin-right: 0.25em;
          font-size: 16px;
        }
      }
    }
  }

  .Asset--delisted {
    cursor: pointer;
    height: 100%;
    width: 100%;
  }

  .Asset--card-header-placeholder {
    /* TODO */
    height: 44px;
  }

  &.Asset--loaded {
    &:hover {
      transform: translateY(-2px);

      .AssetCardContent--actions {
        display: initial;
      }
    }

    .Asset--anchor {
      pointer-events: initial;
    }

    &.Asset--isDisabled {
      .Asset--anchor {
        pointer-events: none;
      }
    }
  }

  .Asset--selected-icon {
    background-color: ${$blue};
    border-radius: 12px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 4px;
    position: absolute;
    right: 3px;
    top: 3px;
    z-index: 1;
  }

  ${sizeMQ({
    small: css`
      .Asset--anchor {
        &.Asset--placeholder-background {
          border-radius: 5px;
          overflow: hidden;
        }
      }

      .Asset--selected-icon {
        right: -12px;
        top: -12px;
      }
    `,
  })}
`
