import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    height: 100%;
    margin: 0px;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text.body};

    input, textarea {
      ::placeholder {
        color: ${props => props.theme.colors.gray};
      }
    }
  }

  ::selection {
    background-color: ${props => props.theme.colors.marina};
    color: ${props => props.theme.colors.white};
  }

  *:focus:not(:focus-visible) {
    outline: none
  }

  [data-tippy-root] {
    max-width: calc(100vw - 10px);
  }
`
