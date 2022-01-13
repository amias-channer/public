import React from "react"
import styled, { css } from "styled-components"
import { trackClickLink } from "../../lib/analytics/events/appEvents"
import Router from "../../lib/helpers/router"
import { routes } from "../../lib/routes"
import ExternalLink, { ExternalLinkProps } from "./ExternalLink.react"

const LinkRoutes = routes.Link

export type LinkProps = Omit<JSX.IntrinsicElements["a"], "ref"> &
  Partial<
    Pick<
      ExternalLinkProps,
      "rel" | "target" | "onClick" | "eventSource" | "disabled"
    >
  >

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    { href, eventSource, disabled = false, onClick, ...props },
    ref,
  ) {
    const handleInternalLinkClick = async (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      await onClick?.(e)
      trackClickLink({
        url: href,
        target: props.target,
        source: eventSource,
        currentUrl: window.location.href,
        type: "internal",
      })
    }

    if (!href) {
      return (
        <StyledA
          {...props}
          $disabled={disabled}
          ref={ref}
          onClick={handleInternalLinkClick}
        />
      )
    }

    if (href.startsWith("/")) {
      const queryIndex = href.indexOf("?")
      const route =
        queryIndex === -1
          ? `${href}${Router.stringifyQueryParams({})}`
          : `${href.substring(0, queryIndex)}${Router.stringifyQueryParams(
              Router.parseQueryString(href.substring(queryIndex)),
            )}`

      return (
        // @ts-expect-error passHref type missing
        <LinkRoutes passHref route={route}>
          <StyledA
            {...props}
            $disabled={disabled}
            ref={ref}
            onClick={handleInternalLinkClick}
          />
        </LinkRoutes>
      )
    }

    return (
      <ExternalLink
        disabled={disabled}
        eventSource={eventSource}
        ref={ref}
        url={href}
        {...props}
      />
    )
  },
)

export default Link

export const StyledA = styled.a.attrs<{ $disabled: boolean }>(props => {
  const attrs: React.AnchorHTMLAttributes<unknown> = {}
  if (props.$disabled) {
    attrs["tabIndex"] = -1
    attrs["aria-disabled"] = true
  }
  return attrs
})<{ $disabled: boolean }>`
  color: ${props => props.theme.colors.seaBlue};

  :hover {
    color: ${props => props.theme.colors.darkSeaBlue};
  }

  ${props =>
    props.$disabled &&
    css`
      opacity: 0.2;
      pointer-events: none;
    `}
`
