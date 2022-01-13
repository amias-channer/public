import React from "react"
import Button from "../../design-system/Button"
import { useTheme } from "../../design-system/Context/ThemeContext"
import { Dropdown } from "../../design-system/Dropdown"
import Flex, { FlexProps } from "../../design-system/Flex"
import { Media } from "../../design-system/Media"
import { SocialBar_data } from "../../lib/graphql/__generated__/SocialBar_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { getSocialIcon } from "../../lib/helpers/icons"
import InfoContainer from "./InfoContainer.react"
import InfoItem from "./InfoItem.react"

interface Props extends FlexProps {
  data: SocialBar_data
}
const SocialBar = ({ data }: Props) => {
  const { theme } = useTheme()
  if (!data) {
    return null
  }

  const {
    slug,
    discordUrl,
    instagramUsername,
    mediumUsername,
    twitterUsername,
    telegramUrl,
    externalUrl,
  } = data

  const fill = theme === "light" ? "gray" : "fog"
  const values = [
    {
      tooltip: "Activity",
      url: `/activity/${slug}`,
      icon: getSocialIcon({ name: "activity", fill }),
    },
    {
      tooltip: "Website",
      url: externalUrl,
      icon: getSocialIcon({ name: "website", fill }),
    },
    {
      tooltip: "Discord",
      url: discordUrl,
      icon: getSocialIcon({ name: "discord", fill }),
    },
    {
      tooltip: "Medium",
      url: mediumUsername && `https://www.medium.com/@${mediumUsername}`,
      icon: getSocialIcon({ name: "medium", fill }),
    },
    {
      tooltip: "Telegram",
      url: telegramUrl,
      icon: getSocialIcon({ name: "telegram", fill }),
    },
    {
      tooltip: "Instagram",
      url:
        instagramUsername && `https://www.instagram.com/${instagramUsername}`,
      icon: getSocialIcon({ name: "instagram", fill }),
    },
    {
      tooltip: "Twitter",
      url: twitterUsername && `https://www.twitter.com/${twitterUsername}`,
      icon: getSocialIcon({ name: "twitter", fill }),
    },
  ]

  return (
    <>
      <Media greaterThanOrEqual="sm">
        <Flex>
          <InfoContainer>
            {values.map(
              ({ tooltip, url, icon }) =>
                url && (
                  <InfoItem
                    icon={icon}
                    key={tooltip}
                    tooltip={tooltip}
                    url={url}
                  />
                ),
            )}
          </InfoContainer>
        </Flex>
      </Media>

      <Media lessThan="sm">
        <Dropdown
          content={({ List, Item, close }) => (
            <List>
              {values.map(
                ({ url, tooltip, icon }) =>
                  url && (
                    <Item href={url} key={url} onClick={close}>
                      <Item.Avatar>{icon}</Item.Avatar>
                      <Item.Content>
                        <Item.Title>{tooltip}</Item.Title>
                      </Item.Content>
                    </Item>
                  ),
              )}
            </List>
          )}
          hideOnClick
        >
          <Button icon="more_vert" variant="tertiary" />
        </Dropdown>
      </Media>
    </>
  )
}

export default fragmentize(SocialBar, {
  fragments: {
    data: graphql`
      fragment SocialBar_data on CollectionType {
        discordUrl
        externalUrl
        instagramUsername
        isEditable
        mediumUsername
        slug
        telegramUrl
        twitterUsername
        relayId
        ...collection_url
      }
    `,
  },
})
