import React, { useCallback, useRef } from "react"
import { isBoolean } from "lodash"
import Tooltip, {
  TooltipProps,
  TooltipInstance,
  TooltipPlacement,
  TOOLTIP_PLACEMENT,
} from "../Tooltip"

export const POPOVER_PLACEMENT = TOOLTIP_PLACEMENT

export type PopoverPlacement = TooltipPlacement

export interface PopoverContentProps {
  close: () => void
}

export type PopoverProps = Pick<
  TooltipProps,
  | "children"
  | "contentPadding"
  | "placement"
  | "arrow"
  | "className"
  | "disabled"
  | "offset"
  | "maxWidth"
  | "hideOnClick"
  | "interactive"
  | "trigger"
  | "visible"
  | "variant"
> & {
  content: (props: PopoverContentProps) => React.ReactNode
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      content,
      hideOnClick = true,
      interactive = true,
      trigger,
      visible,
      ...rest
    },
    ref,
  ) {
    const tippyRef = useRef<TooltipInstance>()
    const close = useCallback(() => tippyRef.current?.hide(), [tippyRef])

    // Tippy doesn't clear out undefined props so an error gets thrown if either `trigger` or `visible` is not defined
    // https://github.com/atomiks/tippyjs-react/issues/304
    const controlProps = !isBoolean(visible)
      ? trigger
        ? { trigger, hideOnClick }
        : { hideOnClick }
      : { visible }

    return (
      <Tooltip
        {...rest}
        {...controlProps}
        content={content({ close })}
        interactive={interactive}
        ref={ref}
        onMount={instance => {
          tippyRef.current = instance
        }}
      />
    )
  },
)

export default Popover
