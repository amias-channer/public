import React, { useContext } from "react"
import { first } from "lodash"
import { useFragment } from "react-relay"
import styled, { css } from "styled-components"
import { CHAIN_IDENTIFIERS_TO_NAMES, PLACEHOLDER_IMAGE } from "../../constants"
import Block, { BlockProps } from "../../design-system/Block"
import Button, { ButtonProps } from "../../design-system/Button"
import Flex from "../../design-system/Flex"
import FlexEnd from "../../design-system/FlexEnd"
import { Media } from "../../design-system/Media"
import { UncontrolledModalProps } from "../../design-system/Modal"
import MultiStepModal from "../../design-system/Modal/MultiStepModal.react"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import { AssetChangeCollectionModal } from "../../features/change-collection/components/AssetChangeCollectionModal.react"
import useAppContext from "../../hooks/useAppContext"
import useToasts from "../../hooks/useToasts"
import { useTranslations } from "../../hooks/useTranslations"
import { trackSetAssetPrivacy } from "../../lib/analytics/events/itemEvents"
import { accountQuery } from "../../lib/graphql/__generated__/accountQuery.graphql"
import { AssetContextMenu_data } from "../../lib/graphql/__generated__/AssetContextMenu_data.graphql"
import { AssetSelectionItem_data$key } from "../../lib/graphql/__generated__/AssetSelectionItem_data.graphql"
import { AssetSelectionSetPrivacyMutation } from "../../lib/graphql/__generated__/AssetSelectionSetPrivacyMutation.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { getAssetUrl } from "../../lib/helpers/asset"
import { isMultichain } from "../../lib/helpers/chainUtils"
import Router from "../../lib/helpers/router"
import { pluralize } from "../../lib/helpers/stringUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import { UnreachableCaseError } from "../../lib/helpers/type"
import { AccountPageContext } from "../../pages/account"
import { $red } from "../../styles/variables"
import Icon, { MaterialIcon } from "../common/Icon.react"
import Image from "../common/Image.react"
import { sizeMQ, BREAKPOINTS_PX } from "../common/MediaQuery.react"
import {
  SelectionBatchAction,
  ChainSelectionBatchAction,
} from "../search/assets/AssetSearch.react"
import { AssetSearchListAsset } from "../search/assets/AssetSearchList.react"
import SellModalContent from "../trade/SellModalContent.react"
import TransferModalContent from "../trade/TransferModalContent.react"

const AssetSelectionItem = ({
  onClick,
  dataKey,
}: {
  onClick: () => unknown
  dataKey: AssetSelectionItem_data$key
}) => {
  const data = useFragment(
    graphql`
      fragment AssetSelectionItem_data on AssetType {
        backgroundColor
        collection {
          displayData {
            cardDisplayStyle
          }
          imageUrl
        }
        imageUrl
        name
        relayId
      }
    `,
    dataKey,
  )

  const cardDisplayStyle = data.collection.displayData?.cardDisplayStyle
  return (
    <div className="AssetSelection--item">
      <Image
        backgroundColor={
          data.backgroundColor ? `#${data.backgroundColor}` : undefined
        }
        className={selectClassNames("AssetSelection", {
          image: true,
          "image-padded": cardDisplayStyle === "PADDED",
        })}
        isSpinnerShown
        size={50}
        sizing={
          cardDisplayStyle === "CONTAIN"
            ? "contain"
            : cardDisplayStyle === "COVER"
            ? "cover"
            : undefined
        }
        url={data.imageUrl || data.collection.imageUrl || PLACEHOLDER_IMAGE}
      />
      <div className="AssetSelection--delete" onClick={onClick}>
        <Icon className="AssetSelection--delete-icon" value="cancel" />
      </div>
    </div>
  )
}

export const isChainDependantAction = (
  action: SelectionBatchAction,
): action is ChainSelectionBatchAction => {
  return action === "sell" || action === "transfer"
}

interface Props {
  className?: string
  onClear: () => unknown
  onDelete: (relayId: string) => unknown
  selection: Array<AssetSearchListAsset>
  action: SelectionBatchAction
}

const ACTION_CONFIGURATIONS: Record<
  SelectionBatchAction,
  { icon: MaterialIcon; cta: (numItems: number) => string }
