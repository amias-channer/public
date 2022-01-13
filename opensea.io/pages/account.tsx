import React, { createContext } from "react"
import { isValidAddress } from "ethereumjs-util"
import { graphql } from "react-relay"
import styled, { css } from "styled-components"
import AccountFavorites from "../components/accounts/AccountFavorites.react"
import { sizeMQ } from "../components/common/MediaQuery.react"
import AccountHeader from "../components/layout/AccountHeader.react"
import Head from "../components/layout/Head.react"
import ActivitySearch from "../components/search/activity/ActivitySearch.react"
import AssetSearchView from "../components/search/assets/AssetSearchView.react"
import OfferSearch from "../components/search/offers/OfferSearch.react"
import { ACCOUNT_SPECIFIC_SORT_OPTIONS, BASE_SORT_OPTIONS } from "../constants"
import AppContainer from "../containers/AppContainer.react"
import Flex from "../design-system/Flex"
import FlexVertical from "../design-system/FlexVertical"
import { Media } from "../design-system/Media"
import ProfilePageNavbar from "../features/profile/components/ProfilePage/ProfilePageNavbar.react"
import ProfilePageSidebar, {
  Divider,
} from "../features/profile/components/ProfilePage/ProfilePageSidebar.react"
import { PageTab, ProfilePageNavigationProps } from "../features/profile/types"
import { trackAccountPage } from "../lib/analytics/events/pageEvents"
import API from "../lib/api"
import Wallet from "../lib/chain/wallet"
import accountQueryNode, {
  accountQuery,
  IdentityInputType,
} from "../lib/graphql/__generated__/accountQuery.graphql"
import AssetSearchQueryNode, {
  CollectionSort,
  SearchResultModel,
  SearchSortBy,
} from "../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { aliasQuery } from "../lib/graphql/environment/middlewares/cacheMiddleware"
import { GraphQLInitialProps } from "../lib/graphql/graphql"
import GraphQLPage from "../lib/graphql/GraphQLPage.react"
import { fetchAccount, resolveIdentity } from "../lib/helpers/addresses"
import Router from "../lib/helpers/router"
import { isAscii, truncateText } from "../lib/helpers/stringUtils"
import { UnreachableCaseError } from "../lib/helpers/type"
import QP from "../lib/qp/qp"

const LISTING_DATE_SORT: SearchSortBy = "LISTING_DATE"
const SINGLE_ITEMS: SearchResultModel = "ASSETS"
const TRANSFER_DATE_SORT: SearchSortBy = "LAST_TRANSFER_DATE"

type AccountPageTab = Exclude<PageTab, "referrals">

interface Props {
  chain?: string
  path: string
  tab: AccountPageTab
  identity: IdentityInputType
  isCurrentUser: boolean
  identifier: string | undefined
}

// We cache this data as the header will not change between tabs
interface State {
  exclude: string[]
}

// We use to hide locally hide assets that are hidden/unhidden without having
// to refetch the whole connection. We do it this way because doing Relay
// local state update for that connection seems to be impossible
// TODO: revisit in future and see if we can update that directly from the mutation's updater fn
interface AccountPageContext {
  exclude: string[]
  setExclude: (exclude: string[]) => unknown
}

const DEFAULT_CONTEXT: AccountPageContext = {
  exclude: [],
  setExclude: () => {},
}

export const AccountPageContext = createContext(DEFAULT_CONTEXT)

aliasQuery(accountQueryNode, AssetSearchQueryNode)

