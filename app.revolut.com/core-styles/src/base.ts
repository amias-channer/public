import normalize from 'normalize.css/normalize.css'
import { createGlobalStyle } from 'styled-components'
import { theme } from 'styled-tools'

import { BasierCircle } from './fonts'

export const GlobalStyle = createGlobalStyle`
    ${normalize}
    html,
    body {
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      min-height: 100%;
      ${BasierCircle};
    }

    body {
      position: relative;
    }

    * {
      box-sizing: border-box;
      outline: none;
    }

    button, input, select {
      outline: none;
      box-sizing: border-box;
    }

    button {
      border: none;
      padding: 0;
      cursor: pointer;
      color: inherit;
      background-color: transparent;
      -webkit-tap-highlight-color: transparent;
    }

    input, textarea {
      border: none;
      border-radius: 0;
      box-shadow: none;
      margin: 0;
      padding: 0;
      -webkit-appearance: none;
    }

    h1, h2, h3, h4, h5, h6 {
      color: ${theme('colorStyles.header')};
    }

    a {
      text-decoration: none;
    }
    
    /* hack in order to delay autofill background appearance */
    input:-webkit-autofill {
      transition-delay: 9999s;
    }
`
