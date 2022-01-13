import React from "react"
import styled from "styled-components"
import { appendClassName } from "../../lib/helpers/styling"
import Popover, {
  PopoverContentProps,
  PopoverProps,
  POPOVER_PLACEMENT,
} from "../Popover"
import { DropdownItem, DropdownList } from "./elements"

export const DROPDOWN_PLACEMENT = POPOVER_PLACEMENT

type CloseDropdown = PopoverContentProps["close"]

export type RenderItemProps<T> = {
  item: T
  close: CloseDropdown
  Item: typeof DropdownItem
}

export type RenderItem<T> = (props: RenderItemProps<T>) => React.ReactNode

type DropdownBaseProps = Omit<PopoverProps, "content"> &
  Pick<React.CSSProperties, "width" | "minWidth">

type DropdownItemProps<T> = DropdownBaseProps & {
  items: ReadonlyArray<T>
  renderItem: RenderItem<T>
  content?: undefined
  dropdownRef?: React.RefObject<HTMLDivElement>
}

export type RenderDropdownContentProps = {
  close: CloseDropdown
  Item: typeof DropdownItem
  List: typeof DropdownList
}

type DropdownContentProps = DropdownBaseProps & {
  content: (props: RenderDropdownContentProps) => React.ReactNode
  items?: undefined
  renderItem?: undefined
  dropdownRef?: undefined
}

export type DropdownProps<T> = DropdownItemProps<T> | DropdownContentProps

const DropdownBase = <T,>({
  minWidth,
  width,
  children,
  placement = "bottom-start",
  disabled,
  className,
  offset,
  maxWidth,
  hideOnClick,
  trigger = "click",
  visible,
  ...rest
}: DropdownProps<T>) => {
  const renderContent = ({ close }: PopoverContentProps) => {
    if (rest.content) {
      return rest.content({
        close,
        Item: DropdownItem,
        List: DropdownList,
      })
    }
    const { items, renderItem, dropdownRef } = rest
    return (
      <DropdownList ref={dropdownRef} width={width}>
        {items.map(item =>
          renderItem({
            close,
            item,
            Item: DropdownItem,
          }),
        )}
      </DropdownList>
    )
  }

  return (
    <StyledPopover
      $minWidth={minWidth}
      arrow={false}
      className={appendClassName("Dropdown", className)}
      content={renderContent}
      disabled={disabled}
      hideOnClick={hideOnClick}
      maxWidth={maxWidth}
      offset={offset}
      placement={placement}
      trigger={trigger}
      visible={visible}
    >
      {children}
    </StyledPopover>
  )
}

export const Dropdown = Object.assign(DropdownBase, {
  Item: DropdownItem,
  List: DropdownList,
})

const StyledPopover = styled(Popover)<
  DropdownProps<unknown> & { $minWidth: DropdownBaseProps["minWidth"] }
>`
  &&.Dropdown {
    max-height: 350px;
    overflow-y: auto;
    box-shadow: rgb(0 0 0 / 16%) 0px 4px 16px;
    background-color: ${props =>
      props.theme.type === "light"
        ? props.theme.colors.white
        : props.theme.colors.ash};
    color: ${props => props.theme.colors.text.heading};
    max-width: ${props => `${props.maxWidth}px` ?? "initial"};
    min-width: ${props => props.$minWidth ?? 220}px;

    .tippy-content {
      padding: 0;
      text-align: initial;
    }
  }
`

export default Dropdown
