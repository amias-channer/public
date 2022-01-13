import styled from "styled-components"
import { variant } from "styled-system"
import { Values } from "../../lib/helpers/type"
import { Block, BlockProps } from "../Block"

export const TEXT_VARIANTS = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  SUBTITLE: "subtitle",
  PRE_TITLE: "pre-title",
  PRE_TITLE_SMALL: "pre-title-small",

  BODY: "body",
  BOLD: "bold",
  SMALL: "small",
  SMALL_BOLD: "small-bold",
  SMALL_HEAVY: "small-heavy",
  INFO: "info",
  INFO_BOLD: "info-bold",
} as const

export type TextVariant = Values<typeof TEXT_VARIANTS>

export type TextProps = BlockProps & {
  variant?: TextVariant
  textTransform?: React.CSSProperties["textTransform"]
}

export const Text = styled(Block).attrs<TextProps>(props => ({
  as: getTextElement(props),
}))<TextProps>(props =>
  variant({
    variants: {
      [TEXT_VARIANTS.H1]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "60px",
        color: props.color ?? props.theme.colors.text.heading,
      },
      [TEXT_VARIANTS.H2]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "40px",
        letterSpacing: 0,
        color: props.color ?? props.theme.colors.text.heading,
      },
      [TEXT_VARIANTS.H3]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "24px",
        color: props.color ?? props.theme.colors.text.heading,
      },
      [TEXT_VARIANTS.H4]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "20px",
        color: props.color ?? props.theme.colors.text.heading,
      },
      [TEXT_VARIANTS.H5]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "16px",
        color: props.color ?? props.theme.colors.text.heading,
        textTransform: props.textTransform ?? "initial", // titles.scss uses uppercase
      },
      [TEXT_VARIANTS.H6]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "14px",
        color: props.color ?? props.theme.colors.text.heading,
        textTransform: props.textTransform ?? "initial", // titles.scss uses uppercase
      },
      [TEXT_VARIANTS.SUBTITLE]: {
        fontWeight: props.fontWeight ?? 400,
        fontSize: props.fontSize ?? "24px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
      [TEXT_VARIANTS.PRE_TITLE]: {
        fontWeight: props.fontWeight ?? 700,
        fontSize: props.fontSize ?? "14px",
        textTransform: "uppercase",
        color: props.color ?? props.theme.colors.text.heading,
      },
      [TEXT_VARIANTS.PRE_TITLE_SMALL]: {
        fontWeight: props.fontWeight ?? 700,
        fontSize: props.fontSize ?? "12px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: props.color ?? props.theme.colors.darkGray,
      },
      [TEXT_VARIANTS.BODY]: {
        fontWeight: props.fontWeight ?? 400,
        fontSize: props.fontSize ?? "16px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
      [TEXT_VARIANTS.BOLD]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "16px",
        color: props.color ?? props.theme.colors.text.heading,
      },
      [TEXT_VARIANTS.SMALL]: {
        fontWeight: props.fontWeight ?? 500,
        fontSize: props.fontSize ?? "14px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
      [TEXT_VARIANTS.SMALL_BOLD]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "14px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
      [TEXT_VARIANTS.SMALL_HEAVY]: {
        fontWeight: props.fontWeight ?? 700,
        fontSize: props.fontSize ?? "14px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
      [TEXT_VARIANTS.SMALL_HEAVY]: {
        fontWeight: props.fontWeight ?? 700,
        fontSize: props.fontSize ?? "14px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
      [TEXT_VARIANTS.INFO]: {
        fontWeight: props.fontWeight ?? 500,
        fontSize: props.fontSize ?? "12px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
      [TEXT_VARIANTS.INFO_BOLD]: {
        fontWeight: props.fontWeight ?? 600,
        fontSize: props.fontSize ?? "12px",
        color: props.color ?? props.theme.colors.text.subtle,
      },
    },
  }),
)

const getTextElement = ({ as, variant = TEXT_VARIANTS.BODY }: TextProps) => {
  if (as) {
    return as
  }

  if (variant.startsWith("h")) {
    return variant
  }

  return "p"
}

Text.defaultProps = {
  variant: TEXT_VARIANTS.BODY,
}

export default Text
