import React from "react"
import styled from "styled-components"
import { appendClassName } from "../../lib/helpers/styling"

type Props = {
  className?: string
  textClassName?: string
  textValue?: string
  valueInfo?: string
}

export default class FakeInput extends React.Component<Props> {
  render() {
    const { children, className, textClassName, textValue } = this.props
    return (
      <DivContainer className={className}>
        {children ? (
          <div className="FakeInput--children-container">{children}</div>
        ) : (
          <input
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className={appendClassName(
              "browser-default FakeInput--input",
              textClassName,
            )}
            disabled
            inputMode={"text"}
            placeholder={"Loading..."}
            spellCheck="false"
            type={"text"}
            value={textValue}
          />
        )}
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  align-items: center;
  background-color: ${props => props.theme.colors.withOpacity.gray.veryLight};
  border-radius: 5px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  height: 48px;
  padding: 0 12px 0 12px;

  .FakeInput--children-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .FakeInput--input {
    background-color: transparent;
    border: none;
    flex: 1 0;
    outline: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
