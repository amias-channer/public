import React from "react"
import styled from "styled-components"
import ReferralsModal from "../../../../components/modals/ReferralsModal.react"
import { Menu } from "../../../../design-system/Menu"
import Modal from "../../../../design-system/Modal"
import { useTranslations } from "../../../../hooks/useTranslations"
import { useProfilePageItems, useProfilePageNavigation } from "../../hooks"
import {
  ProfilePageNavigationProps,
  TabNavItemProps,
  ProfilePageNavItemProps,
} from "../../types"
import { CountSkeleton } from "./CountSkeleton.react"

type Props = ProfilePageNavigationProps

export const ProfilePageNavbar = ({
  created: createdKey,
  collected: collectedKey,
  account: accountKey,
  isCurrentUser,
  identity,
  accountIdentifier,
}: Props) => {
  const { tr } = useTranslations()
  const { myItems, accountItems } = useProfilePageItems({
    createdKey,
    accountKey,
    collectedKey,
    isCurrentUser,
  })

  return (
    <StyledNavbar>
      {myItems.map(item => (
        <TabNavItem
          {...item}
          accountIdentifier={accountIdentifier}
          key={item.label}
        />
      ))}

      {accountItems.map(item => (
        <TabNavItem
          {...item}
          accountIdentifier={accountIdentifier}
          key={item.label}
        />
      ))}

      {isCurrentUser && (
        <Modal
          size="large"
          trigger={open => (
            <NavbarNavItem
              icon="monetization_on"
              label={tr("Referrals")}
              onClick={open}
            />
          )}
        >
          <ReferralsModal variables={{ referrer: identity }} />
        </Modal>
      )}
    </StyledNavbar>
  )
}

const StyledNavbar = styled(Menu).attrs({ direction: "horizontal" })`
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const NavbarNavItem = ({
  active,
  href,
  icon,
  label,
  count,
  onClick,
}: Omit<ProfilePageNavItemProps, "expanded">) => {
  return (
    <Menu.Item $active={active} href={href} onClick={onClick}>
      <Menu.Avatar icon={icon} />
      <Menu.Title>{label}</Menu.Title>
      {count !== undefined && (
        <Menu.Side>
          {count !== null ? (
            <Menu.Extra>{count}</Menu.Extra>
          ) : (
            <CountSkeleton />
          )}
        </Menu.Side>
      )}
    </Menu.Item>
  )
}

const TabNavItem = ({
  tab,
  accountIdentifier,
  ...rest
}: Omit<TabNavItemProps, "expanded">) => {
  const { active, href } = useProfilePageNavigation({ tab, accountIdentifier })
  return <NavbarNavItem {...rest} active={active} href={href} />
}

export default ProfilePageNavbar