> = {
  changeCollection: {
    icon: "swap_vertical_circle",
    cta: () => "Change collection",
  },
  sell: {
    icon: "local_offer",
    cta: (numItems: number) =>
      numItems > 1 ? `Sell Bundle of ${numItems}` : "Sell",
  },
  transfer: {
    icon: "card_giftcard",
    cta: () => "Transfer",
  },
  hide: {
    icon: "visibility_off",
    cta: () => "Hide",
  },
  unhide: {
    icon: "visibility",
    cta: () => "Unhide",
  },
}

const AssetSelection = ({
  action,
  className,
  onClear,
  onDelete,
  selection,
}: Props) => {
  const { setExclude, exclude } = useContext(AccountPageContext)
  const { showSuccessMessage, attempt } = useToasts()
  const {
    mutate,
    wallet: { getActiveAccountKey, activeAccount },
  } = useAppContext()

  const { tr } = useTranslations()
  const numItems = selection.length
  const noItemsSelected = numItems === 0

  const setAssetPrivacy = async (isPrivate: boolean) => {
    trackSetAssetPrivacy({ isPrivate, numItems })
    const assets = selection.map(a => a.relayId)

    await attempt(async () => {
      await mutate<AssetSelectionSetPrivacyMutation>(
        graphql`
          mutation AssetSelectionSetPrivacyMutation(
            $assets: [AssetRelayID!]!
            $isPrivate: Boolean!
          ) {
            assetOwnerships {
              batchSetPrivacy(assets: $assets, isPrivate: $isPrivate)
            }
          }
        `,
        { assets, isPrivate },
        {
          shouldAuthenticate: true,
          updater: store => {
            setExclude([...exclude, ...assets])

            assets.forEach(relayId => {
              const assetRecord = store.get<AssetContextMenu_data>(relayId)
              if (assetRecord) {
                assetRecord
                  .getLinkedRecord("ownership", {
                    identity: getActiveAccountKey(),
                  })
                  ?.setValue(isPrivate, "isPrivate")
              }
            })

            if (activeAccount) {
              const accountRecord = store.get<accountQuery>(
                activeAccount.relayId,
              )
              if (accountRecord) {
                const currentCount = accountRecord.getValue(
                  "privateAssetCount",
                ) as number
                accountRecord.setValue(
                  currentCount + (isPrivate ? numItems : -numItems),
                  "privateAssetCount",
                )
              }
            }
          },
        },
      )

      onClear()
      showSuccessMessage(
        isPrivate
          ? `${numItems} ${pluralize("item", numItems)} ${
              numItems > 1 ? "were" : "was"
            } hidden from your profile`
          : `${numItems} ${pluralize("item", numItems)}  ${
              numItems > 1 ? "were" : "was"
            } unhidden from your profile`,
      )
    })
  }

  const renderCtaButton = (
    action: SelectionBatchAction,
    buttonProps: Omit<ButtonProps, "icon" | "disabled">,
  ) => {
    const { icon, cta } = ACTION_CONFIGURATIONS[action]
    const disabled = noItemsSelected

    return (
      <Tooltip content={tr("Select at least 1 item")} disabled={!disabled}>
        <Block>
          <Button disabled={disabled} icon={icon} {...buttonProps}>
            {tr(cta(numItems))}
          </Button>
        </Block>
      </Tooltip>
    )
  }

  const firstAsset = first(selection)
  const isMultichainAsset = isMultichain(firstAsset?.assetContract.chain)
  const archetype = firstAsset && {
    assetContractAddress: firstAsset.assetContract.address,
    tokenId: firstAsset.tokenId,
    chain: firstAsset.assetContract.chain,
  }

  const submit = (action: ChainSelectionBatchAction) => {
    if (!numItems || isMultichainAsset) {
      return
    }
    if (numItems > 1) {
      Router.push(`/bundle/${action}`, {
        assets: selection.map(item => item.relayId),
      })
      return
    }
    const [asset] = selection
    if (asset) {
      Router.push(getAssetUrl(asset, action))
    }
  }

  const renderActionTrigger = (action: SelectionBatchAction) => {
    const modalTrigger: UncontrolledModalProps["trigger"] = open => {
      return renderCtaButton(action, { onClick: open })
    }

    switch (action) {
      case "changeCollection":
        return (
          <AssetChangeCollectionModal
            assets={selection.map(item => item.relayId)}
            trigger={modalTrigger}
            onSuccess={onClear}
          />
        )
      case "sell":
        return isMultichainAsset ? (
          <MultiStepModal size="large" trigger={modalTrigger}>
            {archetype && (
              <SellModalContent
                shouldLinkToAsset
                variables={{ archetype, chain: archetype.chain }}
              />
            )}
          </MultiStepModal>
        ) : (
          renderCtaButton(action, { onClick: () => submit(action) })
        )
      case "transfer":
        return isMultichainAsset ? (
          <MultiStepModal trigger={modalTrigger}>
            {archetype && (
              <TransferModalContent
                shouldLinkToAsset
                variables={{ archetype }}
              />
            )}
          </MultiStepModal>
        ) : (
          renderCtaButton(action, { onClick: () => submit(action) })
        )
      case "hide":
        return renderCtaButton(action, { onClick: () => setAssetPrivacy(true) })
      case "unhide":
        return renderCtaButton(action, {
          onClick: () => setAssetPrivacy(false),
        })
      default:
        throw new UnreachableCaseError(action)
    }
  }

  const renderCancelButton = (blockProps?: BlockProps) => {
    return (
      <Block {...blockProps}>
        <Button icon="block" variant="tertiary" onClick={onClear}>
          {tr("Cancel")}
        </Button>
      </Block>
    )
  }

  return (
    <DivContainer
      as="section"
      className={className}
      data-testid="asset-selection"
    >
      <Media greaterThanOrEqual="sm">
        {(_mediaClassNames, renderChildren) =>
          renderChildren && (
            <>
              {" "}
              <Block marginRight="8px">
                {numItems ? (
                  <div className="AssetSelection--items">
                    {selection.map(asset => (
                      <AssetSelectionItem
                        dataKey={asset}
                        key={asset.relayId}
                        onClick={() => onDelete(asset.relayId)}
                      />
                    ))}
                  </div>
                ) : (
                  <Text>{`Select items to ${action}.`}</Text>
                )}
              </Block>
              {isChainDependantAction(action) &&
                firstAsset?.assetContract?.chain &&
                isMultichainAsset && (
                  <Text as="div" variant="small">
                    You can only select one{" "}
                    {
                      CHAIN_IDENTIFIERS_TO_NAMES[
                        firstAsset?.assetContract?.chain
                      ]
                    }{" "}
                    asset at a time.
                  </Text>
                )}
              <FlexEnd flex={1}>
                {renderActionTrigger(action)}
                {renderCancelButton({ marginLeft: "8px" })}
              </FlexEnd>
            </>
          )
        }
      </Media>

      <Media lessThan="sm">
        {(_mediaClassNames, renderChildren) =>
          renderChildren && (
            <>
              {renderCancelButton({ marginRight: "8px" })}
              {renderActionTrigger(action)}
            </>
          )
        }
      </Media>
    </DivContainer>
  )
}

