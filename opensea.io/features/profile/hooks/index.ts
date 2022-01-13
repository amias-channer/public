import { useRouter } from "next/router"
import { useFragment } from "react-relay"
import { useTranslations } from "../../../hooks/useTranslations"
import { profilePageQueries_account$key } from "../../../lib/graphql/__generated__/profilePageQueries_account.graphql"
import { profilePageQueries_collected$key } from "../../../lib/graphql/__generated__/profilePageQueries_collected.graphql"
import { profilePageQueries_created$key } from "../../../lib/graphql/__generated__/profilePageQueries_created.graphql"
import { getMergedQueryString } from "../../../lib/helpers/router"
import {
  ProfilePageAccountFragment,
  ProfilePageCollectedFragment,
  ProfilePageCreatedFragment,
} from "../queries/profilePageQueries"
import { TabNavItem, PageTab } from "../types"

type Props = {
  createdKey: profilePageQueries_created$key | null
  collectedKey: profilePageQueries_collected$key | null
  accountKey: profilePageQueries_account$key | null
  isCurrentUser: boolean
}

export const useProfilePageItems = ({
  createdKey,
  collectedKey,
  accountKey,
  isCurrentUser,
}: Props) => {
  const { tr } = useTranslations()
  const account = useFragment(ProfilePageAccountFragment, accountKey)
  const created = useFragment(ProfilePageCreatedFragment, createdKey)
  const collected = useFragment(ProfilePageCollectedFragment, collectedKey)

  const myItems: TabNavItem[] = [
    {
      count: collected ? collected.search?.totalCount ?? 0 : null,
      icon: "grid_on",
      label: tr("Collected"),
      tab: undefined,
    },
    {
      count: created ? created.search?.totalCount ?? 0 : null,
      icon: "format_paint",
      label: tr("Created"),
      tab: "created",
    },
    {
      count: account ? account.user?.favoriteAssetCount ?? 0 : null,
      icon: "favorite_border",
      label: tr("Favorited"),
      tab: "favorites",
    },
  ]

  if (isCurrentUser) {
    myItems.push({
      count: account ? account.privateAssetCount ?? 0 : null,
      icon: "visibility_off",
      label: tr("Hidden"),
      tab: "private",
    })
  }

  const accountItems: TabNavItem[] = [
    {
      icon: "history",
      label: tr("Activity"),
      tab: "activity",
    },
    {
      icon: "list",
      label: tr("Offers"),
      tab: "bids",
    },
  ]

  return { myItems, accountItems }
}

export const useProfilePageNavigation = ({
  tab,
  accountIdentifier,
}: {
  tab: PageTab
  accountIdentifier: string | undefined
}) => {
  const router = useRouter()
  const pageTab = router.query?.["tab"] as PageTab
  const active = pageTab === tab
  const href = `/${accountIdentifier ?? "account"}${getMergedQueryString({
    tab,
  })}`
  return { active, href }
}
