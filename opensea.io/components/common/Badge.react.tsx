import React, { forwardRef } from "react"
import styled from "styled-components"
import { variant } from "styled-system"
import Text, { TextVariant } from "../../design-system/Text"
import { Values } from "../../lib/helpers/type"
import { generateVariants } from "../../styles/styleUtils"
import Icon, { MaterialIcon } from "./Icon.react"
import Image from "./Image.react"

export interface Props {
  text?: string
  textVariant?: TextVariant
  icon?: MaterialIcon
  imageUrl?: string
  iconSize?: number
  className?: string
  variant?: BadgeVariant
}

export const BADGE_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const

export type BadgeVariant = Values<typeof BADGE_VARIANTS>

export const Badge = forwardRef<HTMLDivElement, Props>(function Badge(
  {
    text,
    textVariant = "small",
    icon,
    iconSize = 14,
    className,
    variant,
    imageUrl,
  },
  ref,
) {
  return (
    <DivContainer className={className} ref={ref} variant={variant}>
      {imageUrl ? <Image size={iconSize} url={imageUrl} /> : null}
      {icon ? (
        <Icon className="Badge--icon" size={iconSize} value={icon} />
      ) : null}
      {text ? (
        <Text as="span" className="Badge--text" variant={textVariant}>
          {text}
        </Text>
      ) : null}
    </DivContainer>
  )
})

export default Badge

const DivContainer = styled.div<{ variant?: BadgeVariant }>`
  width: fit-content;
  border-radius: 4px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.subtle};

  .Badge--icon {
    margin-right: 4px;
  }

  .Badge--text {
    ${props =>
      variant({
        variants: generateVariants(BADGE_VARIANTS, variant => ({
          color: props.theme.colors.text.on[variant],
        })),
      })}
  }

  ${props =>
    variant({
      variants: generateVariants(BADGE_VARIANTS, variant => ({
        backgroundColor: props.theme.colors[variant],
        color: props.theme.colors.text.on[variant],
      })),
    })}
`