const ProfilePageQuery = graphql`
  query accountQuery(
    $categories: [CollectionSlug!]
    $chains: [ChainScalar!]
    $collection: CollectionSlug
    $collectionQuery: String
    $collections: [CollectionSlug!]
    $eventTypes: [EventType!]
    $identity: IdentityInputType
    $creator: IdentityInputType
    $isActivityTab: Boolean!
    $isAssetsTab: Boolean!
    $isOffersTab: Boolean!
    $isCreatedTab: Boolean!
    $isPrivateTab: Boolean!
    $isPrivate: Boolean!
    $isSingleCollection: Boolean!
    $numericTraits: [TraitRangeType!]
    $query: String
    $resultModel: SearchResultModel
    $sortAscending: Boolean
    $sortBy: SearchSortBy
    $stringTraits: [TraitInputType!]
    $toggles: [SearchToggle!]
    $showContextMenu: Boolean!
    $isCurrentUser: Boolean!
  ) {
    account(identity: $identity) {
      address
      imageUrl
      user {
        username
        publicUsername
      }

      ...profilePageQueries_account @arguments(isCurrentUser: $isCurrentUser)
      ...AccountHeader_data
      ...wallet_accountKey
      privateAssetCount
    }
    collection(collection: $collection) {
      description
      imageUrl
      name
    }
    sidebarCollected: query {
      ...profilePageQueries_collected @arguments(identity: $identity)
    }
    sidebarCreated: query {
      ...profilePageQueries_created @arguments(identity: $identity)
    }
    assets: query @include(if: $isAssetsTab) {
      ...AssetSearch_data
        @arguments(
          categories: $categories
          chains: $chains
          collection: $collection
          collectionQuery: $collectionQuery
          collectionSortBy: ASSET_COUNT
          collections: $collections
          identity: $identity
          assetOwner: $identity
          includeHiddenCollections: false
          numericTraits: $numericTraits
          query: $query
          resultModel: $resultModel
          shouldShowQuantity: $isAssetsTab
          sortAscending: $sortAscending
          sortBy: $sortBy
          stringTraits: $stringTraits
          toggles: $toggles
          showContextMenu: $showContextMenu
          includeSearchFilterData: false
        )
    }
    activity: query @include(if: $isActivityTab) {
      ...ActivitySearch_data
        @arguments(
          categories: $categories
          chains: $chains
          collectionQuery: $collectionQuery
          collection: $collection
          collections: $collections
          collectionSortBy: SEVEN_DAY_VOLUME
          eventTypes: $eventTypes
          identity: $identity
          includeHiddenCollections: false
          isSingleCollection: $isSingleCollection
        )
    }
    offers: query @include(if: $isOffersTab) {
      ...OfferSearch_data
        @arguments(
          categories: $categories
          chains: $chains
          collectionQuery: $collectionQuery
          collections: $collections
          collectionSortBy: SEVEN_DAY_VOLUME
          identity: $identity
          includeHiddenCollections: false
        )
    }
    created: query @include(if: $isCreatedTab) {
      ...AssetSearch_data
        @arguments(
          categories: $categories
          chains: $chains
          collection: $collection
          collectionQuery: $collectionQuery
          collectionSortBy: NAME
          collections: $collections
          numericTraits: $numericTraits
          query: $query
          resultModel: $resultModel
          shouldShowQuantity: $isAssetsTab
          sortAscending: $sortAscending
          sortBy: $sortBy
          stringTraits: $stringTraits
          toggles: $toggles
          creator: $creator
          showContextMenu: $showContextMenu
          includeSearchFilterData: false
        )
    }
    private: query @include(if: $isPrivateTab) {
      ...AssetSearch_data
        @arguments(
          categories: $categories
          chains: $chains
          collection: $collection
          collectionQuery: $collectionQuery
          collectionSortBy: NAME
          collections: $collections
          identity: $identity
          assetOwner: $identity
          includeHiddenCollections: true
          numericTraits: $numericTraits
          query: $query
          resultModel: $resultModel
          shouldShowQuantity: true
          sortAscending: $sortAscending
          sortBy: $sortBy
          stringTraits: $stringTraits
          toggles: $toggles
          isPrivate: $isPrivate
          showContextMenu: $showContextMenu
          includeCollectionFilter: false
          includeSearchFilterData: false
        )
    }
  }
`

export default class Account extends GraphQLPage<accountQuery, Props, State> {
  static query = ProfilePageQuery

  state: State = {
    exclude: [],
  }

  setExclude = (exclude: string[]) => {
    this.setState({ exclude })
  }

