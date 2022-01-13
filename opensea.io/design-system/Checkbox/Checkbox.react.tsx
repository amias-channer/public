import React, { forwardRef } from "react"
import styled from "styled-components"
import Icon from "../../components/common/Icon.react"
import { selectClassNames } from "../../lib/helpers/styling"
import { themeVariant } from "../../styles/styleUtils"

export interface CheckboxProps
  extends Pick<
    JSX.IntrinsicElements["input"],
    "checked" | "disabled" | "id" | "name"
  > {
  className?: string
  onChange?: (checked: boolean) => unknown
  inputRef?: React.RefObject<HTMLInputElement>
}

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(function Checkbox(
  { className, checked, disabled, inputRef, name, id, onChange }: CheckboxProps,
  ref,
) {
  return (
    <DivContainer
      checked={checked}
      className={selectClassNames("Checkbox", { disabled }, className)}
      ref={ref}
    >
      <input
        checked={checked}
        className="Checkbox--input"
        disabled={disabled}
        id={id}
        name={name}
        ref={inputRef}
        type="checkbox"
        onChange={e => onChange?.(e.target.checked)}
      />
      {checked ? <Icon className="Checkbox--checkmark" value="check" /> : null}
    </DivContainer>
  )
})

export default Checkbox

const DivContainer = styled.span<{ checked?: boolean }>`
  position: relative;
  display: inline-flex;
  border-radius: 5px;

  .Checkbox--input {
    appearance: none;
    border: 2px solid
      ${props =>
        props.checked ? props.theme.colors.primary : props.theme.colors.border};
    cursor: pointer;
    height: 24px;
    min-width: 24px;
    max-width: 24px;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.input};
    transition: 0.2s box-shadow;
    outline: none;
  }

  &.Checkbox--disabled {
    pointer-events: none;

    .Checkbox--input {
      background-color: ${props => props.theme.colors.withOpacity.fog.light};
      pointer-events: none;
    }
  }

  &:hover,
  &:focus-within {
    .Checkbox--input {
      box-shadow: ${props => props.theme.shadow};

      ${props =>
        themeVariant({
          variants: {
            light: {
              borderColor: props.checked
                ? props.theme.colors.darkSeaBlue
                : props.theme.colors.border,
            },
            dark: {
              borderColor: props.checked
                ? props.theme.colors.shoreline
                : props.theme.colors.border,
              backgroundColor: props.theme.colors.ash,
            },
          },
        })}
    }

    .Checkbox--checkmark {
      ${props =>
        themeVariant({
          variants: {
            light: {
              color: props.theme.colors.darkSeaBlue,
            },
            dark: {
              color: props.theme.colors.shoreline,
            },
          },
        })}
    }
  }

  .Checkbox--checkmark {
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${props => props.theme.colors.primary};
  }
`
