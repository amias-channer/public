import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'
import { Box, themeColor } from '@revolut/ui-kit'

export const GooglePayContainerStyled = styled(Box)<{ disabled?: boolean }>`
  width: 100%;

  ${ifProp(
    { disabled: true },
    css`
      button.gpay-button.black {
        background-color: ${themeColor('black-80')};
        pointer-events: none;
      }
    `,
  )};
`
