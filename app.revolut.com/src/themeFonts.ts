import { createGlobalStyle } from 'styled-components'

import { cdnLink } from './helpers/assets'

const BasierCircleRegular = cdnLink('fonts/BasierCircle-Regular.woff2')
const BasierCircleMedium = cdnLink('fonts/BasierCircle-Medium.woff2')
const BasierCircleSemiBold = cdnLink('fonts/BasierCircle-SemiBold.woff2')

export const GlobalFontStyle = createGlobalStyle`
@font-face {
  font-family: 'Basier Circle';
  font-display: swap;
  font-weight: 400;
  src: url(${BasierCircleRegular});
}

@font-face {
  font-family: 'Basier Circle';
  font-weight: 500;
  font-display: swap;
  src: url(${BasierCircleMedium});
}

@font-face {
  font-family: 'Basier Circle';
  font-weight: 600;
  font-display: swap;
  src: url(${BasierCircleSemiBold});
}
`
