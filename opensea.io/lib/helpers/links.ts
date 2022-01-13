import {
  DISCORD_URL,
  TWITTER_URL,
  REDDIT_URL,
  TELEGRAM_URL,
  INSTAGRAM_URL,
  PARTNERS_URL,
  NOLT_URL,
  HELP_CENTER_URL,
  NEWSLETTER_URL,
  BLOG_URL,
  DOCS_URL,
  CATEGORIES,
} from "../../constants"
import { getSocialIcon, Social } from "./icons"

export type LinkItem = {
  url: string
  label: string
  image?: string
}

export type LinkArray = LinkItem[]

export const marketPlaceLinks: LinkArray = [
  {
    url: "/assets",
    label: "All NFTs",
    image: "/static/images/icons/allnfts",
  },
  {
    url: "/assets?search[toggles][0]=IS_NEW",
    label: "New",
    image: "/static/images/icons/new",
  },
  ...CATEGORIES.map(category => ({
    url: `/collection/${category.slug}`,
    label: category.name,
    image: `/static/images/icons/${category.slug}`,
  })),
]

export const myAccountLinks: LinkArray = [
  {
    url: "/account",
    label: "My Profile",
  },
  {
    url: "/collections",
    label: "My Collections",
  },
  {
    url: "/account?tab=favorites",
    label: "My Favorites",
  },
  {
    url: "/account/settings",
    label: "My Account Settings",
  },
]

export const resourcesLinks: LinkArray = [
  {
    url: HELP_CENTER_URL,
    label: "Help Center",
  },
  {
    url: PARTNERS_URL,
    label: "Partners",
  },
  {
    url: NOLT_URL,
    label: "Suggestions",
  },
  {
    url: DISCORD_URL,
    label: "Discord Community",
  },
  {
    url: BLOG_URL,
    label: "Blog",
  },
  {
    url: DOCS_URL,
    label: "Docs",
  },
  {
    url: NEWSLETTER_URL,
    label: "Newsletter",
  },
]

export const statLinks: LinkArray = [
  {
    url: "/rankings",
    label: "Rankings",
  },
  {
    url: "/activity",
    label: "Activity",
  },
]

export type SocialLink = {
  url: string
  logo: React.ReactNode
  label: string
}

export const getSocialLinks = ({
  width,
  fill,
  withHoverChange,
}: Omit<Social, "name">): SocialLink[] => {
  return [
    {
      url: TWITTER_URL,
      logo: getSocialIcon({ name: "twitter", width, fill, withHoverChange }),
      label: "Twitter",
    },
    {
      url: INSTAGRAM_URL,
      logo: getSocialIcon({ name: "instagram", width, fill, withHoverChange }),
      label: "Instagram",
    },
    {
      url: DISCORD_URL,
      logo: getSocialIcon({ name: "discord", width, fill, withHoverChange }),
      label: "Discord",
    },
    {
      url: REDDIT_URL,
      logo: getSocialIcon({ name: "reddit", width, fill, withHoverChange }),
      label: "Reddit",
    },
    {
      url: TELEGRAM_URL,
      logo: getSocialIcon({ name: "telegram", width, fill, withHoverChange }),
      label: "Telegram",
    },
    {
      url: NEWSLETTER_URL,
      logo: getSocialIcon({ name: "mail", width, fill, withHoverChange }),
      label: "Mail",
    },
  ]
}
