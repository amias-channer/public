import React, { useEffect, useMemo, useRef, useState } from "react"
import useSize from "@react-hook/size"
import { range } from "lodash"
import { useClickAway, useKeyPressEvent } from "react-use"
import styled, { css } from "styled-components"
import CenterAligned from "../../components/common/CenterAligned.react"
import Icon from "../../components/common/Icon.react"
import VerticalAligned from "../../components/common/VerticalAligned.react"
import useIsOpen from "../../hooks/useIsOpen"
import { isInsideElement, isInsideRef } from "../../lib/helpers/dom"
import { UnreachableCaseError } from "../../lib/helpers/type"
import { AvatarProps } from "../Avatar"
import Dropdown, { RenderItem, DropdownProps } from "../Dropdown"
import Input from "../Input"
import Item from "../Item"
import ItemSkeleton from "../ItemSkeleton"
import Loader from "../Loader/Loader.react"
import UnstyledButton from "../UnstyledButton"

export type SelectOption<T extends string = string> = {
  label: string
  value: T
  key?: string
  avatar?: AvatarProps
  description?: string
}

export type LoadingConfiguration = {
  avatar?: boolean
  title?: boolean
  description?: boolean
  count?: number
}

export type SelectProps<Option extends SelectOption = SelectOption> = {
  disabled?: boolean
  options: ReadonlyArray<Option>
  onSelect: (option: Option | undefined) => unknown
  placeholder?: string
  value?: Option
  renderItem?: RenderItem<Option>
  startEnhancer?: React.ReactNode
  clearable?: boolean
  searchFilter?: (option: Option, query: string) => boolean
  readOnly?: boolean
  emptyText?: string
  autoFocus?: boolean
  variant?: "search" | "item"
  name?: string
  id?: string
  isLoading?: boolean | LoadingConfiguration
  onChange?: (value: string) => unknown
  style?: React.CSSProperties
  excludeSelectedOption?: boolean
}

