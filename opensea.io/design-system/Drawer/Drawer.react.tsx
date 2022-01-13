import React, { useCallback, useState } from "react"
import { isFunction, noop } from "lodash"
import { useUpdateEffect, useClickAway } from "react-use"
import styled, { css } from "styled-components"
import { BANNER_HEIGHT } from "../../components/layout/home-page/AnnouncementBanner.react"
import { Z_INDEX } from "../../constants/zIndex"
import Overlay from "../../design-system/Overlay"
import { useCallbackRef } from "../../hooks/useCallbackRef"
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll"
import Block, { BlockProps } from "../Block"
import { Media, Breakpoint, getBreakpointPixelValue } from "../Media"
import SpaceBetween from "../SpaceBetween"
import Text from "../Text"

interface ChildrenProps {
  fullscreenBreakpoint: Breakpoint
}

export type DrawerProps = BlockProps & {
  transitionDuration?: number
  isOpen: boolean
  isBannerShown: boolean
  onClickAway: (event: MouseEvent | TouchEvent) => void
  children: ((props: ChildrenProps) => React.ReactNode) | React.ReactNode
  fullscreenBreakpoint?: Breakpoint
  navbarOffset?: string
  anchorSide?: "left" | "right"
  className?: string
}

export const renderChildren = (
  children: DrawerProps["children"],
  props: ChildrenProps,
) => {
  return isFunction(children) ? children(props) : children
}

const DrawerBase = ({
  anchorSide = "right",
  className,
  isOpen,
  children,
  onClickAway,
  transitionDuration = 0.5,
  fullscreenBreakpoint = "md",
  navbarOffset = "0px",
  ...rest
}: DrawerProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [ref, setRef] = useCallbackRef<HTMLDivElement>()
  const isVisible = isClosing || isOpen

  useClickAway(ref, isOpen ? onClickAway : noop)
  useLockBodyScroll(isOpen, ref)

  const clearIsClosing = useCallback(() => setIsClosing(false), [setIsClosing])

  useUpdateEffect(() => {
    setIsClosing(!isOpen)
    ref.current?.addEventListener("transitionend", clearIsClosing)
    return () => {
      ref.current?.removeEventListener("transitionend", clearIsClosing)
    }
  }, [isOpen])

  return (
    <>
      <ContainerDiv
        $fullscreenBreakpoint={getBreakpointPixelValue(fullscreenBreakpoint)}
        $navbarOffset={navbarOffset}
        anchorSide={anchorSide}
        className={className}
        isOpen={isOpen}
        ref={setRef}
        transitionDuration={transitionDuration}
        {...rest}
      >
        {isVisible && renderChildren(children, { fullscreenBreakpoint })}
      </ContainerDiv>
      <Media greaterThanOrEqual={fullscreenBreakpoint}>
        {(mediaClassNames, renderChildren) =>
          renderChildren && (
            <Overlay
              active={isOpen}
              className={mediaClassNames}
              transitionDuration={transitionDuration}
            />
          )
        }
      </Media>
    </>
  )
}

const Body = styled(Block)`
  padding: 20px;
`

const Header = styled(SpaceBetween)`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const Title = styled(Text).attrs({ as: "span" })`
  font-weight: 600;
`

const Subtitle = styled(Text).attrs({ variant: "small", as: "span" })`
  display: flex;
`

const ContainerDiv = styled(Block).attrs<BlockProps>(props => ({
  as: props.as ?? "aside",
}))<
  Pick<
    DrawerProps,
    "isOpen" | "isBannerShown" | "transitionDuration" | "anchorSide"
  > & {
    $navbarOffset: string
    $fullscreenBreakpoint: number
  }
>`
  position: fixed;
  ${({ anchorSide }) => css`
    ${anchorSide}: 0;
  `}
  bottom: 0;
  top: ${({ $navbarOffset, isBannerShown }) =>
    isBannerShown ? `calc(${BANNER_HEIGHT} + ${$navbarOffset})` : undefined};

  width: 420px;
  z-index: ${Z_INDEX.DRAWER};

  @media (max-width: ${props => props.$fullscreenBreakpoint - 1}px) {
    width: 100%;
    z-index: ${Z_INDEX.DRAWER_MOBILE};
  }

  height: ${({ $navbarOffset }) => `calc(100% - ${$navbarOffset})`};

  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: auto;

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  transition: ${({ transitionDuration }) =>
    transitionDuration
      ? `transform ${transitionDuration}s, opacity ${transitionDuration}s`
      : undefined};

  ${({ anchorSide, isOpen }) =>
    isOpen
      ? css`
          visibility: visible;
          transform: translate3d(0, 0, 0) 0;
          opacity: 1;
        `
      : css`
          visibility: visible;
          transform: translate3d(
            ${anchorSide === "right" ? "100%" : "-100%"},
            0,
            0
          );
          opacity: 0;
        `}

  ${Body} {
    padding-bottom: ${({ $navbarOffset }) => `${$navbarOffset}`};
    height: calc(100% - ${({ $navbarOffset }) => $navbarOffset});
  }

  ${Header} {
    height: ${({ $navbarOffset }) =>
      $navbarOffset === "0px" ? undefined : $navbarOffset};
  }
`

export const Drawer = Object.assign(DrawerBase, {
  Header,
  Title,
  Subtitle,
  Body,
})

export default Drawer
