import React, { forwardRef, useState } from "react"
import styled, { css } from "styled-components"
import Button from "../../design-system/Button"
import { MaterialIcon, IconProps } from "./Icon.react"

export interface Props {
  children?: React.ReactNode
  className?: string
  isDisabled?: boolean
  href?: string
  icon?: MaterialIcon
  iconTitle?: IconProps["title"]
  onClick?: () => unknown
  type?: "primary" | "secondary" | "tertiary"
  isSmall?: boolean
  style?: React.CSSProperties
}

// __DEPRECATED: Use Button instead
export const ActionButton = forwardRef<HTMLButtonElement, Props>(
  function ActionButton(
    {
      children,
      icon,
      isSmall,
      isDisabled,
      onClick,
      className,
      href,
      type,
      iconTitle,
      style,
    },
    ref,
  ) {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
      if (isLoading || !onClick || isDisabled) {
        return
      }
      setIsLoading(true)
      try {
        await onClick()
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <StyledButton
        className={className}
        disabled={isDisabled}
        href={href}
        icon={icon}
        isLoading={isLoading}
        overrides={{ Icon: { props: { title: iconTitle } } }}
        ref={ref}
        size={isSmall ? "small" : "medium"}
        style={style}
        variant={type}
        onClick={handleClick}
      >
        {children}
      </StyledButton>
    )
  },
)

const StyledButton = styled(Button)`
  ${props =>
    props.size !== "small" &&
    props.children &&
    css`
      min-width: 162px;
    `}
`

export default ActionButton
