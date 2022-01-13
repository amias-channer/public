import React from "react"
import _ from "lodash"
import ReactMarkdown from "react-markdown"
import styled, { css } from "styled-components"
import AccountLink from "../components/accounts/AccountLink.react"
import AssetCardHeader from "../components/assets/AssetCardHeader.react"
import AssetMedia from "../components/assets/AssetMedia.react"
import ChainInfo from "../components/assets/ChainInfo.react"
import PriceHistory from "../components/assets/PriceHistory.react"
import CollectionLink from "../components/collections/CollectionLink.react"
import {
  VerificationIcon,
  verificationStatusHasBadge,
} from "../components/collections/VerificationIcon.react"
import CenterAligned from "../components/common/CenterAligned.react"
import ConditionalWrapper from "../components/common/ConditionalWrapper.react"
import Count from "../components/common/Count.react"
import Image from "../components/common/Image.react"
import Link from "../components/common/Link.react"
import { sizeMQ } from "../components/common/MediaQuery.react"
import SocialBar from "../components/common/SocialBar.react"
import Toolbar from "../components/common/Toolbar.react"
import EventHistory from "../components/events/EventHistory.react"
import AssetFavoritedByModal from "../components/favorites/AssetFavoritedByModal.react"
import Frame, { FrameProvider } from "../components/layout/Frame.react"
import Head from "../components/layout/Head.react"
import AnnouncementBanner from "../components/layout/home-page/AnnouncementBanner.react"
import Panel from "../components/layout/Panel.react"
import PrivateListingBanner from "../components/layout/PrivateListingBanner.react"
import BidModalContent from "../components/modals/BidModalContent.react"
import CollectionStatusModal from "../components/modals/CollectionStatusModal.react"
import EnsManualEntryModal from "../components/modals/EnsManualEntryModal.react"
import ExchangeModal from "../components/modals/ExchangeModal.react"
import MultiChainTradingGate from "../components/modals/MultiChainTradingGate.react"
import NetworkUnsupportedGate from "../components/modals/NetworkUnsupportedGate.react"
import UnlockableContentModal from "../components/modals/UnlockableContentModal.react"
import OrderManager from "../components/orders/OrderManager.react"
import Orders from "../components/orders/Orders.react"
import AssetSearchListPagination from "../components/search/assets/AssetSearchListPagination.react"
import SellModalContent from "../components/trade/SellModalContent.react"
import TradeStation from "../components/trade/TradeStation.react"
import VerifyCollectionModal from "../components/trade/VerifyCollectionModal.react"
import Boost from "../components/traits/Boost.react"
import Date from "../components/traits/Date.react"
import NumericTrait from "../components/traits/NumericTrait.react"
import Property from "../components/traits/Property.react"
import { SEO_MAX_DESC_LENGTH } from "../constants"
import AppContainer from "../containers/AppContainer.react"
import Block from "../design-system/Block"
import Button from "../design-system/Button"
import Flex from "../design-system/Flex"
import Lightbox from "../design-system/Lightbox"
import Loader from "../design-system/Loader/Loader.react"
import { Media } from "../design-system/Media"
import Modal from "../design-system/Modal"
import MultiStepModal from "../design-system/Modal/MultiStepModal.react"
import UnstyledButton from "../design-system/UnstyledButton"
import ItemOwnersModal from "../features/owners/components/ItemOwnersModal.react"
import Tr from "../i18n/Tr.react"
import TrVar from "../i18n/TrVar.react"
import {
  readItem,
  trackNavigateToSimilarItems,
  trackViewItem,
} from "../lib/analytics/events/itemEvents"
import { Asset_data } from "../lib/graphql/__generated__/Asset_data.graphql"
import { itemQuery } from "../lib/graphql/__generated__/itemQuery.graphql"
import { clearCache } from "../lib/graphql/environment/middlewares/cacheMiddleware"
import {
  getFirstNode,
  getNodes,
  graphql,
  GraphQLInitialProps,
} from "../lib/graphql/graphql"
import GraphQLPage from "../lib/graphql/GraphQLPage.react"
// import { truncateAddress } from "../lib/helpers/addresses"
import { getAssetInputType, getAssetUrl } from "../lib/helpers/asset"
import { reportAssetVisitor } from "../lib/helpers/assets"
import { pollEnglishAuction } from "../lib/helpers/auctions"
import { registrarAddressToDomain } from "../lib/helpers/ens"
import { stripHtml } from "../lib/helpers/html"
import { BigNumber, bn } from "../lib/helpers/numberUtils"
import {
  isOrderV2Enabled,
  shouldShowMultichainModal,
} from "../lib/helpers/orders"
import Router from "../lib/helpers/router"
import { largeFrozenImage } from "../lib/helpers/urls"
import { readCollectionVerificationStatus } from "../lib/helpers/verification"
import QP from "../lib/qp/qp"
import { HUES } from "../styles/themes"
import { $blue, $grey, $nav_height } from "../styles/variables"