  static getInitialProps = QP.nextParser(
    {
      chainIdentifier: QP.Optional(QP.ChainIdentifier),
      collectionSlug: QP.Optional(QP.string),
      identifier: QP.Optional(QP.string),
      search: QP.Optional(QP.Search),
      tab: QP.Optional(QP.string),
    },
    async (
      { chainIdentifier, collectionSlug, identifier, search, tab: tab_ },
      context,
    ): Promise<GraphQLInitialProps<accountQuery, Props>> => {
      const tab = tab_ as AccountPageTab
      let identity: IdentityInputType = {}
      let isCurrentUser = false

      if (identifier) {
        identity = resolveIdentity(identifier, chainIdentifier)
        if (new Wallet(context).isCurrentIdentity(identity)) {
          isCurrentUser = true
        }

        if (identity.address) {
          const account = await fetchAccount(identity)
          const publicUsername = account?.user?.publicUsername

          if (
            publicUsername &&
            !isValidAddress(publicUsername) &&
            isAscii(publicUsername)
          ) {
            await Router.replace(
              `/${publicUsername}${collectionSlug ? `/${collectionSlug}` : ""}`,
              Router.getQueryParams(),
              context.res,
            )
          }
        }
      } else {
        identity = new Wallet(context).getActiveAccountKey() ?? {}
        isCurrentUser = true
      }

      const isCreatedTab = tab === "created"
      const isPrivateTab = tab === "private"
      const isAssetsTab = tab === undefined

      const path = Router.getPath(context)
      const topLevelPath = path.split("/")[1]

      return {
        identifier,
        chain: chainIdentifier,
        path:
          topLevelPath === identifier
            ? `/${identifier}`
            : topLevelPath === "accounts"
            ? `/accounts/${identifier}`
            : "/account",
        tab,
        identity,
        isCurrentUser,
        variables: {
          isCurrentUser,
          showContextMenu:
            (isPrivateTab || isAssetsTab || isCreatedTab) && isCurrentUser,
          creator: isCreatedTab ? identity : undefined,
          identity,
          collections: collectionSlug ? [collectionSlug] : [],
          isActivityTab: tab === "activity",
          isAssetsTab,
          isOffersTab: tab === "bids",
          isPrivateTab,
          isPrivate: isPrivateTab,
          isCreatedTab,
          isSingleCollection: !!collectionSlug,
          resultModel: isCreatedTab
            ? SINGLE_ITEMS
            : identifier
            ? undefined
            : SINGLE_ITEMS,
          sortBy: isCreatedTab
            ? "CREATED_DATE"
            : identifier
            ? LISTING_DATE_SORT
            : TRANSFER_DATE_SORT,
          ...search,
          collection: collectionSlug,
        },
      }
    },
  )

