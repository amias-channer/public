import React, { CSSProperties } from "react"
import Tippy, { TippyProps } from "@tippyjs/react"
import { isBoolean } from "lodash"
import styled from "styled-components"
import { variant } from "styled-system"
import type { Instance, Placement } from "tippy.js"
import "tippy.js/dist/tippy.css"
import { Values } from "../../lib/helpers/type"

export const TOOLTIP_PLACEMENT: Record<string, Placement> = {
  AUTO: "auto",
  AUTO_START: "auto-start",
  AUTO_END: "auto-end",
  BOTTOM: "bottom",
  BOTTOM_START: "bottom-start",
  BOTTOM_END: "bottom-end",
  TOP: "top",
  TOP_START: "top-start",
  TOP_END: "top-end",
  LEFT: "left",
  LEFT_START: "left-start",
  LEFT_END: "left-end",
  RIGHT: "right",
  RIGHT_START: "right-start",
  RIGHT_END: "right-end",
} as const

type Variant = "default" | "card"

export type TooltipInstance = Instance

export type TooltipPlacement = Values<typeof TOOLTIP_PLACEMENT>

export type TooltipProps = Omit<TippyProps, "animation" | "theme"> & {
  contentPadding?: CSSProperties["padding"]
  variant?: Variant
}

export const Tooltip = React.forwardRef<Element, TooltipProps>(function Tooltip(
  {
    content,
    disabled,
    hideOnClick = false,
    offset = [0, 10],
    variant = "default",
    visible,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled ?? !content

  return (
    <StyledTippy
      {...rest}
      $variant={variant}
      content={content}
      disabled={isDisabled}
      hideOnClick={!isBoolean(visible) ? hideOnClick : undefined}
      offset={offset}
      ref={ref}
      visible={isBoolean(visible) ? visible : undefined}
    />
  )
})

export default Tooltip

const StyledTippy = styled(Tippy)<TooltipProps & { $variant: Variant }>`
  [data-tippy-root] {
    max-width: calc(100vw - 10px);
  }

  &.tippy-box {
    position: relative;
    background-color: ${props =>
      props.theme.type === "light"
        ? props.theme.colors.charcoal
        : props.theme.colors.ash};
    color: ${props => props.theme.colors.white};
    border-radius: ${props => props.theme.borderRadius.default};
    font-size: 14px;
    font-weight: 600;
    outline: 0;
    transition-property: transform, visibility, opacity;

    ${props =>
      variant({
        prop: "$variant",
        variants: {
          card: {
            backgroundColor: props.theme.colors.card,
            color: props.theme.colors.text.body,
            borderRadius: props.theme.borderRadius.default,
            boxShadow: props.theme.shadow,
            fontWeight: 500,
          },
        },
      })}
  }

  &.tippy-box[data-placement^="top"] > .tippy-arrow {
    bottom: 0;
  }

  &.tippy-box[data-placement^="top"] > .tippy-arrow:before {
    bottom: -7px;
    left: 0;
    border-width: 8px 8px 0;
    border-top-color: initial;
    transform-origin: center top;
  }

  &.tippy-box[data-placement^="bottom"] > .tippy-arrow {
    top: 0;
  }

  &.tippy-box[data-placement^="bottom"] > .tippy-arrow:before {
    top: -7px;
    left: 0;
    border-width: 0 8px 8px;
    border-bottom-color: initial;
    transform-origin: center bottom;
  }

  &.tippy-box[data-placement^="left"] > .tippy-arrow {
    right: 0;
  }

  &.tippy-box[data-placement^="left"] > .tippy-arrow:before {
    border-width: 8px 0 8px 8px;
    border-left-color: initial;
    right: -7px;
    transform-origin: center left;
  }

  &.tippy-box[data-placement^="right"] > .tippy-arrow {
    left: 0;
  }

  &.tippy-box[data-placement^="right"] > .tippy-arrow:before {
    left: -7px;
    border-width: 8px 8px 8px 0;
    border-right-color: initial;
    transform-origin: center right;
  }

  .tippy-arrow {
    width: 16px;
    height: 16px;
    background-color: ${props =>
      props.theme.type === "light"
        ? props.theme.colors.charcoal
        : props.theme.colors.ash};
    color: ${props =>
      props.theme.type === "light"
        ? props.theme.colors.charcoal
        : props.theme.colors.ash};

    ${props =>
      variant({
        prop: "$variant",
        variants: {
          card: {
            backgroundColor: props.theme.colors.card,
            color: props.theme.colors.card,
          },
        },
      })}
  }

  .tippy-arrow:before {
    content: "";
    position: absolute;
    border-color: transparent;
    border-style: solid;
  }

  .tippy-content {
    position: relative;
    padding: ${props => props.contentPadding ?? "12px 20px"};
    z-index: 1;
    text-align: center;

    a:hover {
      color: ${props => props.theme.colors.shoreline};
    }
  }
`