const ITEM_MAX_WIDTH = 600

interface Props {
  data?: itemQuery
  showSellModal?: boolean
}

interface State {
  dayDurationFilter?: number
  isAssetVisitorReported: boolean
  isCheckoutModalOpen: boolean
  isItemOwnersModalOpen: boolean
}

export default class Item extends GraphQLPage<itemQuery, Props, State> {
  static query = graphql`
    query itemQuery($archetype: ArchetypeInputType!, $chain: ChainScalar) {
      archetype(archetype: $archetype) {
        asset {
          ...AssetCardHeader_data
          ...assetInputType
          assetContract {
            address
            chain
            blockExplorerLink
          }

          assetOwners(first: 1) {
            edges {
              node {
                quantity
                owner {
                  ...AccountLink_data
                }
              }
            }
          }
          creator {
            ...AccountLink_data
          }
          animationUrl
          backgroundColor
          collection {
            description
            displayData {
              cardDisplayStyle
            }
            hidden
            imageUrl
            name
            slug
            ...CollectionLink_collection
            ...Boost_collection
            ...Property_collection
            ...NumericTrait_collection
            ...SocialBar_data
            ...verification_data
          }
          decimals
          description
          imageUrl
          numVisitors
          isDelisted
          isListable
          name
          relayId
          tokenId
          hasUnlockableContent
          favoritesCount
          traits(first: 100) {
            edges {
              node {
                relayId
                displayType
                floatValue
                intValue
                traitType
                value
                ...Boost_trait
                ...Property_trait
                ...NumericTrait_trait
                ...Date_trait
              }
            }
          }
          ...AssetMedia_asset
          ...EnsManualEntryModal_asset
          ...Toolbar_asset
          ...asset_url
          ...itemEvents_data
          ...ChainInfo_data
        }
        # Will need a more appropriate limit and pagination.
        ownedQuantity(identity: {})
        ownershipCount
        quantity
        ...TradeStation_archetype @arguments(identity: {}, chain: $chain)
        ...BidModalContent_archetype @arguments(identity: {}, chain: $chain)
      }
      tradeSummary(archetype: $archetype) {
        bestAsk {
          closedAt
          orderType
          maker {
            ...wallet_accountKey
          }
          relayId
        }
        ...BidModalContent_trade
        ...TradeStation_data
      }
      assetEvents(archetype: $archetype, first: 11) {
        edges {
          node {
            relayId
          }
        }
      }
    }
  `

  static getInitialProps = QP.nextParser(
    {
      assetContractAddress: QP.Address,
      tokenId: QP.BigNumber,
      chainIdentifier: QP.Optional(QP.ChainIdentifier),
      sell: QP.Optional(QP.boolean),
    },
    ({
      assetContractAddress,
      tokenId,
      chainIdentifier,
      sell,
    }): GraphQLInitialProps<itemQuery, Props> => {
      return {
        showSellModal: sell,
        variables: {
          archetype: {
            assetContractAddress,
            tokenId: tokenId.toString(),
            chain: chainIdentifier,
          },
          chain: chainIdentifier,
        },
      }
    },
  )

  state: State = {
    isItemOwnersModalOpen: false,
    isCheckoutModalOpen: false,
    isAssetVisitorReported: false,
  }

  componentDidMount() {
    const { showSellModal } = this.props
    if (showSellModal) {
      Router.updateQueryParams({ sell: undefined })
    }
  }

  async componentDidUpdate(prev: Props) {
    if (this.props.data?.archetype?.asset?.isDelisted) {
      Router.replace("/", { show_delisted_notice: true })
    }
    if (
      prev.data !== this.props.data &&
      prev.data?.response?.archetype?.asset !==
        this.props.data?.archetype?.asset &&
      !this.state.isAssetVisitorReported
    ) {
      this.setState({ isAssetVisitorReported: true })
      const { data, refetch } = this.props
      const asset = data?.archetype?.asset
      const bestAsk = data?.tradeSummary?.bestAsk
      if (bestAsk?.orderType === "ENGLISH" && bestAsk.closedAt) {
        pollEnglishAuction(bestAsk.closedAt, refetch)
      }
      if (asset) {
        await reportAssetVisitor(asset.relayId)
      }
    }

    // Track item view event
    if (!prev.data && !!this.props.data) {
      const item = this.props.data.archetype?.asset
      if (!item) {
        return
      }
      trackViewItem(item)
    }
  }

