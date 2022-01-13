import React from "react"
import styled from "styled-components"
import AppComponent from "../../AppComponent.react"
import { IS_PRODUCTION, TEST_MULTICHAIN_COLLECTIONS } from "../../constants"
import Dropdown from "../../design-system/Dropdown"
import Modal from "../../design-system/Modal"
import MultiStepModal from "../../design-system/Modal/MultiStepModal.react"
import Select from "../../design-system/Select"
import SpaceBetween from "../../design-system/SpaceBetween"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import {
  trackOpenReportModal,
  trackSubmitReport,
} from "../../lib/analytics/events/itemEvents"
import { Toolbar_asset } from "../../lib/graphql/__generated__/Toolbar_asset.graphql"
import { ToolbarAssetRefreshMutation } from "../../lib/graphql/__generated__/ToolbarAssetRefreshMutation.graphql"
import { ToolbarHideAssetMutation } from "../../lib/graphql/__generated__/ToolbarHideAssetMutation.graphql"
import { ToolbarNsfwAssetMutation } from "../../lib/graphql/__generated__/ToolbarNsfwAssetMutation.graphql"
import {
  ReportReason,
  ToolbarReportMutation,
} from "../../lib/graphql/__generated__/ToolbarReportMutation.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { getAssetChangeAdminUrl } from "../../lib/helpers/admin"
import { getAssetUrl } from "../../lib/helpers/asset"
import { isMultichain, isSupportedChain } from "../../lib/helpers/chainUtils"
import { entries } from "../../lib/helpers/object"
import { shouldShowMultichainModal } from "../../lib/helpers/orders"
import Router from "../../lib/helpers/router"
import { isIcecapAddress } from "../../reducers/assets"
import { getIsTestnet } from "../../store"
import ExternalLink from "../common/ExternalLink.react"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"
import FeatureFlag from "../featureFlag/FeatureFlag.react"
import Label from "../forms/Label.react"
import URLInput from "../forms/URLInput.react"
import MultiChainTradingGate from "../modals/MultiChainTradingGate.react"
import NetworkUnsupportedGate from "../modals/NetworkUnsupportedGate.react"
import TransferModalContent from "../trade/TransferModalContent.react"
import TextArea from "../v2/inputs/TextArea.react"
import ActionButton from "./ActionButton.react"
import Share from "./Share.react"
import TextCopier from "./TextCopier.react"

interface Props {
  asset: Toolbar_asset
  hideTransfer?: boolean
}

interface State {
  showEmbedModal: boolean
  showReportModal: boolean
  reportReason?: ReportReason
  reportOriginalCreatorUrl?: string
  reportAdditionalComments?: string
  reportOriginalCreatorUrlInputValue: string
  reportStatus: "done" | "error" | "standby" | "wait"
}

const REPORT_MAX_COMMENTS_LENGTH = 1000

const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  COPYRIGHT_INFRINGEMENT: "Copyright infringement",
  EXPLICIT_AND_SENSITIVE_CONTENT: "Explicit and sensitive content",
  OTHER: "Other",
  "%future added value": "",
}

const reasonToOption = (reason: ReportReason) => ({
  label: REPORT_REASON_LABELS[reason],
  value: reason as string,
})
class Toolbar extends AppComponent<Props, State> {
  state: State = {
    showEmbedModal: false,
    showReportModal: false,
    reportStatus: "standby",
    reportOriginalCreatorUrlInputValue: "",
  }

  refreshMetadata = async () => {
    const {
      asset: { relayId },
    } = this.props
    const { mutate } = this.context
    await this.attempt(async () => {
      await mutate<ToolbarAssetRefreshMutation>(
        graphql`
          mutation ToolbarAssetRefreshMutation($asset: AssetRelayID!) {
            assets {
              refresh(asset: $asset)
            }
          }
        `,
        {
          asset: relayId,
        },
      )
      this.showSuccessMessage(
        "We've queued this item for an update! Check back in a minute...",
        "timer",
      )
    })
  }

  delistAsset = async () => {
    const {
      asset: { relayId },
    } = this.props
    const { mutate } = this.context
    await this.attempt(async () => {
      await mutate<ToolbarHideAssetMutation>(
        graphql`
          mutation ToolbarHideAssetMutation($asset: AssetRelayID!) {
            assets {
              configureVisibility(asset: $asset, isDelisted: true)
            }
          }
        `,
        { asset: relayId },
        { shouldAuthenticate: true },
      )
    })
  }

