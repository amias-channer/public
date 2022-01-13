import React from "react"
import { useLazyLoadQuery, usePaginationFragment } from "react-relay"
import type { BlockProps } from "../../design-system/Block"
import { ListItem } from "../../design-system/List"
import { AssetFavoritedByList_data$key } from "../../lib/graphql/__generated__/AssetFavoritedByList_data.graphql"
import { AssetFavoritedByListLazyQuery } from "../../lib/graphql/__generated__/AssetFavoritedByListLazyQuery.graphql"
import { AssetFavoritedByListQuery } from "../../lib/graphql/__generated__/AssetFavoritedByListQuery.graphql"
import { graphql, getNodes } from "../../lib/graphql/graphql"
import { AccountItem } from "../common/AccountItem"
import LazyLoadList from "../common/LazyLoadList"

const PAGE_SIZE = 20
const LISTITEM_HEIGHT = 70

type Props = {
  dataKey: AssetFavoritedByList_data$key
  overrides?: { Root?: { props: BlockProps } }
}

export const AssetFavoritedByList = ({ dataKey, overrides }: Props) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    AssetFavoritedByListQuery,
    AssetFavoritedByList_data$key
  >(
    graphql`
      fragment AssetFavoritedByList_data on Query
      @argumentDefinitions(
        archetype: { type: "ArchetypeInputType!" }
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 20 }
      )
      @refetchable(queryName: "AssetFavoritedByListQuery") {
        archetype(archetype: $archetype) {
          asset {
            favoritedBy(after: $cursor, first: $count)
              @connection(key: "AssetFavoritedByList_asset_favoritedBy") {
              edges {
                node {
                  relayId
                  ...AccountItem_data
                }
              }
            }
          }
        }
      }
    `,
    dataKey,
  )

  const accounts = getNodes(data.archetype?.asset?.favoritedBy)

  return (
    <LazyLoadList
      itemHeight={LISTITEM_HEIGHT}
      overrides={overrides}
      pageSize={PAGE_SIZE}
      pagination={{ loadNext, hasNext, isLoadingNext }}
    >
      {accounts.map(account => (
        <AccountItem Item={ListItem} dataKey={account} key={account.relayId} />
      ))}
    </LazyLoadList>
  )
}

type LazyProps = Omit<Props, "dataKey"> &
  AssetFavoritedByListLazyQuery["variables"]

export const AssetFavoritedByLazyList = ({ archetype, ...rest }: LazyProps) => {
  const dataKey = useLazyLoadQuery<AssetFavoritedByListLazyQuery>(
    graphql`
      query AssetFavoritedByListLazyQuery($archetype: ArchetypeInputType!) {
        ...AssetFavoritedByList_data @arguments(archetype: $archetype)
      }
    `,
    { archetype },
  )

  return <AssetFavoritedByList dataKey={dataKey} {...rest} />
}

type AssetFavoritedByListSkeletonProps = {
  numFavorites?: number
  overrides?: { Root?: { props: BlockProps } }
}

export const AssetFavoritedByListSkeleton = ({
  numFavorites,
  overrides,
}: AssetFavoritedByListSkeletonProps) => {
  return (
    <LazyLoadList.Skeleton
      count={numFavorites}
      overrides={overrides}
      pageSize={PAGE_SIZE}
      renderItem={index => <AccountItem.Skeleton key={index} />}
    />
  )
}