  isFungible() {
    const { data } = this.props
    return data?.archetype?.quantity !== "1"
  }

  ownedQuantity(): BigNumber {
    const { data } = this.props
    const archetype = data?.archetype
    return archetype?.ownedQuantity
      ? bn(archetype.ownedQuantity, archetype.asset?.decimals)
      : bn(0)
  }

  renderImage() {
    const { data } = this.props
    const asset = data?.archetype?.asset

    // asset must exist
    if (!asset) {
      return null
    }

    return (
      <Frame as="article" className="item--frame item--media-frame">
        <AssetCardHeader dataKey={asset} />

        <Lightbox
          overrides={
            asset.animationUrl
              ? {
                  Dialog: {
                    props: {
                      style: {
                        height: "min(calc(100vw - 150px), calc(100vh - 150px))",
                        width: "min(calc(100vw - 150px), calc(100vh - 150px))",
                      },
                    },
                  },
                }
              : undefined
          }
          trigger={open => (
            <Block onClick={open}>
              <AssetMedia
                asset={asset}
                autoPlay
                className="item--media"
                isMuted
                mediaStyles={{ objectFit: undefined, borderRadius: "initial" }}
                showControls
                showModel
                width={ITEM_MAX_WIDTH}
              />
            </Block>
          )}
        >
          <AssetMedia
            asset={asset}
            autoPlay
            backgroundColor={HUES.charcoal}
            className="item--lightbox-media"
            mediaStyles={{ objectFit: undefined }}
            showControls
            showModel
          />
        </Lightbox>
      </Frame>
    )
  }

  renderSummary() {
    const { data } = this.props
    const asset = data?.archetype?.asset
    if (!asset) {
      return null
    }
    const { assetContract, collection, creator } = asset
    const traitNodes = _.sortBy(getNodes(asset.traits), ["traitType", "value"])
    const numericTraitNodes = traitNodes.filter(
      t => t.floatValue !== null || t.intValue !== null,
    )

    const properties = traitNodes
      .filter(t => t.value)
      .map(trait => (
        <Property
          className="item--property"
          collection={collection}
          disablePercentages={this.isFungible()}
          key={trait.relayId}
          trait={trait}
        />
      ))
    const stats = numericTraitNodes
      .filter(t => t.displayType === "NUMBER")
      .map(trait => (
        <NumericTrait
          className="item--numeric-trait"
          collection={collection}
          key={trait.relayId}
          trait={trait}
        />
      ))
    const levels = numericTraitNodes
      .filter(t => !t.displayType)
      .map(trait => (
        <NumericTrait
          className="item--numeric-trait"
          collection={collection}
          key={trait.relayId}
          rankingMode
          trait={trait}
        />
      ))
    const boosts = numericTraitNodes
      .filter(t => t.displayType?.startsWith("BOOST"))
      .map(trait => (
        <Boost
          className="item--boost"
          collection={collection}
          key={trait.relayId}
          trait={trait}
        />
      ))
    const dates = numericTraitNodes
      .filter(t => t.displayType === "DATE")
      .map(trait => (
        <Date
          className="item--numeric-trait"
          key={trait.relayId}
          trait={trait}
        />
      ))

    return (
      <Frame className="item--frame item--summary-frame">
        <FrameProvider>
          {asset.description || creator ? (
            <Panel
              bodyClassName="item--description"
              icon="subject"
              maxHeight={200}
              mode="always-open"
              title={this.tr("Description")}
            >
              {creator ? (
                <section className="item--creator">
                  <AccountLink
                    className="item--creator-account"
                    dataKey={creator}
                    iconSize={32}
                    isCreator
                  />
                </section>
              ) : null}
              {asset.description ? (
                <Block className="item--description-text">
                  <ReactMarkdown linkTarget="_blank">
                    {stripHtml(asset.description)}
                  </ReactMarkdown>
                </Block>
              ) : null}
            </Panel>
          ) : null}
          {properties.length ? (
            <Panel
              bodyClassName="item--properties"
              icon="label"
              title={this.tr("Properties")}
            >
              {properties}
            </Panel>
          ) : null}
          {stats.length ? (
            <Panel
              bodyClassName="item--numeric-traits"
              icon="equalizer"
              title={this.tr("Stats")}
            >
              {stats}
            </Panel>
          ) : null}
          {levels.length ? (
            <Panel
              bodyClassName="item--numeric-traits"
              icon="stars"
              title={this.tr("Levels")}
            >
              {levels}
            </Panel>
          ) : null}
          {boosts.length ? (
            <Panel
              bodyClassName="item--boosts"
              icon="flash_on"
              title={this.tr("Boosts")}
            >
              {boosts}
            </Panel>
          ) : null}
          {dates.length ? (
            <Panel
              bodyClassName="item--numeric-traits"
              icon="calendar_today"
              title={this.tr("Dates")}
            >
              {dates}
            </Panel>
          ) : null}
          {collection ? (
            <Panel
              bodyClassName="item--about"
              icon="vertical_split"
              title={
                <Tr>
                  About{" "}
                  <TrVar example="OpenSea Creatures">{collection.name}</TrVar>
                </Tr>
              }
            >
              <div className="item--about-container">
                {collection.imageUrl && (
                  <Link href={`/collection/${collection.slug}`}>
                    <Image
                      className="item--about-image"
                      sizing="cover"
                      url={collection.imageUrl}
                      width={80}
                    />
                  </Link>
                )}
                <ReactMarkdown linkTarget="_blank">
                  {collection.description ??
                    this.tr(
                      "This collection has no description yet. Contact the owner of this collection about setting it up on OpenSea!",
                    )}
                </ReactMarkdown>
              </div>
              <Flex marginTop="24px">
                <SocialBar data={collection} justifyContent="flex-start" />
              </Flex>
            </Panel>
          ) : null}
          {assetContract && (
            <Panel
              bodyClassName="item--details"
              icon="ballot"
              title={this.tr("Details")}
            >
              <ChainInfo data={asset} />
            </Panel>
          )}
        </FrameProvider>
      </Frame>
    )
  }

