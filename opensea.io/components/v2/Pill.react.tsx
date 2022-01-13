import React from "react"
import styled from "styled-components"
import { variant } from "styled-system"
import { Values } from "../../lib/helpers/type"
import { themeVariant } from "../../styles/styleUtils"
import Icon from "../common/Icon.react"
import Frame from "../layout/Frame.react"

export const PILL_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
} as const

export type PillVariant = Values<typeof PILL_VARIANTS>

export interface Props {
  children: React.ReactNode
  className?: string
  onDelete?: () => unknown
  variant?: PillVariant
  scopeDeleteToIcon?: boolean
}

export const Pill = ({
  children,
  onDelete,
  className,
  variant = PILL_VARIANTS.TERTIARY,
  scopeDeleteToIcon,
}: Props) => (
  <PillContainer
    className={className}
    data-testid="Pill"
    variant={variant}
    onClick={scopeDeleteToIcon ? undefined : onDelete}
  >
    <span>{children}</span>
    {onDelete ? (
      <Icon
        className="Pill--delete"
        title="Remove"
        value="close"
        onClick={scopeDeleteToIcon ? onDelete : undefined}
      />
    ) : null}
  </PillContainer>
)

export default Pill

const PillContainer = styled(Frame)<Pick<Props, "variant">>`
  align-items: center;
  cursor: ${props => (props.onClick ? "pointer" : "default")};
  display: flex;
  min-height: 54px;
  padding: 10px 20px;
  border-width: 1px;
  border-style: solid;

  ${props =>
    themeVariant({
      variants: {
        light: {
          borderColor: props.theme.colors.border,
        },
        dark: {
          borderColor: props.theme.colors.darkGray,
          "&:hover": {
            borderColor: props.theme.colors.gray,
          },
        },
      },
    })}

  :hover {
    box-shadow: ${props => props.theme.shadow};
  }

  ${props =>
    variant({
      variants: {
        [PILL_VARIANTS.PRIMARY]: {
          backgroundColor: props.theme.colors.withOpacity.primary.veryLight,
          borderColor: props.theme.colors.primary,
        },
        [PILL_VARIANTS.SECONDARY]: {
          backgroundColor: props.theme.colors.withOpacity.secondary.veryLight,
          borderColor: props.theme.colors.secondary,
        },
        [PILL_VARIANTS.SUCCESS]: {
          backgroundColor: props.theme.colors.withOpacity.success.veryLight,
          borderColor: props.theme.colors.success,
        },
        [PILL_VARIANTS.WARNING]: {
          backgroundColor: props.theme.colors.withOpacity.warning.veryLight,
          borderColor: props.theme.colors.warning,
        },
        [PILL_VARIANTS.DANGER]: {
          backgroundColor: props.theme.colors.withOpacity.error.veryLight,
          borderColor: props.theme.colors.error,
        },
      },
    })}

  .Pill--delete {
    align-items: center;
    display: flex;
    font-size: 20px;
    margin-left: 8px;
    color: ${props => props.theme.colors.text.subtle};
    cursor: pointer;

    :hover {
      color: ${props => props.theme.colors.text.body};
    }
  }
`
