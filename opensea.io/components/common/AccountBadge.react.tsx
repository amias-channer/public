import React from "react"
import styled from "styled-components"
import Tooltip from "../../design-system/Tooltip"
import { Config } from "../../lib/graphql/__generated__/AccountHeader_data.graphql"
import Link from "./Link.react"
import VerifiedIcon, { IconVariant, IconSize } from "./VerifiedIcon.react"

const TOOLTIP_CONTENT: TooltipContentProps = {
  VERIFIED: {
    getHref: () => "/faq#verified",
    text: "Verified",
  },
  MODERATOR: {
    getHref: discordId => `https://discordapp.com/users/${discordId}`,
    text: "Official Moderator.  Click to chat!",
  },
}

type DiscordId = string | null

interface Props {
  config?: Config | null
  discordId?: DiscordId
  isInteractive?: boolean
  variant?: IconSize
}

type StaticCheckmarkProps = {
  variant: IconVariant
  size: IconSize
}

type InteractiveCheckmarkProps = {
  href: string
  text: string
} & StaticCheckmarkProps

type TooltipContentProps = {
  [key in Config]?: {
    getHref: (param?: DiscordId) => string
    text: string
  }
}

const StaticCheckmark = (props: StaticCheckmarkProps) => (
  <StyledIcon {...props} />
)

const InteractiveCheckmark = ({
  href,
  text,
  ...iconProps
}: InteractiveCheckmarkProps) => (
  <Tooltip content={text} placement="right">
    <StyledLink href={href} rel="noreferrer" target="_blank">
      <StaticCheckmark {...iconProps} />
    </StyledLink>
  </Tooltip>
)

const AccountBadge = ({
  config,
  discordId,
  isInteractive = true,
  variant = "small",
}: Props) => {
  const isVerified = config === "VERIFIED"
  const isModerator = config === "MODERATOR"

  if (!isModerator && !isVerified) {
    return null
  }

  return isInteractive ? (
    <InteractiveCheckmark
      href={TOOLTIP_CONTENT[config!]!.getHref(discordId)}
      size={variant}
      text={TOOLTIP_CONTENT[config!]!.text}
      variant={config as IconVariant}
    />
  ) : (
    <StaticCheckmark size={variant} variant={config as IconVariant} />
  )
}

const StyledIcon = styled(VerifiedIcon)`
  margin: 0 0 0 0.4em;
  vertical-align: top;
`

const StyledLink = styled(Link)`
  display: block;
  line-height: 1;
`

export default AccountBadge