  renderHeader() {
    const { archetype } = this.props.data ?? {}
    if (!archetype?.asset?.collection) {
      return null
    }
    const asset = archetype.asset
    const { collection } = asset
    const verificationStatus = readCollectionVerificationStatus(collection)
    return (
      <section className="item--header">
        <div className="item--collection-info">
          <div className="item--collection-detail">
            <CollectionLink collection={collection} />

            {verificationStatusHasBadge(verificationStatus) && (
              <Modal
                trigger={open => (
                  <UnstyledButton onClick={open}>
                    <VerificationIcon verificationStatus={verificationStatus} />
                  </UnstyledButton>
                )}
              >
                <CollectionStatusModal
                  address={asset.assetContract.address}
                  blockExplorerLink={asset.assetContract.blockExplorerLink}
                  verificationStatus={verificationStatus}
                />
              </Modal>
            )}
          </div>
          <div className="item--collection-toolbar-wrapper">
            {asset && (
              <Toolbar
                asset={asset}
                hideTransfer={
                  !asset.isListable || this.ownedQuantity().isZero()
                }
              />
            )}
          </div>
        </div>
        <header className="item--title">{asset.name ?? collection.name}</header>

        {registrarAddressToDomain[asset.assetContract.address] &&
        asset.name === "Unknown ENS name" ? (
          <EnsManualEntryModal asset={asset} />
        ) : null}
      </section>
    )
  }

  renderCounts() {
    const { data } = this.props
    const archetype = data?.archetype
    if (!archetype) {
      return null
    }
    const { quantity, asset } = archetype
    const decimals = asset?.decimals ?? 0
    const totalCount = bn(quantity, decimals)
    const viewsCount = bn(asset?.numVisitors ?? 0)
    const ownershipCount = bn(archetype.ownershipCount)
    const favoritesCount = bn(asset?.favoritesCount ?? 0)

    return (
      <section className="item--counts">
        {asset && (
          <Modal
            trigger={open => (
              <Count
                count={bn(ownershipCount)}
                icon="people"
                options={{
                  unit: this.tr("owner"),
                  onClick: open,
                  "aria-label": "Owners",
                }}
              />
            )}
          >
            <ItemOwnersModal
              archetype={getAssetInputType(asset)}
              numOwners={ownershipCount.toNumber()}
            />
          </Modal>
        )}

        <Count
          count={totalCount}
          icon="view_module"
          options={{
            unit: this.tr("total"),
            pluralize: false,
          }}
        />
        <Count
          count={this.ownedQuantity()}
          icon="person"
          options={{
            prefix: this.tr("You own"),
          }}
        />
        <Count
          count={viewsCount}
          icon="visibility"
          options={{
            unit: this.tr("view"),
          }}
        />

        {asset && (
          <Modal
            trigger={open => (
              <Count
                count={favoritesCount}
                icon="favorite"
                options={{
                  unit: this.tr("favorite"),
                  onClick: open,
                  "aria-label": "Favorited by",
                }}
              />
            )}
          >
            <AssetFavoritedByModal
              archetype={getAssetInputType(asset)}
              numFavorites={favoritesCount.toNumber()}
            />
          </Modal>
        )}
      </section>
    )
  }

