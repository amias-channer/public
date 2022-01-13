import React from "react"
import styled from "styled-components"
import CollectionHeader from "../components/collections/CollectionHeader.react"
import CollectionsScroller from "../components/common/CollectionsScroller.react"
import Icon from "../components/common/Icon.react"
import InfoContainer from "../components/common/InfoContainer.react"
import InfoItem from "../components/common/InfoItem.react"
import Link from "../components/common/Link.react"
import SectionHeader from "../components/common/SectionHeader.react"
import FeatureFlag from "../components/featureFlag/FeatureFlag.react"
import Head from "../components/layout/Head.react"
import AssetSearchListPagination from "../components/search/assets/AssetSearchListPagination.react"
import AssetSearchView from "../components/search/assets/AssetSearchView.react"
import { BASE_SORT_OPTIONS, CATEGORIES, DEFAULT_IMG } from "../constants"
import { Z_INDEX } from "../constants/zIndex"
import AppContainer from "../containers/AppContainer.react"
import Block from "../design-system/Block"
import Button from "../design-system/Button"
import Flex from "../design-system/Flex"
import FlexEnd from "../design-system/FlexEnd"
import Text from "../design-system/Text"
import Tooltip from "../design-system/Tooltip"
import { trackCollectionPage } from "../lib/analytics/events/pageEvents"
import { AssetSearchQueryVariables } from "../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { collectionQuery } from "../lib/graphql/__generated__/collectionQuery.graphql"
import { graphql, GraphQLInitialProps } from "../lib/graphql/graphql"
import GraphQLPage from "../lib/graphql/GraphQLPage.react"
import { getCollectionChangeAdminUrl } from "../lib/helpers/admin"
import {
  getCollectionAssetCreateUrl,
  getCollectionEditUrl,
  getCollectionRoyaltiesUrl,
} from "../lib/helpers/collection"
import Router from "../lib/helpers/router"
import { largeFrozenImage } from "../lib/helpers/urls"
import QP from "../lib/qp/qp"
import { $nav_height } from "../styles/variables"

interface Props {
  slug: string
}

export default class Collection extends GraphQLPage<collectionQuery, Props> {
  static query = graphql`
    query collectionQuery(
      $collection: CollectionSlug!
      $collections: [CollectionSlug!]
      $collectionQuery: String
      $includeHiddenCollections: Boolean
      $numericTraits: [TraitRangeType!]
      $query: String
      $sortAscending: Boolean
      $sortBy: SearchSortBy
      $stringTraits: [TraitInputType!]
      $toggles: [SearchToggle!]
      $showContextMenu: Boolean
    ) {
      collection(collection: $collection) {
        isEditable
        bannerImageUrl
        name
        description
        imageUrl
        relayId
        representativeAsset {
          assetContract {
            openseaVersion
          }
        }
        ...collection_url
        ...CollectionHeader_data
      }
      assets: query {
        ...AssetSearch_data
          @arguments(
            collectionQuery: $collectionQuery
            collection: $collection
            collections: $collections
            includeHiddenCollections: $includeHiddenCollections
            numericTraits: $numericTraits
            query: $query
            resultModel: ASSETS
            sortAscending: $sortAscending
            sortBy: $sortBy
            stringTraits: $stringTraits
            toggles: $toggles
            showContextMenu: $showContextMenu
          )
      }
    }
  `

  static getInitialProps = QP.nextParser(
    { collectionSlug: QP.string, search: QP.Optional(QP.Search) },
    ({
      collectionSlug,
      search,
    }): GraphQLInitialProps<collectionQuery, Props> => {
      return {
        slug: collectionSlug,
        variables: {
          ...search,
          collection: collectionSlug,
          collections: [collectionSlug],
          ...search,
          showContextMenu: true,
        },
      }
    },
  )

  renderMetadata() {
    const { data } = this.props
    const collection = data?.collection
    return (
      <Head
        description={collection?.description || ""}
        image={
          collection?.bannerImageUrl
            ? largeFrozenImage(collection?.bannerImageUrl)
            : collection?.imageUrl || DEFAULT_IMG
        }
        title={`${
          collection?.name ? `${collection.name} Marketplace on ` : ""
        }OpenSea: Buy, sell, and explore digital assets`}
      />
    )
  }

  componentDidMount() {
    const { slug } = this.props
    trackCollectionPage({ collectionSlug: slug })
  }

  isCategory() {
    const { slug } = this.props
    return CATEGORIES.find(s => s.slug === slug) !== undefined
  }

  viewAllLink(searchQuery: AssetSearchQueryVariables) {
    const { slug } = this.props
    const isCategory = this.isCategory()
    const baseUrl = isCategory ? "/assets" : `/assets/${slug}`
    const fullSearchQuery = {
      ...searchQuery,
      categories: isCategory ? [slug] : undefined,
      resultModel: "ASSETS",
    }
    return (
      <span className="Collection--view-all-link">
        <Link
          href={
            baseUrl + Router.getMergedQueryString({ search: fullSearchQuery })
          }
        >
          <Text display="inline" variant="pre-title">
            View all
            <Icon className="Collection--view-all-icon" value="chevron_right" />
          </Text>
        </Link>
      </span>
    )
  }

