import styled, { css } from 'styled-components'

export const Container = styled.div<{ fullWidth?: boolean }>`
  margin: 1rem 0 1.75rem;
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      position: relative;
      &:after {
        content: '';
        position: absolute;
        height: 1px;
        background: grey;
        width: 100%;
        left: 0;
        top: 100%;
        z-index: 1;
        animation: widen 0.7s;
        animation-fill-mode forwards;
      }
    `}
`