  flagAssetAsNsfw = async () => {
    const {
      asset: { relayId },
    } = this.props
    const { mutate } = this.context
    await this.attempt(async () => {
      await mutate<ToolbarNsfwAssetMutation>(
        graphql`
          mutation ToolbarNsfwAssetMutation($asset: AssetRelayID!) {
            assets {
              configureVisibility(asset: $asset, isNsfw: true)
            }
          }
        `,
        { asset: relayId },
        { shouldAuthenticate: true },
      )
    })
  }

  renderEmbedModal() {
    const { showEmbedModal } = this.state
    const { asset } = this.props

    const embedContent = `
    <nft-card
    contractAddress="${asset.assetContract.address}"
    tokenId="${asset.tokenId}"${getIsTestnet() ? ' network="rinkeby"' : ""}>
    </nft-card>
    <script src="https://unpkg.com/embeddable-nfts/dist/nft-card.min.js"></script>
`

    return (
      <Modal
        isOpen={showEmbedModal}
        onClose={() => this.setState({ showEmbedModal: false })}
      >
        <Modal.Header>
          <Modal.Title>Embed code</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Text textAlign="center">
            To embed this asset, copy and paste the code below into your site
          </Text>

          <SpaceBetween>
            <span />
            <TextCopier text={embedContent}>
              <Icon color="blue" value="content_copy" />
            </TextCopier>
          </SpaceBetween>
          <blockquote style={{ overflow: "auto" }}>
            <code>{embedContent}</code>
          </blockquote>
          <p>
            Want to customize the embed?{" "}
            <ExternalLink
              rel="noreferrer"
              target="_blank"
              url="https://github.com/ProjectOpenSea/embeddable-nfts"
            >
              Learn how here.
            </ExternalLink>
          </p>
        </Modal.Body>
      </Modal>
    )
  }

  reportAsset = async (): Promise<void> => {
    const { relayId } = this.props.asset
    const { reportAdditionalComments, reportOriginalCreatorUrl, reportReason } =
      this.state
    const { mutate } = this.context

    await this.attempt(async () => {
      await mutate<ToolbarReportMutation>(
        graphql`
          mutation ToolbarReportMutation(
            $message: String
            $asset: AssetRelayID
            $reason: ReportReason
            $originalCreatorUrl: URL
          ) {
            flag {
              report(
                message: $message
                asset: $asset
                reason: $reason
                originalCreatorUrl: $originalCreatorUrl
              )
            }
          }
        `,
        {
          message: reportAdditionalComments,
          asset: relayId,
          originalCreatorUrl: reportOriginalCreatorUrl,
          reason: reportReason,
        },
      )
      this.setState({ reportStatus: "done", showReportModal: false })
      trackSubmitReport(this.props.asset, {
        additionalComments: reportAdditionalComments,
        originalCreatorUrl: reportOriginalCreatorUrl,
        reason: reportReason,
      })
      await this.showSuccessMessage("This item has been reported.")
    })
  }

  renderReportModal() {
    const {
      showReportModal,
      reportAdditionalComments,
      reportReason,
      reportOriginalCreatorUrl,
      reportOriginalCreatorUrlInputValue,
    } = this.state
    return (
      <Modal
        focusFirstFocusableElement={false}
        isOpen={showReportModal}
        onClose={() => this.setState({ showReportModal: false })}
      >
        <Modal.Header>
          <Modal.Title>Report this item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Label label="Reason">
            <Select
              clearable={false}
              options={entries(REPORT_REASON_LABELS)
                .filter(([_, v]) => !!v)
                .map(([k]) => reasonToOption(k))}
              placeholder="Select a reason"
              readOnly
              value={reportReason ? reasonToOption(reportReason) : undefined}
              onSelect={option =>
                option?.value &&
                this.setState({
                  reportReason: option.value as ReportReason,
                  reportOriginalCreatorUrl: undefined,
                })
              }
            />
          </Label>

          {reportReason === "COPYRIGHT_INFRINGEMENT" ? (
            <Label
              htmlFor="originalCreatorUrl"
              label="Original Creator/Item URL"
            >
              <URLInput
                inputValue={reportOriginalCreatorUrlInputValue}
                placeholder="https://opensea.io/"
                value={reportOriginalCreatorUrl}
                onChange={({ value, inputValue }) =>
                  this.setState({
                    reportOriginalCreatorUrl: value,
                    reportOriginalCreatorUrlInputValue: inputValue,
                  })
                }
              />
            </Label>
          ) : null}

          <Label htmlFor="additionalComments" label="Additional Comments">
            <TextArea
              className="Toolbar--report-textarea"
              id="additionalComments"
              maxLength={REPORT_MAX_COMMENTS_LENGTH}
              placeholder="Explain why you are concerned about this item."
              rows={4}
              value={reportAdditionalComments}
              onChange={reportAdditionalComments =>
                this.setState({ reportAdditionalComments })
              }
            />
          </Label>
        </Modal.Body>
        <Modal.Footer>
          <ActionButton isDisabled={!reportReason} onClick={this.reportAsset}>
            Report
          </ActionButton>
        </Modal.Footer>
      </Modal>
    )
  }

