import React from "react"
import { useRouter } from "next/router"
import { useFragment } from "react-relay"
import { Dropdown } from "../../../design-system/Dropdown"
import Tooltip from "../../../design-system/Tooltip"
import { PageTab } from "../../../features/profile/types"
import useAppContext from "../../../hooks/useAppContext"
import { useTranslations } from "../../../hooks/useTranslations"
import { AssetContextMenu_data$key } from "../../../lib/graphql/__generated__/AssetContextMenu_data.graphql"
import { graphql } from "../../../lib/graphql/graphql"
import { addressesEqual } from "../../../lib/helpers/addresses"
import { getAssetEditUrl } from "../../../lib/helpers/asset"
import { SelectionBatchAction } from "../../search/assets/AssetSearch.react"

export type AssetContextMenuSelection = {
  select: () => unknown
  activate: (action: SelectionBatchAction) => unknown
  action: SelectionBatchAction | undefined
}

type Props = {
  dataKey: AssetContextMenu_data$key
  children: React.ReactElement
  selection?: AssetContextMenuSelection
}

export const AssetContextMenu = ({ dataKey, selection, children }: Props) => {
  const { tr } = useTranslations()
  const {
    wallet: { activeAccount },
  } = useAppContext()

  const router = useRouter()
  const pageTab = router.query?.["tab"] as PageTab

  const asset = useFragment(
    graphql`
      fragment AssetContextMenu_data on AssetType
      @argumentDefinitions(identity: { type: "IdentityInputType!" }) {
        ...asset_edit_url
        ...itemEvents_data
        isDelisted
        isEditable {
          value
          reason
        }
        isListable
        ownership(identity: $identity) {
          isPrivate
          quantity
        }
        creator {
          address
        }
        collection {
          isAuthorizedEditor
        }
      }
    `,
    dataKey,
  )
  const {
    ownership,
    isDelisted,
    isListable,
    creator,
    isEditable,
    collection: { isAuthorizedEditor },
  } = asset

  const isCreatedByMe = addressesEqual(creator?.address, activeAccount?.address)

  return (
    <Dropdown
      content={({ List, Item, close }) => (
        <List>
          {!isDelisted && isListable && selection && (
            <Item
              onClick={event => {
                event.preventDefault()
                close()
                selection.activate("sell")
                selection.select()
              }}
            >
              <Item.Avatar icon="local_offer" />
              <Item.Content>
                <Item.Title>{tr("Sell")}</Item.Title>
              </Item.Content>
            </Item>
          )}

          {ownership && !isDelisted && selection && (
            <Item
              onClick={event => {
                event.preventDefault()
                close()
                selection.activate("transfer")
                selection.select()
              }}
            >
              <Item.Avatar icon="card_giftcard" />
              <Item.Content>
                <Item.Title>{tr("Transfer")}</Item.Title>
              </Item.Content>
            </Item>
          )}

          {!isCreatedByMe && !isEditable.value ? null : (
            <Tooltip content={isEditable.reason}>
              <Item
                disabled={!isEditable.value}
                href={getAssetEditUrl(asset)}
                onClick={event => {
                  event.stopPropagation()
                  close()
                }}
              >
                <Item.Avatar icon="edit" />
                <Item.Content>
                  <Item.Title>{tr("Edit")}</Item.Title>
                </Item.Content>
              </Item>
            </Tooltip>
          )}

          {selection && isCreatedByMe && isAuthorizedEditor && (
            <Item
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                selection.activate("changeCollection")
                selection.select()
              }}
            >
              <Item.Avatar icon="swap_vertical_circle" />
              <Item.Content>
                <Item.Title>{tr("Change collection")}</Item.Title>
              </Item.Content>
            </Item>
          )}

          {/* We dont support hiding on created tab yet */}
          {pageTab !== "created" && selection && ownership && (
            <Item
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                selection.activate(ownership.isPrivate ? "unhide" : "hide")
                selection.select()
              }}
            >
              <Item.Avatar
                icon={ownership.isPrivate ? "visibility" : "visibility_off"}
              />
              <Item.Content>
                <Item.Title>
                  {ownership.isPrivate ? tr("Unhide") : tr("Hide")}
                </Item.Title>
              </Item.Content>
            </Item>
          )}
        </List>
      )}
    >
      {children}
    </Dropdown>
  )
}

export default AssetContextMenu
