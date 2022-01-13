import React from "react"
import styled from "styled-components"
import { SUPPORTED_LANGUAGES } from "../../constants"
import { useTheme } from "../../design-system/Context/ThemeContext"
import Flex from "../../design-system/Flex"
import LanguagePicker from "../../i18n/LanguagePicker.react"
import Tr from "../../i18n/Tr.react"
import {
  LinkArray,
  LinkItem,
  marketPlaceLinks,
  myAccountLinks,
  resourcesLinks,
  getSocialLinks,
  statLinks,
} from "../../lib/helpers/links"
import Image from "../common/Image.react"
import Link from "../common/Link.react"
import NavItem from "./NavItem.react"

const TrNavItem = ({ url, label, image }: LinkItem) => {
  const { theme } = useTheme()
  return (
    <NavItem href={url}>
      {image ? (
        <Flex marginRight="8px">
          <Image size={24} url={`${image}-${theme}.svg`} />
        </Flex>
      ) : null}
      <Tr>{label}</Tr>
    </NavItem>
  )
}

const linkArrayToNavItems = (links: LinkArray) =>
  links.map(link => (
    <TrNavItem
      image={link.image}
      key={link.url}
      label={link.label}
      url={link.url}
    />
  ))

export const SocialsItem = ({ isMobile }: { isMobile?: boolean }) => (
  <SocialsContainer height={isMobile ? 30 : 20}>
    {getSocialLinks({
      width: isMobile ? 30 : 24,
      fill: "gray",
      withHoverChange: true,
    })
      .slice(0, 5)
      .map(link => (
        <Flex key={link.url}>
          <Link aria-label={link.label} href={link.url} rel="noreferrer">
            {link.logo}
          </Link>
        </Flex>
      ))}
  </SocialsContainer>
)

const SocialsContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  max-width: 300px;
  width: 100%;
  margin: 0;
`

const navMenus = {
  marketplace: linkArrayToNavItems(marketPlaceLinks),
  stats: linkArrayToNavItems(statLinks),
  resources: [
    ...linkArrayToNavItems(resourcesLinks),
    <NavItem key="socials">
      <SocialsItem isMobile />
    </NavItem>,
  ],
  account: [
    ...linkArrayToNavItems(myAccountLinks.slice(0, myAccountLinks.length - 1)),
  ],
  language: SUPPORTED_LANGUAGES.map(language => (
    <LanguagePicker key={language} language={language} />
  )),
}
export default navMenus