  renderShareOptionsDropdown = () => {
    const { asset } = this.props
    return (
      <Share
        url={getAssetUrl(asset)}
        onEmbed={() => this.setState({ showEmbedModal: true })}
      >
        <UnstyledButton className="Toolbar--click-handler Toolbar--tool">
          <Icon className="Toolbar--icon" value="share" />
        </UnstyledButton>
      </Share>
    )
  }

  renderMoreOptionsDropdown = () => {
    const { asset } = this.props
    const { wallet } = this.context
    const isStaff = wallet.isStaff

    return (
      <Dropdown
        content={({ close, List, Item }) => (
          <List>
            <Item
              onClick={() => {
                this.setState({ showReportModal: true }, close)
                trackOpenReportModal(this.props.asset)
              }}
            >
              <Item.Avatar icon="flag" />
              <Item.Content>
                <Item.Title>Report</Item.Title>
              </Item.Content>
            </Item>
            {isStaff && (
              <>
                <Item
                  onClick={() => {
                    close()
                    this.delistAsset()
                  }}
                >
                  <Item.Avatar icon="remove_circle" />
                  <Item.Content>
                    <Item.Title>Delist</Item.Title>
                  </Item.Content>
                </Item>
                <Item
                  onClick={() => {
                    close()
                    this.flagAssetAsNsfw()
                  }}
                >
                  <Item.Avatar icon="report_problem" />
                  <Item.Content>
                    <Item.Title>Flag as NSFW</Item.Title>
                  </Item.Content>
                </Item>

                <FeatureFlag flags={["staff"]}>
                  <Item href={getAssetChangeAdminUrl(asset.relayId)}>
                    <Item.Avatar icon="vpn_key" />
                    <Item.Content>
                      <Item.Title>Django Admin</Item.Title>
                    </Item.Content>
                  </Item>
                </FeatureFlag>
              </>
            )}
          </List>
        )}
        placement="bottom-end"
      >
        <Tooltip content="More">
          <UnstyledButton className="Toolbar--click-handler Toolbar--tool">
            <Icon className="Toolbar--icon" value="more_vert" />
          </UnstyledButton>
        </Tooltip>
      </Dropdown>
    )
  }

  render() {
    const { asset, hideTransfer } = this.props

    const isIcecap = isIcecapAddress(asset.assetContract.address)
    const externalURL = asset.externalLink || asset.collection.externalUrl
    const extrnalLinkText =
      isIcecap && asset.externalLink
        ? "View GIA Certificate"
        : `View on ${asset.collection.name}`
    const chain = asset.assetContract.chain
    const useTransferModal =
      (getIsTestnet() &&
        Router.getPathParams().assetContractAddress ===
          "0x663378bfc54ad95005358392d1e35bd1265e9d12") ||
      Router.getPathParams().assetContractAddress ===
        "0x495f947276749ce646f68ac8c248420045cb7b5e" ||
      !IS_PRODUCTION ||
      (isMultichain(chain) && isSupportedChain(chain)) ||
      TEST_MULTICHAIN_COLLECTIONS.includes(asset.collection.slug)

    return (
      <DivToolbarWrapper>
        <div className="Toolbar--interface">
          <Tooltip content="Refresh metadata">
            <UnstyledButton
              className="Toolbar--tool"
              onClick={this.refreshMetadata}
            >
              <Icon className="Toolbar--icon" value="refresh" />
            </UnstyledButton>
          </Tooltip>
          {hideTransfer ? null : (
            <Tooltip content="Transfer">
              <span className="Toolbar--tool-container">
                <NetworkUnsupportedGate chainIdentifier={chain}>
                  <MultiChainTradingGate
                    chainIdentifier={chain}
                    collectionSlug={asset.collection.slug}
                  >
                    {useTransferModal ? (
                      <MultiStepModal
                        trigger={open => (
                          <UnstyledButton
                            className="Toolbar--tool"
                            onClick={open}
                          >
                            <Icon
                              className="Toolbar--icon"
                              value="card_giftcard"
                            />
                          </UnstyledButton>
                        )}
                      >
                        <TransferModalContent
                          variables={{
                            archetype: {
                              assetContractAddress: asset.assetContract.address,
                              tokenId: asset.tokenId,
                              chain: asset.assetContract.chain,
                            },
                          }}
                        />
                      </MultiStepModal>
                    ) : (
                      <Link
                        className="Toolbar--tool"
                        href={
                          // TODO: Remove, but is needed for now due to the href
                          shouldShowMultichainModal(
                            chain,
                            asset.collection.slug,
                          )
                            ? undefined
                            : getAssetUrl(asset, "transfer")
                        }
                      >
                        <Icon className="Toolbar--icon" value="card_giftcard" />
                      </Link>
                    )}
                  </MultiChainTradingGate>
                </NetworkUnsupportedGate>
              </span>
            </Tooltip>
          )}
          {externalURL && (
            <Tooltip content={extrnalLinkText}>
              <UnstyledButton className="Toolbar--tool">
                <ExternalLink
                  rel="noreferrer"
                  target="_blank"
                  url={externalURL}
                >
                  <Icon className="Toolbar--icon" value="open_in_new" />
                </ExternalLink>
              </UnstyledButton>
            </Tooltip>
          )}

          {this.renderShareOptionsDropdown()}
          {this.renderMoreOptionsDropdown()}

          {this.renderEmbedModal()}
          {this.renderReportModal()}
        </div>
      </DivToolbarWrapper>
    )
  }
}

