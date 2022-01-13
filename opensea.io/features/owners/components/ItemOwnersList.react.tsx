import React from "react"
import { useLazyLoadQuery, usePaginationFragment } from "react-relay"
import AccountItem from "../../../components/common/AccountItem"
import { LazyLoadList } from "../../../components/common/LazyLoadList"
import type { BlockProps } from "../../../design-system/Block"
import { ListItem } from "../../../design-system/List"
import { ItemOwnersList_data$key } from "../../../lib/graphql/__generated__/ItemOwnersList_data.graphql"
import { ItemOwnersListLazyQuery } from "../../../lib/graphql/__generated__/ItemOwnersListLazyQuery.graphql"
import { ItemOwnersListQuery } from "../../../lib/graphql/__generated__/ItemOwnersListQuery.graphql"
import { getNodes, graphql } from "../../../lib/graphql/graphql"
import { pluralize } from "../../../lib/helpers/stringUtils"

const PAGE_SIZE = 20
const LISTITEM_HEIGHT = 70

type Props = {
  dataKey: ItemOwnersList_data$key
  overrides?: { Root?: { props: BlockProps } }
}

export const ItemOwnersList = ({ dataKey, overrides }: Props) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ItemOwnersListQuery,
    ItemOwnersList_data$key
  >(
    graphql`
      fragment ItemOwnersList_data on Query
      @argumentDefinitions(
        archetype: { type: "ArchetypeInputType!" }
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 20 }
      )
      @refetchable(queryName: "ItemOwnersListQuery") {
        archetype(archetype: $archetype) {
          asset {
            assetOwners(after: $cursor, first: $count)
              @connection(key: "ItemOwnersList_assetOwners") {
              edges {
                node {
                  relayId
                  quantity
                  owner {
                    ...AccountItem_data
                  }
                }
              }
            }
          }
        }
      }
    `,
    dataKey,
  )

  const accounts = getNodes(data.archetype?.asset?.assetOwners)
  return (
    <LazyLoadList
      itemHeight={LISTITEM_HEIGHT}
      overrides={overrides}
      pageSize={PAGE_SIZE}
      pagination={{ loadNext, hasNext, isLoadingNext }}
    >
      {accounts.map(account => (
        <AccountItem
          Item={ListItem}
          dataKey={account.owner}
          key={account.relayId}
          side={
            <ListItem.Description>
              {account.quantity}{" "}
              {pluralize("item", parseInt(account.quantity, 10))}
            </ListItem.Description>
          }
        />
      ))}
    </LazyLoadList>
  )
}

type LazyProps = Omit<Props, "dataKey"> & ItemOwnersListLazyQuery["variables"]

export const ItemsOwnersLazyList = ({ archetype, ...rest }: LazyProps) => {
  const dataKey = useLazyLoadQuery<ItemOwnersListLazyQuery>(
    graphql`
      query ItemOwnersListLazyQuery($archetype: ArchetypeInputType!) {
        ...ItemOwnersList_data @arguments(archetype: $archetype)
      }
    `,
    { archetype },
  )

  return <ItemOwnersList dataKey={dataKey} {...rest} />
}

type ItemOwnersListSkeletonProps = {
  count?: number
  overrides?: { Root?: { props: BlockProps } }
}

export const ItemOwnersListSkeleton = ({
  count,
  overrides,
}: ItemOwnersListSkeletonProps) => {
  return (
    <LazyLoadList.Skeleton
      count={count}
      overrides={overrides}
      pageSize={PAGE_SIZE}
      renderItem={index => <AccountItem.Skeleton key={index} sideDescription />}
    />
  )
}