  renderOwner() {
    const { data } = this.props
    const archetype = data?.archetype
    if (!archetype) {
      return null
    }
    const { asset } = archetype

    const ownership = getFirstNode(asset?.assetOwners)
    const decimals = asset?.decimals ?? 0
    const viewerCount = bn(asset?.numVisitors ?? 0)
    const favoritesCount = bn(asset?.favoritesCount ?? 0)

    return ownership ? (
      <section className="item--counts">
        <CenterAligned marginRight="20px">
          <AccountLink
            dataKey={ownership.owner}
            isOwner
            ownedQuantity={
              this.isFungible() ? bn(ownership.quantity, decimals) : undefined
            }
          />
        </CenterAligned>
        <Count
          count={viewerCount}
          icon="visibility"
          options={{
            unit: this.tr("view"),
          }}
        />

        {asset && (
          <Modal
            trigger={open => (
              <Count
                count={favoritesCount}
                icon="favorite"
                options={{
                  unit: this.tr("favorite"),
                  onClick: open,
                  "aria-label": "Favorited by",
                }}
              />
            )}
          >
            <AssetFavoritedByModal
              archetype={getAssetInputType(asset)}
              numFavorites={favoritesCount.toNumber()}
            />
          </Modal>
        )}
      </section>
    ) : null
  }

  renderPriceHistory({ isSmall }: { isSmall: boolean }) {
    const {
      data,
      variables: { archetype },
    } = this.props

    return (
      <div className="item--frame">
        <Panel
          icon="timeline"
          mode={isSmall ? "start-closed" : "start-open"}
          title={this.tr("Price History")}
        >
          {data ? (
            <PriceHistory
              hideAllTimeVolume
              variables={{ archetype, bucketSize: "DAY" }}
              xMaxTickCount={isSmall ? 6 : 12}
              yMaxTickCount={4}
            />
          ) : null}
        </Panel>
      </div>
    )
  }

  renderOrders() {
    const {
      data,
      refetch,
      showSellModal,
      variables: {
        archetype: { assetContractAddress, tokenId },
      },
    } = this.props

    const { wallet, login } = this.context

    const archetype = data?.archetype
    const asset = archetype?.asset
    const verificationStatus = asset?.collection
      ? readCollectionVerificationStatus(asset?.collection)
      : ""

    if (!data || !asset) {
      return null
    }

    const assetChain = asset.assetContract.chain

    const renderBidModal: (onClose: () => unknown) => React.ReactNode =
      onClose => (
        <BidModalContent
          archetypeData={archetype}
          bundleData={null}
          tradeData={data.tradeSummary}
          onClose={onClose}
          onOrderCreated={() => {
            clearCache()
            refetch()
          }}
        />
      )

    const renderCta = (ctaText: string, mode: "ask" | "bid") =>
      mode === "bid" &&
      !["safelisted", "verified"].includes(verificationStatus) ? (
        <VerifyCollectionModal
          assetId={asset.relayId}
          renderNextModal={renderBidModal}
          trigger={open => (
            <Button
              variant="secondary"
              onClick={() => {
                if (!wallet.getActiveAccountKey()) {
                  login()
                }
                open()
              }}
            >
              {ctaText}
            </Button>
          )}
        />
      ) : (
        <ConditionalWrapper
          condition={!!wallet.getActiveAccountKey()}
          wrapper={children => (
            <MultiStepModal
              initiallyOpen={!!wallet.getActiveAccountKey() && showSellModal}
              size="large"
              trigger={open => <Block onClick={open}>{children}</Block>}
            >
              {onClose =>
                mode === "ask" ? (
                  <SellModalContent
                    variables={{
                      archetype: {
                        assetContractAddress,
                        tokenId,
                        chain: assetChain,
                      },
                      chain: assetChain,
                    }}
                    onOrderCreated={() => {
                      clearCache()
                      refetch()
                    }}
                  />
                ) : (
                  renderBidModal(onClose)
                )
              }
            </MultiStepModal>
          )}
        >
          <Button
            variant="secondary"
            onClick={() => !wallet.getActiveAccountKey() && login()}
          >
            {ctaText}
          </Button>
        </ConditionalWrapper>
      )

    return (
      <React.Fragment>
        <Panel
          className="item--frame item--orders"
          icon="local_offer"
          isContentPadded={false}
          mode={!this.isFungible() ? "start-closed" : "start-open"}
          title={this.tr("Listings")}
        >
          <Orders
            collectionSlug={asset.collection.slug}
            footer={
              asset.isListable && !this.ownedQuantity().isZero() ? (
                <footer className="item--orders-footer">
                  <NetworkUnsupportedGate chainIdentifier={assetChain}>
                    <MultiChainTradingGate
                      chainIdentifier={assetChain}
                      collectionSlug={asset.collection.slug}
                      isFungible={this.isFungible()}
                    >
                      {isOrderV2Enabled({
                        chain: assetChain,
                        address: asset.assetContract.address,
                        slug: asset.collection.slug,
                      }) ? (
                        renderCta("Sell", "ask")
                      ) : (
                        <Button
                          href={
                            // TODO: Remove, but is needed for now due to the href
                            shouldShowMultichainModal(
                              assetChain,
                              asset.collection.slug,
                            )
                              ? undefined
                              : getAssetUrl(asset, "sell")
                          }
                          variant="secondary"
                        >
                          Sell
                        </Button>
                      )}
                    </MultiChainTradingGate>
                  </NetworkUnsupportedGate>
                </footer>
              ) : null
            }
            mode={this.isFungible() ? "full" : "minimal"}
            side="ask"
            variables={{
              isExpired: false,
              isValid: true,
              makerArchetype: {
                assetContractAddress,
                tokenId,
                chain: assetChain,
              },
              takerAssetIsPayment: true,
              sortAscending: true,
              sortBy: "TAKER_ASSETS_USD_PRICE",
            }}
          />
        </Panel>
        <Panel
          className="item--frame item--orders"
          icon="toc"
          isContentPadded={false}
          mode="start-open"
          title={this.tr("Offers")}
        >
          <Orders
            collectionSlug={archetype?.asset?.collection.slug}
            footer={
              !asset.isListable ? null : !this.isFungible() &&
                !this.ownedQuantity().isZero() ? null : (
                <footer className="item--orders-footer">
                  <NetworkUnsupportedGate chainIdentifier={assetChain}>
                    <MultiChainTradingGate
                      chainIdentifier={assetChain}
                      collectionSlug={asset.collection.slug}
                      isFungible={this.isFungible()}
                    >
                      {renderCta(this.tr("Make Offer"), "bid")}
                    </MultiChainTradingGate>
                  </NetworkUnsupportedGate>
                </footer>
              )
            }
            icon="toc"
            mode={this.isFungible() ? "full" : "minimal"}
            side="bid"
            variables={{
              isExpired: false,
              isValid: true,
              takerArchetype: {
                assetContractAddress,
                tokenId,
                chain: assetChain,
              },
              makerAssetIsPayment: true,
              sortBy: "MAKER_ASSETS_USD_PRICE",
            }}
          />
        </Panel>
      </React.Fragment>
    )
  }