export default fragmentize(Toolbar, {
  fragments: {
    asset: graphql`
      fragment Toolbar_asset on AssetType {
        ...asset_url
        ...itemEvents_data
        assetContract {
          address
          chain
        }
        collection {
          externalUrl
          name
          slug
        }
        externalLink
        name
        relayId
        tokenId
      }
    `,
  },
})

const DivToolbarWrapper = styled.div`
  position: relative;

  .Toolbar--icon {
    font-size: 24px;
    display: inline-block;
    vertical-align: middle;
    line-height: 28px;
    color: ${props => props.theme.colors.withOpacity.text.body.heavy};
    margin: 0 0 0 0;
    padding: 0 0 0 0;

    &:hover {
      color: ${props => props.theme.colors.text.body};
    }
  }

  .Toolbar--interface {
    display: flex;

    .Toolbar--tool {
      width: 100%;
      min-width: 40px;
      border: 1px solid ${props => props.theme.colors.border};
      padding: 5px 5px 5px 6px;
      margin-bottom: -1px;
      cursor: pointer;

      &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-left: 2px solid ${props => props.theme.colors.border};
        border-right: 1px solid ${props => props.theme.colors.border};
      }

      &:hover {
        box-shadow: 0.5px 0 3px rgba(46, 54, 59, 0.25);
      }

      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-right: 2px solid ${props => props.theme.colors.border};
        border-left: 1px solid ${props => props.theme.colors.border};
      }

      .Toolbar--click-handler {
        outline: none;
      }
    }

    .Toolbar--report-textarea {
      margin: 12px 0 0 0;
    }

    .Toolbar--report-submit {
      justify-content: center;
      display: flex;
      margin-bottom: 16px;
      margin-top: 32px;
    }

    .Toolbar--tool-container {
      .Toolbar--tool {
        display: block;
        border-radius: 0;
        border-right: 1px solid ${props => props.theme.colors.border};
      }
    }
  }

  .Toolbar--dropdown-wrapper {
    position: absolute;
    background-color: ${props => props.theme.colors.background};
    min-width: 200px;
    box-sizing: border-box;
    box-shadow: ${props => props.theme.shadow};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 5px;
    z-index: 1;

    &.Toolbar--dropdown-wrapper-share {
      right: 40px;
    }

    &.Toolbar--dropdown-wrapper-more-options {
      right: 0px;
    }

    .Toolbar--dropdown {
      display: flex;
      flex-direction: column;
      overflow: auto;
      margin: 0;

      .Toolbar--dropdown-item {
        display: flex;
        align-items: center;
        height: 40px;

        .Toolbar--dropdown-content {
          display: flex;
          align-items: center;

          &:hover {
            cursor: pointer;
          }

          .Toolbar--dropdown-icon-wrapper {
            text-align: center;
            width: 40px;
            color: ${props => props.theme.colors.withOpacity.text.body.heavy};
          }

          .Toolbar--dropdown-strong {
            text-transform: uppercase;
            color: ${props => props.theme.colors.withOpacity.text.body.heavy};
            font-size: 14px;
          }
        }

        &:hover {
          .Toolbar--icon {
            color: ${props => props.theme.colors.text.body};
          }

          .Toolbar--dropdown-strong {
            color: ${props => props.theme.colors.text.body};
          }
        }
      }
    }
  }
`
