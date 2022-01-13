import React from "react"
import styled from "styled-components"
import { AssetSearchList } from "../../components/search/assets/AssetSearchList.react"
import Block from "../../design-system/Block"
import { useTranslations } from "../../hooks/useTranslations"
import { AccountFavorites_data } from "../../lib/graphql/__generated__/AccountFavorites_data.graphql"
import { AccountFavoritesQuery } from "../../lib/graphql/__generated__/AccountFavoritesQuery.graphql"
import { AssetSearchList_data } from "../../lib/graphql/__generated__/AssetSearchList_data.graphql"
import {
  graphql,
  paginate,
  PaginationProps,
  GraphQLProps,
  getNodes,
} from "../../lib/graphql/graphql"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import CenterAligned from "../common/CenterAligned.react"

const PAGE_SIZE = 16

type Props = { isCurrentUser?: boolean }

interface AccountFavoritesPaginateProps {
  data: AccountFavorites_data | null
}

export const AccountFavorites = ({
  page,
  data,
  isCurrentUser,
}: Props &
  AccountFavoritesPaginateProps &
  PaginationProps<AccountFavoritesQuery>) => {
  const { tr } = useTranslations()

  // TODO: @Meemaw find a way to properly reuse fragments here
  // Currently this seems super complicated as the underyling types are tied to SearchResultType which includes bundle
  const assets = getNodes(data?.account?.user?.favoriteAssets).map(asset => ({
    asset,
  })) as unknown as AssetSearchList_data

  return (
    <BlockContainer padding="16px">
      {!data ? (
        <AssetSearchList
          data={null}
          page={page}
          pageSize={PAGE_SIZE}
          showPlaceholderAssets={true}
          variant="grid"
        />
      ) : assets.length === 0 ? (
        <CenterAligned className="AccountFavorites--no-items">
          {tr(
            isCurrentUser
              ? "You haven't favorited any items yet"
              : "This user hasn't favorited any items yet",
          )}
        </CenterAligned>
      ) : (
        <AssetSearchList
          data={assets}
          page={page}
          pageSize={PAGE_SIZE}
          variant="grid"
        />
      )}
    </BlockContainer>
  )
}

const BlockContainer = styled(Block)`
  width: 100%;

  .AccountFavorites--no-items {
    margin: 24px 36px;
    height: 248px;
    border: 1px solid ${props => props.theme.colors.border};
    font-size: 28px;
    text-align: center;
  }
`

const query = graphql`
  query AccountFavoritesQuery(
    $cursor: String
    $count: Int = 16
    $identity: IdentityInputType!
  ) {
    ...AccountFavorites_data
      @arguments(cursor: $cursor, count: $count, identity: $identity)
  }
`

const dataFragment = graphql`
  fragment AccountFavorites_data on Query
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: "Int!" }
    identity: { type: "IdentityInputType!" }
  ) {
    account(identity: $identity) {
      user {
        favoriteAssets(first: $count, after: $cursor)
          @connection(key: "AccountFavorites_favoriteAssets") {
          edges {
            node {
              ...AssetCardHeader_data
              ...AssetCardContent_asset
              ...AssetCardFooter_asset
              ...asset_url
              relayId
              tokenId
              description
              name
              tokenId
              imageUrl
              animationUrl
              backgroundColor
              collection {
                description
                displayData {
                  cardDisplayStyle
                }
                imageUrl
                hidden
                name
                slug
              }
              assetContract {
                address
                chain
                openseaVersion
              }
              assetEventData {
                firstTransfer {
                  timestamp
                }
                lastSale {
                  unitPriceQuantity {
                    ...AssetQuantity_data
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const PaginatedAccountFavorites = paginate<
  AccountFavoritesQuery,
  Props & AccountFavoritesPaginateProps & GraphQLProps<AccountFavoritesQuery>
>(AccountFavorites, {
  query,
  fragments: { data: dataFragment },
})

export default withData<AccountFavoritesQuery, Props>(
  PaginatedAccountFavorites,
  query,
)
