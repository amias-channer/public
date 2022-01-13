import type { MouseEventHandler } from "react"
import Link from "../../components/common/Link.react"
import UnstyledButton from "../UnstyledButton"

type BaseProps = {
  as?: keyof JSX.IntrinsicElements | React.ComponentType
}

type ClickableElementProps<T extends HTMLElement> = BaseProps & {
  onClick?: MouseEventHandler<T>
}

type LinkItemProps = BaseProps & { href: string }

type Props<T extends HTMLElement> = ClickableElementProps<T> | LinkItemProps

export const isClickableElement = <T extends HTMLElement>(
  props: ClickableElementProps<T>,
): boolean => {
  return Boolean(props.onClick)
}

export const isLinkElement = <T extends HTMLElement>(
  props: Props<T>,
): props is LinkItemProps => {
  return Boolean((props as LinkItemProps).href)
}

export const getInteractiveElement = <T extends HTMLElement>(
  props: Props<T>,
) => {
  if (isLinkElement(props)) {
    return Link
  }

  if (isClickableElement(props)) {
    return UnstyledButton
  }

  return props.as ?? "div"
}

export const isInteractiveElement = <T extends HTMLElement>(
  props: Props<T>,
): boolean => {
  return isLinkElement(props) || isClickableElement(props)
}
