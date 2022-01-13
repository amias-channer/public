import React from "react"
import styled from "styled-components"
import Icon from "../../components/common/Icon.react"
import DiscordLogo from "../../components/svgs/DiscordLogo.react"
import GitHubLogo from "../../components/svgs/GitHubLogo.react"
import InstagramLogo from "../../components/svgs/InstagramLogo.react"
import LinkedInLogo from "../../components/svgs/LinkedInLogo.react"
import MediumLogo from "../../components/svgs/MediumLogo.react"
import OpenSeaLogo from "../../components/svgs/OpenSeaLogo.react"
import RedditLogo from "../../components/svgs/RedditLogo.react"
import TelegramLogo from "../../components/svgs/TelegramLogo.react"
import TwitterLogo from "../../components/svgs/TwitterLogo.react"
import WebpageLogo from "../../components/svgs/WebpageLogo.react"
import Flex from "../../design-system/Flex"
import { HUES } from "../../styles/themes"
import { selectClassNames } from "./styling"

export interface Social {
  name:
    | "activity"
    | "website"
    | "mail"
    | "discord"
    | "twitter"
    | "instagram"
    | "medium"
    | "telegram"
    | "github"
    | "reddit"
    | "linkedin"
    | "opensea"
  fill?: "gray" | "white" | "fog"
  width?: number
  withHoverChange?: boolean
}

export const getSocialIcon = ({
  name,
  fill = "white",
  width = 20,
  withHoverChange,
}: Social) => {
  const hue = HUES[fill]
  const socialIcons = {
    activity: <Icon color={fill} size={width} value="playlist_play" />,
    mail: <Icon color={fill} size={width} value="mail" variant="outlined" />,
    website: (
      <WebpageLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    discord: (
      <DiscordLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    twitter: (
      <TwitterLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    instagram: (
      <InstagramLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    medium: (
      <MediumLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    telegram: (
      <TelegramLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    github: (
      <GitHubLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    reddit: (
      <RedditLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    linkedin: (
      <LinkedInLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
    opensea: (
      <OpenSeaLogo
        className={selectClassNames("Icon", { withHoverChange })}
        fill={hue}
        width={width}
      />
    ),
  }
  return <DivContainer>{socialIcons[name]}</DivContainer>
}

const DivContainer = styled(Flex)`
  .Icon--withHoverChange:hover {
    fill: ${props => props.theme.colors.darkGray};
  }
`