  renderNoResults: React.ElementType = () => {
    const { data } = this.props
    return data?.collection ? (
      <div>
        <img src="/static/images/empty-results.svg" />
      </div>
    ) : null
  }

  renderAssetSections() {
    const {
      variables: { collection },
    } = this.props

    const collections = [collection]
    return (
      <>
        {this.isCategory() ? (
          <section className="Collection--trending">
            <Flex alignItems="center" flexDirection="column">
              <CollectionsScroller variables={{ categories: collections }} />
            </Flex>
          </section>
        ) : null}

        <section className="Collection--section">
          <SectionHeader
            iconValue="timelapse"
            left={
              <Text display="inline" variant="pre-title">
                Recently listed
              </Text>
            }
            right={this.viewAllLink({})}
          />
          <AssetSearchListPagination
            NoResults={this.renderNoResults}
            variables={{
              collections,
              sortBy: "LISTING_DATE",
              resultModel: "ASSETS",
            }}
          />
        </section>
        <section className="Collection--section">
          <SectionHeader
            iconValue="whatshot"
            left={
              <Text display="inline" variant="pre-title">
                Newly minted
              </Text>
            }
            right={this.viewAllLink({
              sortAscending: false,
              sortBy: "BIRTH_DATE",
            })}
          />
          <AssetSearchListPagination
            NoResults={this.renderNoResults}
            variables={{
              collections,
              sortBy: "BIRTH_DATE",
              resultModel: "ASSETS",
            }}
          />
        </section>
        <section className="Collection--section">
          <SectionHeader
            iconValue="insights"
            left={
              <Text display="inline" variant="pre-title">
                On auction
              </Text>
            }
            right={this.viewAllLink({
              sortAscending: false,
              toggles: ["ON_AUCTION"],
            })}
          />
          <AssetSearchListPagination
            NoResults={this.renderNoResults}
            variables={{
              collections,
              toggles: ["ON_AUCTION"],
              resultModel: "ASSETS",
            }}
          />
        </section>
      </>
    )
  }

  render() {
    const { data, variables } = this.props

    const isEditable = data?.collection?.isEditable
    // TODO: We need to figure out a better way to determine this in BE. defaultMintableAssetContract is faulty
    const isMintable = Boolean(
      data?.collection?.representativeAsset
        ? data?.collection?.representativeAsset?.assetContract.openseaVersion
        : true,
    )
    return (
      <AppContainer hideFooter>
        {this.renderMetadata()}

        <DivContainer>
          {data?.collection && isEditable && (
            <FlexEnd className="collection--manage-bar">
              <FeatureFlag flags={["staff"]}>
                <InfoContainer>
                  <InfoItem
                    icon={<Icon value="vpn_key" />}
                    tooltip="Django Admin"
                    url={getCollectionChangeAdminUrl(data?.collection.relayId)}
                  />
                </InfoContainer>
              </FeatureFlag>
              <InfoContainer marginLeft="20px" marginRight="20px">
                <InfoItem
                  icon={<Icon title="edit" value="edit" />}
                  tooltip="Edit"
                  url={getCollectionEditUrl(data?.collection)}
                />
                <InfoItem
                  icon={<Icon title="royalties" value="view_list" />}
                  tooltip="Royalties"
                  url={getCollectionRoyaltiesUrl(data?.collection)}
                />
              </InfoContainer>
              <Tooltip
                content="Your collection was not created on OpenSea"
                disabled={isMintable}
              >
                <span>
                  <Button
                    disabled={!isMintable}
                    href={getCollectionAssetCreateUrl(data?.collection)}
                  >
                    Add item
                  </Button>
                </span>
              </Tooltip>
            </FlexEnd>
          )}
          <CollectionHeader
            data={data?.collection}
            isCategory={this.isCategory()}
          />
          <Block className="collection--assets">
            <AssetSearchView
              data={data?.assets ?? null}
              fixedState={{
                collection: variables.collection,
                collections: variables.collections,
              }}
              includeCategoryFilter={false}
              includeCollectionFilter={false}
              initialState={variables}
              showContextMenu={data?.collection?.isEditable}
              sortOptions={BASE_SORT_OPTIONS}
              useCollectionMetadata
              variant="profile"
            />
          </Block>
        </DivContainer>
      </AppContainer>
    )
  }
}

const DivContainer = styled.div`
  .collection--assets {
    width: 80%;
    margin: 0 auto;
  }

  .collection--manage-bar {
    position: sticky;
    top: ${$nav_height};
    width: 100%;
    padding: 10px 20px;
    z-index: ${Z_INDEX.BADGE + 1};
    background-color: ${props => props.theme.colors.surface};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`
