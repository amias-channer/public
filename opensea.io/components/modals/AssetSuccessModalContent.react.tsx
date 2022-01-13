import React from "react"
import qs from "qs"
import styled from "styled-components"
import { OPENSEA_TWITTER_HANDLE } from "../../constants"
import { Avatar } from "../../design-system/Avatar"
import Block from "../../design-system/Block"
import Button from "../../design-system/Button"
import Loader from "../../design-system/Loader/Loader.react"
import Modal from "../../design-system/Modal"
import Text from "../../design-system/Text"
import API from "../../lib/api"
import Trader, { ActionTransaction } from "../../lib/chain/trader"
import { AssetSuccessModalContentQuery } from "../../lib/graphql/__generated__/AssetSuccessModalContentQuery.graphql"
import { clearCache } from "../../lib/graphql/environment/middlewares/cacheMiddleware"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { truncateAddress } from "../../lib/helpers/addresses"
import { getAssetUrl } from "../../lib/helpers/asset"
import { Values } from "../../lib/helpers/type"
import { themeVariant } from "../../styles/styleUtils"
import { HUES } from "../../styles/themes"
import AssetMedia from "../assets/AssetMedia.react"
import ConditionalWrapper from "../common/ConditionalWrapper.react"
import ExternalLink from "../common/ExternalLink.react"
import Link from "../common/Link.react"
import ModalLoader from "../common/ModalLoader.react"
import Row from "../common/Row.react"
import TextCopier from "../common/TextCopier.react"
import Frame from "../layout/Frame.react"
import Scrollbox from "../layout/Scrollbox.react"
import TelegramLogo from "../svgs/TelegramLogo.react"
import TwitterLogo from "../svgs/TwitterLogo.react"

export const MODES = {
  BOUGHT: "bought",
  SOLD: "sold",
  LISTED: "listed",
  TRANSFERRED: "transferred",
  FROZEN: "frozen",
} as const

export interface AssetSuccessModalContentProps {
  shouldLinkToAsset?: boolean
  mode: Values<typeof MODES>
  transaction?: ActionTransaction
}

interface State {
  isTransactionConfirmed?: boolean
}

const TRANSACTION_CONFIRMED_DELAY = 10000

class AssetSuccessModalContent extends GraphQLComponent<
  AssetSuccessModalContentQuery,
  AssetSuccessModalContentProps
