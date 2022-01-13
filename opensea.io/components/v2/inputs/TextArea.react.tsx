import React from "react"
import styled from "styled-components"
import { selectClassNames } from "../../../lib/helpers/styling"
import { themeVariant } from "../../../styles/styleUtils"

type Props = {
  onChange: (value: string) => unknown
} & Pick<
  JSX.IntrinsicElements["textarea"],
  | "className"
  | "maxLength"
  | "name"
  | "rows"
  | "value"
  | "placeholder"
  | "disabled"
  | "id"
>

const TextArea = ({
  className,
  disabled,
  maxLength,
  name,
  onChange,
  rows,
  value,
  placeholder,
  id,
}: Props) => (
  <TextAreaImpl
    className={selectClassNames("TextArea", { disabled }, className)}
    disabled={disabled}
    id={id}
    maxLength={maxLength}
    name={name}
    placeholder={placeholder}
    rows={rows}
    value={value}
    onChange={e => onChange(e.target.value)}
  />
)
export default TextArea

const TextAreaImpl = styled.textarea`
  border-radius: 5px;
  border: solid 1px ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.input};
  height: auto;
  padding: 16px 12px;
  resize: vertical;
  width: 100%;

  &:focus {
    box-shadow: ${props => props.theme.shadow};
    outline: none;

    ${props =>
      themeVariant({
        variants: { dark: { backgroundColor: props.theme.colors.ash } },
      })}
  }

  &:hover {
    ${props =>
      themeVariant({
        variants: { dark: { backgroundColor: props.theme.colors.ash } },
      })}
  }

  &.TextArea--disabled {
    background-color: ${props => props.theme.colors.withOpacity.fog.light};
    color: ${props => props.theme.colors.text.subtle};
  }
`
