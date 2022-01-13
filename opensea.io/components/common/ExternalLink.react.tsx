/* eslint-disable react/display-name */
import React from "react"
import ReactGA from "react-ga"
import { trackClickLink } from "../../lib/analytics/events/appEvents"
import { StyledA } from "./Link.react"

type Target = "_blank" | "_self" | "_parent" | "_top"

type Rel =
  | "alternate"
  | "author"
  | "bookmark"
  | "external"
  | "help"
  | "license"
  | "next"
  | "noreferrer"
  | "prev"
  | "search"
  | "tag"

export type ExternalLinkProps = Pick<
  JSX.IntrinsicElements["a"],
  "className" | "children" | "onClick" | "aria-label"
> & {
  url: string
  target?: Target
  rel?: Rel | Rel[]
  eventSource?: string
  disabled?: boolean
}

const MIDDLE_CLICK = 1

export const ExternalLink = React.forwardRef<
  HTMLAnchorElement,
  ExternalLinkProps
>(
  (
    {
      url,
      eventSource,
      className,
      rel,
      children,
      target = "_blank",
      onClick,
      disabled = false,
      ...rest
    },
    ref,
  ) => {
    const trackClick = (callback?: () => void) => {
      ReactGA.outboundLink({ label: eventSource || url }, () => {
        trackClickLink({
          url,
          target,
          source: eventSource,
          currentUrl: window.location.href,
          type: "external",
        })
        callback && callback()
      })
    }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      const sameTarget = target !== "_blank"
      const isNewTab =
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey ||
        event.button === MIDDLE_CLICK

      if (sameTarget && !isNewTab) {
        event.preventDefault()
        trackClick(() => {
          location.href = url
        })
      } else {
        trackClick()
      }

      onClick?.(event)
    }

    let relProperty = "nofollow noopener"
    if (rel) {
      if (Array.isArray(rel)) {
        relProperty += ` ${rel.join(" ")}`
      } else {
        relProperty += ` ${rel}`
      }
    }

    return (
      <StyledA
        $disabled={disabled}
        className={className}
        href={url}
        ref={ref}
        rel={relProperty}
        target={target}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </StyledA>
    )
  },
)

export default ExternalLink