  renderExchangeModal() {
    const { data } = this.props
    const { wallet } = this.context
    const archetype = data?.archetype

    // <span> here fixes https://ozone-networking.slack.com/archives/C017PMFKRJA/p1600924381009300

    return (
      <span>
        {archetype?.asset && wallet.activeAccount ? (
          <ExchangeModal
            accountAddress={wallet.activeAccount.address}
            imageUrl={archetype.asset.imageUrl ?? undefined}
          />
        ) : null}
      </span>
    )
  }

  renderTradeStation() {
    const {
      data,
      refetch,
      variables: {
        archetype: { assetContractAddress, tokenId },
      },
    } = this.props

    return data && data.archetype && assetContractAddress && tokenId ? (
      <div className="item--frame">
        <TradeStation
          archetypeData={data.archetype}
          bundleData={null}
          collectionSlug={data.archetype.asset?.collection.slug}
          data={data.tradeSummary}
          onOrdersChanged={() => {
            clearCache()
            refetch()
          }}
        />
      </div>
    ) : null
  }

  renderEventHistory() {
    const {
      variables: { archetype },
      data: { assetEvents },
    } = this.props

    return (
      <div className="item--frame item--trading-history">
        <EventHistory
          mode={this.isFungible() ? "fungible" : "nonfungible"}
          showFilters
          variables={{
            archetype,
            eventTypes:
              getNodes(assetEvents).length > 10
                ? ["AUCTION_SUCCESSFUL", "ASSET_TRANSFER"]
                : undefined,
            showAll: false,
          }}
        />
      </div>
    )
  }

