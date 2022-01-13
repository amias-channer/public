import React, { forwardRef, useMemo, useRef, useState } from "react"
import useMergedRef from "@react-hook/merged-ref"
import styled, { css, CSSProperties } from "styled-components"
import Icon from "../../components/common/Icon.react"
import VerticalAligned from "../../components/common/VerticalAligned.react"
import { themeVariant } from "../../styles/styleUtils"
import UnstyledButton from "../UnstyledButton"

export type InputProps = Omit<
  JSX.IntrinsicElements["input"],
  "ref" | "onClick"
> & {
  startEnhancer?: React.ReactNode
  endEnhancer?: React.ReactNode
  clearable?: boolean
  clearOnEscape?: boolean
  inputRef?: React.RefObject<HTMLInputElement>
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>
  cursor?: CSSProperties["cursor"]
  onEnter?: (value: InputProps["value"]) => unknown
}

export const Input = forwardRef<HTMLDivElement, InputProps>(function Input(
  {
    startEnhancer,
    endEnhancer,
    onKeyDown,
    clearable = false,
    clearOnEscape = false,
    className,
    style,
    inputRef,
    onBlur,
    onFocus,
    disabled,
    cursor,
    onClick,
    onMouseDown,
    onEnter,
    value,
    ...inputProps
  },
  ref,
) {
  const localInputRef = useRef<HTMLInputElement>(null)
  const [inputFocus, setInputFocus] = useState(false)

  const clearValue = () => {
    // trigger a fake input change event (as if all text was deleted)
    const input = localInputRef.current
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, "")
        input.dispatchEvent(
          new Event("input", { bubbles: true, cancelable: true }),
        )
      }
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    localInputRef.current?.focus()
    onClick?.(event)
  }

  const inputRefs = useMemo(
    () => (inputRef ? [localInputRef, inputRef] : [localInputRef]),
    [inputRef],
  )

  return (
    <StyledContainer
      $inputFocus={inputFocus}
      className={className}
      cursor={cursor}
      disabled={disabled}
      ref={ref}
      style={style}
      onClick={handleClick}
      onMouseDown={onMouseDown}
    >
      {startEnhancer}

      <input
        ref={useMergedRef(...inputRefs)}
        style={{ cursor: cursor ?? "text" }}
        value={value}
        onBlur={event => {
          onBlur?.(event)
          setInputFocus(false)
        }}
        onFocus={event => {
          onFocus?.(event)
          setInputFocus(true)
        }}
        onKeyDown={event => {
          onKeyDown?.(event)
          if (event.key === "Escape") {
            localInputRef.current?.blur()
            if (clearOnEscape) {
              clearValue()
            }
          }
          if (event.key === "Enter") {
            onEnter?.(value)
          }
        }}
        {...inputProps}
      />

      {clearable && value && (
        <VerticalAligned>
          <UnstyledButton onClick={clearValue}>
            <Icon
              aria-label="Clear"
              color="gray"
              cursor="pointer"
              size={20}
              value="clear"
            />
          </UnstyledButton>
        </VerticalAligned>
      )}

      {endEnhancer}
    </StyledContainer>
  )
})

export default Input

const focusStyles = css`
  box-shadow: ${props => props.theme.shadow};
  ${props =>
    themeVariant({
      variants: {
        dark: {
          backgroundColor: props.theme.colors.ash,
        },
      },
    })}
`

const disabledStyles = css`
  color: ${props => props.theme.colors.text.subtle};
  background-color: ${props => props.theme.colors.withOpacity.fog.light};
  pointer-events: none;
`

const StyledContainer = styled.div<{
  $inputFocus: boolean
  disabled?: boolean
  cursor?: CSSProperties["cursor"]
}>`
  cursor: ${props => props.cursor ?? "text"};
  display: flex;
  background-color: ${props => props.theme.colors.input};
  border-radius: ${props => props.theme.borderRadius.default};
  border: solid 1px ${props => props.theme.colors.border};
  width: 100%;
  padding: 12px;
  &:hover {
    ${props =>
      themeVariant({
        variants: { dark: { backgroundColor: props.theme.colors.ash } },
      })}
  }
  // Make sure we have focus styles when user click on the input
  :active {
    ${focusStyles}
  }
  // Style container when native input has focus
  ${props => props.$inputFocus && focusStyles}
  ${props => props.disabled && disabledStyles}
  input {
    background-color: transparent;
    border: none;
    outline: none;
    width: 100%;
    line-height: 22px;
  }
  i[aria-label="Clear"]:hover {
    color: ${props => props.theme.colors.darkGray};
  }
`
