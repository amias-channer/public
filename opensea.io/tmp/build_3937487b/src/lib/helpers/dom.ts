import { RefObject } from "react"

export const isInsideRef = (
  ref: RefObject<HTMLElement>,
  target: EventTarget | null,
) => {
  return isInsideElement(ref.current, target)
}

export const isInsideElement = (
  element: HTMLElement | null,
  target: EventTarget | null,
) => element?.contains(target as Node | null)
