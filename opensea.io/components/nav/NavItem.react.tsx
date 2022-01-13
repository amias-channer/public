import React, { forwardRef } from "react"
import styled from "styled-components"
import { AppContextProps } from "../../AppContext"
import UnstyledButton from "../../design-system/UnstyledButton"
import useAppContext from "../../hooks/useAppContext"
import useToasts from "../../hooks/useToasts"
import { selectClassNames } from "../../lib/helpers/styling"
import { $nav_height } from "../../styles/variables"
import ActiveLink from "../common/ActiveLink.react"
import Icon, {
  MaterialIcon,
  IconProps,
  MaterialTheme,
} from "../common/Icon.react"

// TODO: Refactor this mess
interface NavItemOnClick {
  showSuccessMessage: (message: string) => unknown
  context: AppContextProps
}

interface Props {
  children?: React.ReactNode
  href?: string
  icon?: MaterialIcon
  iconVariant?: MaterialTheme
  iconTitle?: IconProps["title"]
  isRoot?: boolean
  onClick?: (props: NavItemOnClick) => unknown
  isActive?: boolean
  isHidden?: (context: AppContextProps) => boolean
}

export const NavItem = forwardRef<HTMLLIElement, Props>(
  (
    {
      children,
      icon,
      iconVariant,
      isRoot,
      href,
      onClick,
      isActive,
      iconTitle,
      isHidden,
    },
    ref,
  ) => {
    const context = useAppContext()
    const { showSuccessMessage } = useToasts()

    if (isHidden?.(context)) {
      return null
    }

    const child = (
      <>
        {icon ? (
          <Icon
            className="NavItem--icon"
            size={30}
            title={iconTitle}
            value={icon}
            variant={iconVariant}
          />
        ) : null}
        {children}
      </>
    )

    const className = selectClassNames("NavItem", { isRoot })
    const hasChildren = Boolean(children)

    if (!href) {
      return (
        <LiContainer
          className={className}
          hasChildren={hasChildren}
          ref={ref}
          onClick={() =>
            onClick?.({
              context: context,
              showSuccessMessage: m => showSuccessMessage(m),
            })
          }
        >
          <UnstyledButton
            className={selectClassNames("NavItem", {
              main: true,
              active: isActive,
              withIcon: !!icon,
            })}
          >
            {child}
          </UnstyledButton>
        </LiContainer>
      )
    }

    return (
      <LiContainer className={className} hasChildren={hasChildren} ref={ref}>
        {href[0] === "/" ? (
          <ActiveLink
            activeClassName={isRoot ? "NavItem--active" : ""}
            className={selectClassNames("NavItem", {
              main: true,
              withIcon: !!icon,
            })}
            href={href}
          >
            {child}
          </ActiveLink>
        ) : (
          <a
            className="NavItem--main"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {child}
          </a>
        )}
      </LiContainer>
    )
  },
)

export default NavItem

const LiContainer = styled.li<{ hasChildren: boolean }>`
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 56px;
  justify-content: space-between;
  font-weight: 600;
  font-size: 16px;

  &.NavItem--isRoot {
    height: ${$nav_height};

    .NavItem--main {
      &:hover {
        &::after {
          background-color: ${props => props.theme.colors.primary};
          bottom: 0%;
          content: "";
          display: block;
          height: 2px;
          left: 0;
          position: absolute;
          width: 100%;
        }
      }
    }
  }

  .NavItem--main {
    align-items: center;
    color: ${props => props.theme.colors.withOpacity.text.on.background.heavy};
    display: flex;
    height: 100%;
    padding: 0 20px;
    position: relative;
    width: 100%;

    &:hover {
      color: ${props => props.theme.colors.text.on.background};
    }

    &.NavItem--active {
      color: ${props => props.theme.colors.text.on.background};

      &::after {
        background-color: ${props => props.theme.colors.primary};
        bottom: 0%;
        content: "";
        display: block;
        height: 2px;
        left: 0;
        position: absolute;
        width: 100%;
      }
    }

    &.NavItem--withIcon {
      color: ${props => props.theme.colors.text.subtle};

      &:hover {
        color: ${props => props.theme.colors.text.body};
      }
    }

    .NavItem--icon {
      margin-right: ${props => (props.hasChildren ? "10px" : undefined)};
    }
  }
`
