import React, { forwardRef, useRef, useState } from "react"
import { useKeyPressEvent } from "react-use"
import styled from "styled-components"
import UnstyledButton from "../../design-system/UnstyledButton"
import { useTranslations } from "../../hooks/useTranslations"
import { themeVariant } from "../../styles/styleUtils"
import Icon from "../common/Icon.react"

interface Props {
  children?: React.ReactNode
  className?: string
  onChange?: (query: string) => unknown
  onClick?: () => unknown
  placeholder?: string
  query: string
  setQuery?: (query: string) => unknown
  slashKeyTrigger?: boolean
  onFocus?: () => unknown
}

export const SearchInput = forwardRef<HTMLDivElement, Props>(
  function SearchInput(
    {
      children,
      className,
      onChange,
      onClick,
      setQuery,
      placeholder,
      query: initialQuery,
      slashKeyTrigger,
      onFocus,
    },
    ref,
  ) {
    const [query, setQueryState] = useState(initialQuery)
    const { tr } = useTranslations()
    const inputRef = useRef<HTMLInputElement>(null)

    useKeyPressEvent(
      "/",
      slashKeyTrigger
        ? event => {
            const targetTag = (
              event.target as HTMLElement | null
            )?.tagName.toUpperCase()
            event.preventDefault()
            event.stopPropagation()
            const input = inputRef.current
            if (targetTag !== "INPUT" && targetTag !== "TEXTAREA" && input) {
              // focus after the change event is flushed to prevent "/" being added to the input
              setTimeout(() => {
                input.setSelectionRange(query.length, query.length)
                input.focus()
              }, 0)
            }
          }
        : undefined,
    )

    const updateQuery = (query: string) => {
      setQueryState(query)
      onChange?.(query)
    }

    return (
      <DivContainer className={className} ref={ref}>
        <Icon className="SearchInput--icon" color="gray" value="search" />
        <input
          className="browser-default SearchInput--input"
          placeholder={tr(placeholder || "Search")}
          ref={inputRef}
          spellCheck="false"
          type="text"
          value={query}
          onChange={e => updateQuery(e.target.value)}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={e => {
            if (e.key === "Enter" && setQuery) {
              setQuery(query)
            }
          }}
        />
        {children}

        {query && (
          <UnstyledButton
            onClick={() => {
              updateQuery("")
              if (!onChange && setQuery) {
                setQuery("")
              }
              onClick?.()
              inputRef.current?.focus()
            }}
          >
            <Icon className="SearchInput--close-icon" value="close" />
          </UnstyledButton>
        )}
      </DivContainer>
    )
  },
)

export default SearchInput

const DivContainer = styled.div`
  align-items: center;
  background-color: ${props => props.theme.colors.input};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  color: ${props => props.theme.colors.withOpacity.text.on.background.heavy};
  display: flex;
  flex: 1 0;
  height: 45px;
  max-width: 768px;
  padding: 0px 10px;

  .SearchInput--icon {
    font-size: 24px;
    user-select: none;
  }

  .SearchInput--close-icon {
    color: ${props => props.theme.colors.gray};

    &:hover {
      color: ${props => props.theme.colors.darkGray};
    }
  }

  .SearchInput--input {
    background-color: transparent;
    color: ${props => props.theme.colors.withOpacity.text.on.background.heavy};
    border: none;
    flex: 1 0;
    height: 100%;
    margin-left: 16px;
    outline: none;
    width: 100%;
  }

  &:focus-within {
    border-color: ${props => props.theme.colors.seaBlue};
  }

  &:hover,
  &:focus-within {
    ${props =>
      themeVariant({
        variants: { dark: { backgroundColor: props.theme.colors.ash } },
      })}
  }
`
