import { NextPageContext } from "next"
import { DefaultTheme } from "styled-components"
import Cookie from "../lib/cookie"
import { map } from "../lib/helpers/object"
import Router from "../lib/helpers/router"
import { Theme } from "../styles/styled"

export const THEME_COOKIE_KEY = "theme"

export const getThemeFromCookie = (ctx?: NextPageContext) => {
  const themeParam = Router.getQueryParams().theme
  const themeCookie: Cookie<{ theme: Theme }> = new Cookie(THEME_COOKIE_KEY)
  const requestedTheme = themeParam || themeCookie.get(ctx)?.theme

  return requestedTheme === "light" || requestedTheme === "dark"
    ? requestedTheme
    : "light"
}

export const HUES = {
  darkSeaBlue: "#1868B7",
  seaBlue: "#2081E2",
  marina: "#15B2E5",
  lightMarina: "#F3FBFE",
  aqua: "#2BCDE4",
  fog: "#E5E8EB",
  cloud: "#FBFDFF",
  white: "#FFFFFF",

  charcoal: "#04111D",
  oil: "#353840",
  darkGray: "#707A83",
  gray: "#8A939B",

  seaGrass: "#34C77B",
  starFish: "#F6C000",
  coral: "#EB5757",
  seaHorse: "#F2994A",
  pinkFish: "#E932BE",
  octopus: "#987df0",

  slate: "#2F3F4E",
  offShore: "#235AA3",

  // Dark mode specific
  midnight: "#202225",
  onyx: "#262B2F",
  ash: "#4C505C",
  ink: "#303339",
  shoreline: "#42A0FF",
}

export const COMMON_COLORS = {
  primary: HUES.seaBlue,
  secondary: HUES.marina,
  tertiary: HUES.aqua,
  success: HUES.seaGrass,
  warning: HUES.starFish,
  error: HUES.coral,
  ...HUES,
}

const WHITE_TEXT_COLORS = [
  HUES.seaBlue,
  HUES.marina,
  HUES.aqua,
  HUES.charcoal,
  HUES.oil,
  HUES.gray,
  HUES.seaGrass,
  HUES.coral,
  HUES.octopus,
  HUES.pinkFish,
  HUES.oil,
  HUES.midnight,
  HUES.onyx,
  HUES.ash,
  HUES.ink,
]

export const borderRadius = {
  default: "5px",
  circle: "50%",
} as const

const gradients = {
  banner: `linear-gradient(
      164.51deg,
      rgba(164, 252, 188, 0.7) 0%,
      rgba(255, 255, 255, 0) 93.19%
    ),
    linear-gradient(
      165.14deg,
      rgba(23, 149, 188, 0.7) 15.47%,
      rgba(23, 149, 188, 0) 100%
    ),
    rgba(23, 79, 188, 0.84)`,
}

const getColorOn = (color: string) =>
  WHITE_TEXT_COLORS.find(c => color.startsWith(c)) ? HUES.white : HUES.charcoal

const getOpacities = (color: string) => ({
  veryLight: `${color}0F`,
  light: `${color}40`,
  medium: `${color}80`,
  heavy: `${color}BF`,
})

const shadow = `0px 0px 8px 0px ${getOpacities(HUES.charcoal).light}`

const lightTheme: DefaultTheme = (() => {
  const colors = {
    ...COMMON_COLORS,
    background: HUES.white,
    border: HUES.fog,
    surface: HUES.cloud,
    input: HUES.white,
    header: HUES.white,
    card: HUES.white,
    hover: HUES.fog,
  }

  const text = {
    heading: HUES.charcoal,
    body: HUES.oil,
    subtle: HUES.darkGray,
  }

  const on = map(colors, getColorOn)

  const type: Theme = "light"

  return {
    colors: {
      ...colors,
      text: {
        ...text,
        on,
      },
      withOpacity: {
        ...map(colors, getOpacities),
        text: {
          ...map(text, getOpacities),
          on: map(on, getOpacities),
        },
      },
    },
    shadow,
    type,
    gradients,
    borderRadius,
  }
})()

const darkTheme: DefaultTheme = (() => {
  // These dark theme colors are WIP, expect them to change once we flesh out our dark theming
  const colors = {
    ...COMMON_COLORS,
    background: HUES.midnight,
    border: HUES.onyx,
    surface: HUES.ink,
    input: HUES.oil,
    header: HUES.onyx,
    card: HUES.ink,
    hover: HUES.charcoal,
  }

  const text = {
    heading: HUES.white,
    body: HUES.fog,
    subtle: HUES.gray,
  }

  const on = map(colors, getColorOn)

  const type: Theme = "dark"

  return {
    colors: {
      ...colors,
      text: {
        ...text,
        on,
      },
      withOpacity: {
        ...map(colors, getOpacities),
        text: {
          ...map(text, getOpacities),
          on: map(on, getOpacities),
        },
      },
    },
    shadow,
    type,
    gradients,
    borderRadius,
  }
})()

const THEMES = { light: lightTheme, dark: darkTheme }

export default THEMES