export const Select = <Option extends SelectOption>({
  disabled,
  placeholder,
  options,
  onSelect,
  renderItem,
  value,
  startEnhancer,
  clearable = true,
  searchFilter,
  readOnly,
  emptyText,
  autoFocus,
  variant = "search",
  name,
  id,
  isLoading = false,
  onChange,
  style,
  excludeSelectedOption = false,
}: SelectProps<Option>) => {
  const isPressed = useRef(false)
  const containerRef = useRef<HTMLElement>(null)
  const [query, setQuery] = useState("")
  const sanitizedQuery = query.toLowerCase()
  const [minWidth] = useSize(containerRef)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isOpen, open, close, setIsOpen } = useIsOpen()

  const isInsideDropdown = (relatedTarget: EventTarget | null) => {
    return isInsideElement(
      dropdownRef.current?.closest("[data-tippy-root]") ?? null,
      relatedTarget,
    )
  }

  useKeyPressEvent("Escape", isOpen ? close : undefined)
  useClickAway(containerRef, event => {
    if (!isInsideDropdown(event.target)) {
      close()
    }
  })

  const shownOptions = useMemo(() => {
    const results = readOnly
      ? options
      : options.filter(o =>
          searchFilter
            ? searchFilter?.(o, sanitizedQuery)
            : o.label.toLowerCase().includes(sanitizedQuery) ||
              o.description?.toLowerCase().includes(sanitizedQuery),
        )

    return excludeSelectedOption
      ? results.filter(o => o.value !== value?.value)
      : results
  }, [
    sanitizedQuery,
    options,
    excludeSelectedOption,
    value,
    readOnly,
    searchFilter,
  ])

  useEffect(() => {
    setQuery(value?.label ?? "")
  }, [value])

  const renderDropdownItem: RenderItem<Option> = props => {
    if (renderItem) {
      return renderItem(props)
    }

    const { Item, item } = props
    return (
      <Item
        key={item.key ?? item.value}
        onBlur={event => {
          if (!isInsideDropdown(event.relatedTarget)) {
            close()
          }
        }}
        onClick={() => {
          onSelect(item)
          if (item === value && item.label !== query) {
            setQuery(item.label)
          }
          close()
        }}
      >
        {item.avatar && <Item.Avatar {...item.avatar} />}
        <Item.Content>
          <Item.Title>{item.label}</Item.Title>
          {item.description && (
            <Item.Description>{item.description}</Item.Description>
          )}
        </Item.Content>
      </Item>
    )
  }

  const renderLoadingItems = (loading: true | LoadingConfiguration) => {
    const configuration: LoadingConfiguration =
      loading === true ? { title: true } : loading

    return range(0, configuration.count || 3).map(index => (
      <ItemSkeleton aria-label="loading option" key={index}>
        {configuration.avatar && <ItemSkeleton.Avatar />}
        <ItemSkeleton.Content>
          {configuration.title && <ItemSkeleton.Title />}
          {configuration.description && <ItemSkeleton.Description />}
        </ItemSkeleton.Content>
      </ItemSkeleton>
    ))
  }

  const renderDropdownProps = (): DropdownProps<Option> => {
    if (shownOptions.length === 0 && !isLoading) {
      return {
        content: function NoResults() {
          return (
            <CenterAligned padding="32px">
              {emptyText || "No results"}
            </CenterAligned>
          )
        },
      }
    }

    return {
      content: function Results({ List, Item, close }) {
        return (
          <List ref={dropdownRef}>
            {shownOptions.map(item =>
              renderDropdownItem({ Item, item, close }),
            )}

            {isLoading ? renderLoadingItems(isLoading) : null}
          </List>
        )
      },
    }
  }

  const showMoreIcon = (
    <Icon
      aria-label="Show more"
      color="gray"
      cursor="pointer"
      value="keyboard_arrow_down"
    />
  )

  const commonProps = {
    onClick: () => setIsOpen(prev => !prev),
    onFocus: () => {
      if (!isPressed.current) {
        open()
      }
      isPressed.current = false
    },
    onMouseDown: () => {
      isPressed.current = true
    },
  }

  const renderSearchVariant = () => {
    return (
      <SelectInput
        autoFocus={autoFocus}
        clearOnEscape
        clearable={clearable}
        cursor={readOnly ? "pointer" : undefined}
        disabled={disabled}
        endEnhancer={
          isLoading ? (
            <VerticalAligned marginLeft="12px">
              <Loader size="small" />
            </VerticalAligned>
          ) : (
            <VerticalAligned marginLeft="12px">{showMoreIcon}</VerticalAligned>
          )
        }
        id={id}
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={containerRef as React.RefObject<HTMLInputElement>}
        startEnhancer={
          startEnhancer ? (
            <VerticalAligned marginRight="12px">
              {startEnhancer}
            </VerticalAligned>
          ) : undefined
        }
        style={style}
        value={query}
        onBlur={event => {
          if (isPressed.current) {
            return
          }
          // Dont clear "invalid" option if one was just selected
          if (isInsideDropdown(event.relatedTarget)) {
            return
          }

          if (!options.some(o => o.label === query)) {
            if (value) {
              onSelect(undefined)
            } else {
              setQuery("")
            }
          }

          // Close if focus went outside and not if e.g. close icon got focus
          if (!isInsideRef(containerRef, event.relatedTarget)) {
            close()
          }
        }}
        onChange={event => {
          setQuery(event.currentTarget.value)
          if (!event.currentTarget.value && value) {
            onSelect(undefined)
          }
          onChange?.(event.currentTarget.value)
          open()
        }}
        {...commonProps}
      />
    )
  }

  const renderItemVariant = () => {
    return (
      <SelectItem
        as={UnstyledButton}
        disabled={disabled}
        ref={containerRef}
        {...commonProps}
      >
        <input placeholder={placeholder} type="hidden" value={query} />
        {value?.avatar && <Item.Avatar {...value.avatar} />}
        <Item.Content>
          <Item.Title>{value?.label ?? placeholder}</Item.Title>
          {value?.description && (
            <Item.Description>{value.description}</Item.Description>
          )}
        </Item.Content>
        <Item.Side>{showMoreIcon}</Item.Side>
      </SelectItem>
    )
  }

  const renderContent = () => {
    switch (variant) {
      case "search":
        return renderSearchVariant()
      case "item":
        return renderItemVariant()
      default:
        throw new UnreachableCaseError(variant)
    }
  }

  return (
    <Dropdown
      disabled={disabled}
      visible={isOpen}
      {...renderDropdownProps()}
      minWidth={minWidth}
      offset={[0, 0]}
    >
      {renderContent()}
    </Dropdown>
  )
}

const iconStyles = css`
  i {
    color: ${props => props.theme.colors.gray};
  }

  &:hover {
    i[aria-label="Show more"] {
      color: ${props => props.theme.colors.darkGray};
    }
  }
`

const SelectInput = styled(Input)`
  ${iconStyles}
`

const SelectItem = styled(Item)`
  ${iconStyles}
  border-radius: ${props => props.theme.borderRadius.default};
` as typeof Item

export default Select