  componentDidMount() {
    const { variables, isCurrentUser } = this.props
    trackAccountPage(variables)
    const { isPrivateTab } = variables
    if (isPrivateTab && !isCurrentUser) {
      Router.push(Router.getPathWithMergedQuery({ tab: undefined }))
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { tab } = this.props
    if (prevProps.tab !== tab) {
      this.setState({ exclude: [] })
    }
  }

  renderMetadata() {
    const { data, variables } = this.props
    const account = data?.account
    const resolvedIdentifier =
      account?.user?.publicUsername ||
      variables.identity?.name ||
      account?.address
    const collection = data?.collection
    const canonicalUrl =
      resolvedIdentifier &&
      `${API.getWebUrl()}/accounts/${resolvedIdentifier}${Router.getMergedQueryString()}`

    if (!resolvedIdentifier) {
      return <Head title={`My Account | OpenSea`} url={canonicalUrl} />
    }

    const name = truncateText(resolvedIdentifier, 12)
    const description = `Check out ${name}'s${
      collection ? " " + collection.name : ""
    } NFTs on OpenSea, the largest marketplace for crypto collectibles.`
    return (
      <Head
        description={description}
        image={account?.imageUrl || undefined}
        title={`${name}'s ${
          collection ? collection.name : "account"
        } | OpenSea`}
        url={canonicalUrl}
      />
    )
  }

  renderAssets = () => {
    const { data, path, variables, tab, isCurrentUser } = this.props
    const { exclude } = this.state
    const {
      identity,
      isCreatedTab,
      isPrivateTab,
      isAssetsTab,
      ...otherVariables
    } = variables

    const assets = isCreatedTab
      ? data?.created
      : isPrivateTab
      ? data?.private
      : data?.assets

    const collectionSortBy: CollectionSort = isAssetsTab
      ? "ASSET_COUNT"
      : "NAME"

    return (
      <AccountPageContext.Provider
        value={{ exclude, setExclude: this.setExclude }}
      >
        <StyledAssetsContainer>
          <AssetSearchView
            collectionSortBy={collectionSortBy}
            data={assets ?? null}
            defaultState={{
              // Show recently listed on others' accounts and recently received on your own account.
              resultModel: isCurrentUser ? SINGLE_ITEMS : undefined,
              // Show all listings (default behavior) on others' accounts and individual assets on your own account.
              sortBy: isCurrentUser ? TRANSFER_DATE_SORT : LISTING_DATE_SORT,
            }}
            filterClassName="account--AssetSearchView-filter"
            fixedState={{
              collectionSortBy,
              includeHiddenCollections: false,
              ...(isCreatedTab ? { creator: identity } : { identity }),
            }}
            hideAssetCount={isPrivateTab || isCreatedTab}
            initialState={
              isCreatedTab ? otherVariables : { ...otherVariables, identity }
            }
            key={tab}
            path={path}
            resultsClassName="account--AssetSearchView-results"
            showContextMenu={otherVariables.showContextMenu}
            showFilter
            showModelDropdown
            showPills
            showSelector={isCurrentUser}
            sidebarCollapsed
            sortOptions={BASE_SORT_OPTIONS.concat(
              ACCOUNT_SPECIFIC_SORT_OPTIONS,
            )}
            variant="profile"
          />
        </StyledAssetsContainer>
      </AccountPageContext.Provider>
    )
  }

  renderActivity = () => {
    const { data, path, variables } = this.props

    return (
      <ActivitySearch
        data={data?.activity || null}
        fixedState={{
          collectionSortBy: "SEVEN_DAY_VOLUME",
          identity: variables.identity,
          includeHiddenCollections: false,
        }}
        hidePriceHistory
        initialState={variables}
        path={path}
        variant="profile"
      />
    )
  }

  renderOffers = () => {
    const { data, path, variables, isCurrentUser } = this.props

    return (
      <OfferSearch
        data={data?.offers || null}
        fixedState={{
          collectionSortBy: "SEVEN_DAY_VOLUME",
          identity: variables.identity,
          includeHiddenCollections: false,
        }}
        initialState={variables}
        isCurrentUser={isCurrentUser}
        path={path}
        variant="profile"
      />
    )
  }

  renderTabContent = () => {
    const { tab, isCurrentUser, identity } = this.props
    switch (tab) {
      case undefined:
      case "created":
      case "private":
        return this.renderAssets()
      case "favorites":
        return (
          <AccountFavorites
            isCurrentUser={isCurrentUser}
            variables={{ identity }}
          />
        )
      case "activity":
        return this.renderActivity()
      case "bids":
        return this.renderOffers()
      default:
        throw new UnreachableCaseError(tab)
    }
  }

  render() {
    const { data, isCurrentUser, identity, identifier } = this.props
    const navigationProps: ProfilePageNavigationProps = {
      account: data?.account ?? null,
      collected: data?.sidebarCollected ?? null,
      created: data?.sidebarCreated ?? null,
      accountIdentifier: identifier,
      identity,
      isCurrentUser,
    }

    return (
      <AppContainer hideFooter>
        {this.renderMetadata()}

        <AccountHeader
          dataKey={data?.account || null}
          isCurrent={isCurrentUser}
        />

        <Media lessThan="sm">
          <ProfilePageNavbar {...navigationProps} />
          {this.renderTabContent()}
        </Media>

        <Media greaterThanOrEqual="sm">
          {(mediaClassNames, renderChildren) =>
            renderChildren && (
              <FlexVertical className={mediaClassNames} flex="1">
                <Divider />
                <Flex flex="1">
                  <ProfilePageSidebar {...navigationProps} />
                  <VerticalDivider />

                  {this.renderTabContent()}
                </Flex>
              </FlexVertical>
            )
          }
        </Media>
      </AppContainer>
    )
  }
}

const VerticalDivider = styled.div`
  background: ${props => props.theme.colors.border};
  min-height: 100%;
  min-width: 1px;
`

const StyledAssetsContainer = styled.div`
  width: 100%;

  ${sizeMQ({
    mobile: css`
      .account--AssetSearchView-results {
        padding: 0 28px;
      }
    `,
  })}
`
