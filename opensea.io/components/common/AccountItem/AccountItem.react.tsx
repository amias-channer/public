import React, { memo } from "react"
import { useFragment } from "react-relay"
import Flex from "../../../design-system/Flex"
import ItemComponent from "../../../design-system/Item"
import ItemSkeleton from "../../../design-system/ItemSkeleton"
import { ListItem } from "../../../design-system/List"
import { useTranslations } from "../../../hooks/useTranslations"
import { AccountItem_data$key } from "../../../lib/graphql/__generated__/AccountItem_data.graphql"
import { graphql } from "../../../lib/graphql/graphql"
import { getAccountLink } from "../../../lib/helpers/accounts"
import { truncateAddress } from "../../../lib/helpers/addresses"
import AccountBadge from "../AccountBadge.react"

type Props = {
  Item?: typeof ItemComponent | typeof ListItem
  side?: React.ReactNode
  dataKey: AccountItem_data$key
}

const AccountItemBase = memo(function AccountItem({
  Item = ItemComponent,
  dataKey,
  side,
}: Props) {
  const { tr } = useTranslations()
  const account = useFragment(
    graphql`
      fragment AccountItem_data on AccountType {
        ...accounts_url
        imageUrl
        discordId
        displayName
        config
        address
      }
    `,
    dataKey,
  )

  const { displayName, discordId, address, imageUrl, config } = account

  return (
    <Item href={getAccountLink(account)}>
      {imageUrl ? (
        <Item.Avatar $objectFit="initial" borderRadius="50%" src={imageUrl} />
      ) : (
        <Item.Avatar icon="account_circle" />
      )}
      <Item.Content>
        <Item.Title>
          <Flex alignItems="center">
            {displayName || tr("Unnamed")}
            <AccountBadge config={config} discordId={discordId} />
          </Flex>
        </Item.Title>
        <Item.Description>{truncateAddress(address)}</Item.Description>
      </Item.Content>
      {side && <Item.Side>{side}</Item.Side>}
    </Item>
  )
})

type AccountItemSkeletonProps = {
  sideTitle?: boolean
  sideDescription?: boolean
}

const AccountItemSkeleton = memo(function AccountItemSkeleton({
  sideTitle,
  sideDescription,
}: AccountItemSkeletonProps) {
  return (
    <ItemSkeleton>
      <ItemSkeleton.Avatar />
      <ItemSkeleton.Content>
        <ItemSkeleton.Title />
        <ItemSkeleton.Description />
      </ItemSkeleton.Content>
      {(sideTitle || sideDescription) && (
        <ItemSkeleton.Side>
          {sideTitle && <ItemSkeleton.Title />}
          {sideDescription && <ItemSkeleton.Description />}
        </ItemSkeleton.Side>
      )}
    </ItemSkeleton>
  )
})

export const AccountItem = Object.assign(AccountItemBase, {
  Skeleton: AccountItemSkeleton,
})

export default AccountItem
