import styled from "styled-components"

export const UnstyledButton = styled.button.attrs({ type: "button" })`
  display: inline-flex;
  align-items: center;
  font-size: 100%;
  font-family: inherit;
  border: 0;
  padding: 0;
  background: inherit;
`

export default UnstyledButton
