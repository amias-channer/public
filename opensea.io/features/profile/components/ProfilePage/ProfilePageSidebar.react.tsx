import React from "react"
import styled from "styled-components"
import Icon from "../../../../components/common/Icon.react"
import VerticalAligned from "../../../../components/common/VerticalAligned.react"
import ReferralsModal from "../../../../components/modals/ReferralsModal.react"
import Flex from "../../../../design-system/Flex"
import FlexVertical from "../../../../design-system/FlexVertical"
import Modal from "../../../../design-system/Modal"
import Text from "../../../../design-system/Text"
import UnstyledButton from "../../../../design-system/UnstyledButton"
import useIsOpen from "../../../../hooks/useIsOpen"
import { useTranslations } from "../../../../hooks/useTranslations"
import { $nav_height } from "../../../../styles/variables"
import { useProfilePageItems } from "../../hooks"
import { ProfilePageNavigationProps } from "../../types"
import {
  ProfilePageTabMenuItem,
  ProfilePageMenuItem,
} from "./ProfilePageTabItem.react"

type Props = ProfilePageNavigationProps

export const ProfilePageSidebar = ({
  account: accountKey,
  collected: collectedKey,
  created: createdKey,
  identity,
  isCurrentUser,
  accountIdentifier,
}: Props) => {
  const { isOpen, toggle } = useIsOpen(true)
  const { tr } = useTranslations()

  const { myItems, accountItems } = useProfilePageItems({
    createdKey,
    accountKey,
    collectedKey,
    isCurrentUser,
  })

  const myItemsText = tr("My items")

  return (
    <StyledSidebar $open={isOpen} data-testid="ProfilePage--sidebar">
      <UnstyledButton
        aria-label={!isOpen ? myItemsText : undefined}
        className="ProfilePageSidebar--my-items"
        style={{ width: "100%" }}
        onClick={toggle}
      >
        <Flex
          justifyContent={isOpen ? "space-between" : "center"}
          padding="16px"
          width="100%"
        >
          {isOpen && (
            <VerticalAligned>
              <Text as="span" variant="pre-title-small">
                {myItemsText}
              </Text>
            </VerticalAligned>
          )}
          <Icon
            color="gray"
            cursor="pointer"
            value={isOpen ? "arrow_back" : "arrow_forward"}
          />
        </Flex>
      </UnstyledButton>

      <TabList>
        {myItems.map(item => (
          <ProfilePageTabMenuItem
            {...item}
            accountIdentifier={accountIdentifier}
            expanded={isOpen}
            key={item.label}
          />
        ))}
      </TabList>

      <Divider />

      {isOpen && (
        <Flex
          justifyContent={isOpen ? "space-between" : "center"}
          padding="16px"
          width="100%"
        >
          {isOpen && (
            <VerticalAligned>
              <Text as="span" variant="pre-title-small">
                {tr("Account")}
              </Text>
            </VerticalAligned>
          )}
        </Flex>
      )}

      <TabList>
        {accountItems.map(item => (
          <ProfilePageTabMenuItem
            accountIdentifier={accountIdentifier}
            expanded={isOpen}
            key={item.label}
            {...item}
          />
        ))}

        {isCurrentUser && (
          <Modal
            size="large"
            trigger={open => (
              <ProfilePageMenuItem
                expanded={isOpen}
                icon="monetization_on"
                label={tr("Referrals")}
                onClick={open}
              />
            )}
          >
            <ReferralsModal variables={{ referrer: identity }} />
          </Modal>
        )}
      </TabList>
    </StyledSidebar>
  )
}

export const Divider = styled.div`
  background: ${props => props.theme.colors.border};
  min-height: 1px;
  min-width: 100%;
`

const StyledSidebar = styled(FlexVertical).attrs({ as: "aside" })<{
  $open: boolean
}>`
  align-self: start;
  min-width: ${props => (props.$open ? "280px" : "65px")};
  background: ${props => props.theme.colors.background};
  position: sticky;
  top: ${$nav_height};

  @media (hover: hover) {
    .ProfilePageSidebar--my-items:hover {
      box-shadow: ${props => props.theme.shadow};
    }
  }
`

const TabList = styled.ul`
  padding: 8px !important;
  margin: 0;
`

export default ProfilePageSidebar
