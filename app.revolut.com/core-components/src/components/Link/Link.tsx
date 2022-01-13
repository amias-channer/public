import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { StyledLink } from './styled'

type LinkProps = {
  className?: string
  href?: string
  to?: string
  isNewTab?: boolean
  onClick?: VoidFunction
}

export const Link: FC<LinkProps> = ({
  className,
  children,
  href,
  to,
  isNewTab,
  onClick,
}) => {
  const targetAttr = isNewTab ? '_blank' : '_self'
  const Tag = href ? 'a' : RouterLink

  return (
    <StyledLink
      className={className}
      use={Tag}
      href={href}
      to={to}
      target={targetAttr}
      onClick={onClick}
    >
      {children}
    </StyledLink>
  )
}