  renderSimilarItems() {
    const { data } = this.props
    const collection = data?.archetype?.asset?.collection.slug
    const collections = collection ? [collection] : []
    const exclude = data.archetype?.asset?.tokenId
      ? [data.archetype?.asset?.tokenId]
      : undefined
    const onClick = (similarAssetData: Asset_data | null, index: number) => {
      if (!similarAssetData?.asset) {
        return
      }
      if (!data.archetype?.asset) {
        return
      }
      trackNavigateToSimilarItems(data.archetype.asset, {
        similarItem: readItem(similarAssetData.asset),
        index,
      })
    }

    return (
      <div className="item--frame">
        <Panel
          FooterButton={
            <CenterAligned padding="8px">
              <Button href={`/collection/${collection}`} variant="secondary">
                {this.tr("View Collection")}
              </Button>
            </CenterAligned>
          }
          icon="view_module"
          isContentPadded={false}
          mode="start-open"
          title={this.tr("More from this collection")}
        >
          <Block paddingBottom="8px" paddingTop="8px">
            <AssetSearchListPagination
              exclude={exclude}
              singlePage
              variables={{
                count: 10,
                collections,
                resultModel: "ASSETS",
              }}
              onClick={onClick}
            />
          </Block>
        </Panel>
      </div>
    )
  }

  renderOrderManager() {
    const {
      data,
      refetch,
      variables: { archetype },
    } = this.props
    if (this.ownedQuantity().isZero()) {
      return null
    }
    const asset = data?.archetype?.asset
    const assetChain = asset?.assetContract.chain
    return data && asset && asset.isListable && !this.isFungible() ? (
      <OrderManager
        collectionSlug={data.archetype?.asset?.collection.slug}
        sellRoute={`/assets/${asset.assetContract.address}/${asset.tokenId}/sell`}
        variables={{
          archetype,
          isBundle: false,
          chain: assetChain ?? undefined,
        }}
        onOrdersChanged={() => {
          clearCache()
          refetch()
        }}
      />
    ) : null
  }

  renderPrivateListingBanner() {
    const {
      variables: { archetype },
    } = this.props

    return this.isFungible() ? null : (
      <PrivateListingBanner variables={{ archetype, includePrivate: true }} />
    )
  }

  renderTrading() {
    return <div>{this.renderOrders()}</div>
  }

  renderUnlockableContent = () => {
    const {
      data,
      variables: { archetype },
    } = this.props

    if (!data?.archetype?.asset?.hasUnlockableContent) {
      return null
    }

    return (
      <div className="item--frame">
        <UnlockableContentModal
          variables={{ archetype, isOwner: !this.ownedQuantity().isZero() }}
        />
      </div>
    )
  }

  render() {
    const { data } = this.props
    const { announcementBanner, updateContext } = this.context
    const isSinglyOwned = data?.archetype?.ownershipCount === 1
    const asset = data?.archetype?.asset
    const imageUrl = asset?.imageUrl ?? asset?.collection.imageUrl
    const bestAskType = data?.tradeSummary?.bestAsk?.orderType
    const isDelisted = data?.archetype?.asset?.isDelisted

    const assetChain = asset?.assetContract.chain
    const announcement = announcementBanner?.announcementBanner
    const isChainAnnouncement =
      announcement?.displayMode == "CHAIN" &&
      announcement?.chain?.identifier == assetChain

    return (
      <AppContainer isPageAnnouncementShown={isChainAnnouncement}>
        {asset && !isDelisted && (
          <Head
            description={
              asset.description?.substring(0, SEO_MAX_DESC_LENGTH) ||
              asset.collection.description ||
              "View item history and listings"
            }
            image={imageUrl ? largeFrozenImage(imageUrl) : undefined}
            title={`${asset.name ?? asset.tokenId} - ${
              asset.collection.name
            } | OpenSea`}
          />
        )}

        {isChainAnnouncement && announcement != null && (
          <AnnouncementBanner
            ctaText={announcement.ctaText}
            heading={announcement.heading}
            headingMobile={announcement.headingMobile}
            text={announcement.text}
            url={announcement.url ?? ""}
            onClose={() => updateContext({ announcementBanner: undefined })}
          />
        )}

        {data && !isDelisted ? (
          <DivContainer>
            {this.renderPrivateListingBanner()}
            {this.renderOrderManager()}
            <div className="item--container">
              <Media greaterThanOrEqual="md">
                <div
                  /* TODO: Find a better way of identifying divs that are only used for tests. */
                  className="item--large"
                >
                  <div className="item--wrapper">
                    <div className="item--summary">
                      {this.renderImage()}
                      {this.renderSummary()}
                    </div>
                    <div className="item--main">
                      {this.renderHeader()}
                      {isSinglyOwned ? this.renderOwner() : this.renderCounts()}
                      {this.renderUnlockableContent()}
                      {this.renderTradeStation()}
                      {bestAskType === "ENGLISH" ? (
                        <>
                          {this.renderTrading()}
                          {this.renderPriceHistory({ isSmall: false })}
                        </>
                      ) : (
                        <>
                          {this.renderPriceHistory({ isSmall: false })}
                          {this.renderTrading()}
                        </>
                      )}
                    </div>
                  </div>
                  {this.renderEventHistory()}
                  {this.renderSimilarItems()}
                </div>
              </Media>

              <Media lessThan="md">
                <div className="item--small">
                  {this.renderHeader()}
                  {this.renderImage()}
                  {isSinglyOwned ? this.renderOwner() : this.renderCounts()}
                  {this.renderUnlockableContent()}
                  {this.renderTradeStation()}
                  {bestAskType === "ENGLISH" ? (
                    <>
                      {this.renderOrders()}
                      {this.renderPriceHistory({ isSmall: true })}
                    </>
                  ) : (
                    <>
                      {this.renderPriceHistory({ isSmall: true })}
                      {this.renderOrders()}
                    </>
                  )}
                  {this.renderSummary()}
                  {this.renderEventHistory()}
                  {this.renderSimilarItems()}
                </div>
              </Media>

              {this.renderExchangeModal()}
            </div>
          </DivContainer>
        ) : (
          <DivContainer>
            <div className="item--container item--loading">
              <div className="item--loader-wrapper">
                <Loader size="large" />
              </div>
            </div>
          </DivContainer>
        )}
      </AppContainer>
    )
  }
}

const DivContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  .item--container {
    max-width: 100%;
    padding: 8px;
    padding-bottom: 16px;
    width: ${ITEM_MAX_WIDTH}px;
    &.item--loading {
      min-height: calc(100vh - ${$nav_height});
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .item--loader-wrapper {
    text-align: center;
    margin-top: -${$nav_height};
  }

  .item--wrapper {
    display: flex;
    flex-direction: column;
  }

  .item--frame {
    margin: 4px 0;

    .item--description {
      padding: 30px;

      .item--description-text {
        * {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
        }
      }
    }
  }

  .item--summary {
    flex: 3 0;
    max-width: 43%;
    width: 0;
  }

  .item--summary-frame {
    background-color: ${props => props.theme.colors.header};
  }

  .item--main {
    flex: 4 0;
    margin-left: -20px;
  }

  .item--header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;

    .item--collection-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      max-width: 100%;

      .item--collection-detail {
        display: flex;
        align-items: center;
        max-width: 100%;
        width: 420px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .item--collection-toolbar-wrapper {
      max-width: fit-content;
    }

    .item--collection-link {
      color: ${$blue};
      font-size: 16px;
    }

    .item--title {
      font-size: 30px;
      font-weight: 600;
      max-width: 100%;
      width: 588px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .item--about-container {
    overflow: hidden;
    text-overflow: ellipsis;

    * {
      font-size: 14px;
    }
  }

  .item--about-image {
    float: left;
    margin-right: 10px;
    margin-top: 3px;
    height: 80px;
    width: 80px;
    border-radius: 5px;
  }

  .item--counts {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    color: ${props => props.theme.colors.text.subtle};

    > div {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .item--count-owner-icon {
      margin-left: 5px;
      margin-right: 20px;
    }
  }

  .item--creator {
    align-items: center;
    color: ${$grey};
    display: flex;

    .item--creator-account {
      height: 32px;
    }
  }

  .item--media-frame {
    margin: 20px 0;

    .item--media {
      cursor: pointer;
      max-height: 1000px;
      width: 100%;
      min-height: 500px;
    }
  }

  .item--properties {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;

    .item--property {
      margin: 5px;
      width: 150px;
    }
  }

  .item--numeric-traits {
    padding-bottom: 0;
    padding-top: 0;

    .item--numeric-trait {
      padding: 15px 5px;
    }
  }

  .item--boosts {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
    padding-bottom: 0;
    padding-top: 0;

    .item--boost {
      align-items: center;
      display: flex;
      flex-direction: column;
      padding: 15px 0;
      margin-right: 5px;
      min-width: 80px;
    }
  }

  .item--orders {
    flex: 1 0;
    max-width: 750px;

    .item--orders-footer {
      border-top: 1px solid ${props => props.theme.colors.border};
      padding: 10px;
    }
  }

  ${sizeMQ({
    tabletL: css`
      .item--container {
        padding-left: 0;
        padding-right: 0;
        width: 1280px;
      }

      .item--wrapper {
        flex-direction: row;
      }

      .item--frame {
        margin: 20px;
      }

      .item--header {
        margin: 20px 20px 15px;

        .item--collection-detail {
          width: 500px;
        }
        .item--title {
          width: 710px;
        }
      }

      .item--counts {
        margin: 20px;
      }

      .item--media-frame {
        margin: 20px;
      }

      .item--trading-history {
        margin-top: 0;
      }
    `,
  })}
`