> {
  state: State = {}

  onDataChange = async () => {
    const { data, transaction, refetch } = this.props
    const { isTransactionConfirmed } = this.state

    const chain = data?.assets[0].assetContract.chain

    const transactionHash = transaction?.transactionHash
    if (chain && transactionHash && !isTransactionConfirmed) {
      await Trader.pollTransaction({ transactionHash, chain })
      this.setState({ isTransactionConfirmed: true })
      // We refetch to refresh ownerships after an arbitrary delay as there will be some time between the block being confirmed
      // and then being picked up by our watchers
      setTimeout(() => {
        clearCache()
        refetch()
      }, TRANSACTION_CONFIRMED_DELAY)
    }
  }

  render() {
    const { data, mode, transaction, shouldLinkToAsset } = this.props
    const { isTransactionConfirmed } = this.state
    const transactionHash = transaction?.transactionHash
    const asset = data?.assets[0]
    const assetNameElement = (
      <ConditionalWrapper
        condition={shouldLinkToAsset}
        wrapper={children => <Link href={assetUrl}>{children}</Link>}
      >
        {asset?.name}
      </ConditionalWrapper>
    )

    const transactionTitleText = isTransactionConfirmed
      ? "has processed"
      : "is processing"

    const transactionSubtitleText = transactionHash
      ? isTransactionConfirmed
        ? "It's been confirmed on the blockchain!"
        : "It should be confirmed on the blockchain shortly."
      : null

    const title = {
      bought: `Your purchase ${transactionTitleText}!`,
      sold: `Your sale ${transactionTitleText}!`,
      listed: "Your NFT is listed!",
      transferred: `Your transfer ${transactionTitleText}!`,
      frozen: <>Freezing metadata for {assetNameElement}...</>,
    }[mode]

    const subtitle = {
      bought: (
        <>
          Woot! You just purchased {assetNameElement}. {transactionSubtitleText}
        </>
      ),
      sold: (
        <>
          Woot! You just sold {assetNameElement}. {transactionSubtitleText}
        </>
      ),
      listed: (
        <>
          Woot! We've listed {assetNameElement}. {transactionSubtitleText}
        </>
      ),
      transferred: (
        <>
          Woot! You just transferred {assetNameElement}.{" "}
          {transactionSubtitleText}
        </>
      ),
      frozen: isTransactionConfirmed
        ? "Your asset's metadata has been successfully frozen! It may take a few minutes for this to be reflected on the OpenSea item page."
        : "This process can take a few minutes. You can close this modal or keep it open to monitor its progress.",
    }[mode]

    const shareText = {
      bought: "SHARE",
      sold: null,
      listed: "SHARE",
      transferred: null,
      frozen: null,
    }[mode]

    const shareLinkMessage = {
      bought: "Check out my new NFT on OpenSea!",
      sold: null,
      listed: "Check out my NFT listing on OpenSea!",
      transferred: null,
      frozen: null,
    }[mode]

    const assetUrl = asset ? getAssetUrl(asset) : ""
    const fullAssetUrl = `${API.getWebUrl()}${assetUrl}`

    return asset ? (
      <DivContainer>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Text className="AssetSuccessModalContent--text" textAlign="center">
            {subtitle}
          </Text>

          <div className="AssetSuccessModalContent--image">
            <AssetMedia asset={asset} size={200} />
          </div>

          {transactionHash ? (
            <Frame className="AssetSuccessModalContent--transaction-table">
              <Scrollbox>
                <Row isHeader>{["Status", "Transaction Hash"]}</Row>
                <Row>
                  {[
                    <>
                      {isTransactionConfirmed ? (
                        <Avatar
                          backgroundColor={HUES.seaGrass}
                          color="white"
                          icon="check"
                          outline
                          size={16}
                        />
                      ) : (
                        <Loader size="medium" />
                      )}
                      <Block marginLeft="8px">
                        {isTransactionConfirmed ? "Complete" : "Processing"}
                      </Block>
                    </>,
                    <ExternalLink
                      key={transactionHash}
                      url={transaction?.blockExplorerLink || ""}
                    >
                      {truncateAddress(transactionHash)}
                    </ExternalLink>,
                  ]}
                </Row>
              </Scrollbox>
            </Frame>
          ) : null}
        </Modal.Body>

        {mode === "bought" || mode === "listed" ? (
          <>
            <Text
              className="AssetSuccessModalContent--share-text"
              textAlign="center"
              variant="small"
            >
              {shareText}
            </Text>
            <Modal.Footer>
              <ExternalLink
                url={`https://twitter.com/intent/tweet?${qs.stringify({
                  text: shareLinkMessage,
                  url: fullAssetUrl,
                  via: OPENSEA_TWITTER_HANDLE,
                })}`}
              >
                <Button
                  className="AssetSuccessModalContent--share-cta"
                  icon={
                    <TwitterLogo className="AssetSuccessModalContent--logo" />
                  }
                  variant="tertiary"
                />
              </ExternalLink>
              <ExternalLink
                url={`https://www.facebook.com/sharer/sharer.php?u=${fullAssetUrl}`}
              >
                <Button
                  className="AssetSuccessModalContent--share-cta"
                  icon="facebook"
                  variant="tertiary"
                />
              </ExternalLink>
              <ExternalLink
                url={`https://t.me/share/url?${qs.stringify({
                  url: fullAssetUrl,
                  text: shareLinkMessage,
                })}`}
              >
                <Button
                  className="AssetSuccessModalContent--share-cta"
                  icon={
                    <TelegramLogo className="AssetSuccessModalContent--logo" />
                  }
                  variant="tertiary"
                />
              </ExternalLink>
              <TextCopier label="Copy link" text={fullAssetUrl}>
                <Button
                  className="AssetSuccessModalContent--share-cta"
                  icon="link"
                  variant="tertiary"
                />
              </TextCopier>
            </Modal.Footer>
          </>
        ) : null}
      </DivContainer>
    ) : (
      <ModalLoader />
    )
  }
}

export default withData<
  AssetSuccessModalContentQuery,
  AssetSuccessModalContentProps
>(
  AssetSuccessModalContent,
  graphql`
    query AssetSuccessModalContentQuery($assetIDs: [AssetRelayID!]!) {
      assets(assets: $assetIDs) {
        relayId
        name
        assetContract {
          address
          chain
        }
        tokenId
        ...AssetMedia_asset
        ...asset_url
      }
    }
  `,
)

const DivContainer = styled.div`
  display: flex;
  flex-direction: column;

  .AssetSuccessModalContent--text {
    color: ${props => props.theme.colors.text.subtle};
  }

  .AssetSuccessModalContent--transaction-table {
    width: 350px;
    margin: 16px auto 0 auto;
  }

  .AssetSuccessModalContent--share-text {
    margin: 16px;
  }

  .AssetSuccessModalContent--logo {
    width: 24px;
    height: 24px;
  }

  .AssetSuccessModalContent--share-ctas {
    display: flex;
    justify-content: center;
  }

  .AssetSuccessModalContent--share-cta {
    margin: 0 4px;

    ${({ theme }) =>
      themeVariant({
        variants: {
          dark: {
            svg: {
              fill: theme.colors.fog,
            },
            "&:hover svg": {
              fill: theme.colors.white,
            },
          },
          light: {
            svg: {
              fill: theme.colors.darkGray,
            },
            "&:hover svg": {
              fill: theme.colors.oil,
            },
          },
        },
      })}
  }
`