export default AssetSelection

const DivContainer = styled(Flex)`
  align-items: center;
  background-color: ${props => props.theme.colors.surface};
  bottom: 0;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  height: 96px;
  padding: 0 24px;
  position: fixed;
  width: 100%;
  z-index: 5;

  @media (max-width: ${BREAKPOINTS_PX.mobile}px) {
    > * {
      width: 50%;
    }
    button {
      width: 100%;
    }
  }

  .AssetSelection--empty {
    color: ${props => props.theme.colors.text.subtle};
  }

  ${sizeMQ({
    mobile: css`
      width: 100%;
      left: 0;

      .AssetSelection--items {
        align-items: center;
        display: flex;
        height: 100%;
        padding: 0 8px;
        overflow: auto;

        .AssetSelection--item {
          flex-shrink: 0;
          margin-left: 16px;
          position: relative;

          &:first-child {
            margin-left: 0;
          }

          &:hover {
            cursor: pointer;
            user-select: none;

            .AssetSelection--image {
              opacity: 0.2;
            }

            .AssetSelection--delete {
              align-items: center;
              color: ${$red};
              display: flex;
              font-size: 20px;
              height: 100%;
              justify-content: center;
              left: 0;
              position: absolute;
              top: 0;
              width: 100%;

              .AssetSelection--delete-icon {
                font-size: 32px;
              }
            }
          }

          .AssetSelection--image {
            border-radius: 5px;
            box-shadow: ${props => props.theme.shadow};
            width: 50px;

            &.AssetSelection--image-padded {
              padding: 4px;
            }
          }

          .AssetSelection--delete {
            display: none;
          }
        }
      }
    `,
  })}
`
