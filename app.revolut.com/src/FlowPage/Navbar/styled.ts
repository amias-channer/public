import { Flex, mq, Box } from '@revolut/ui-kit'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

export const NavbarStyled = styled(Flex)<{ isWidgetMode?: boolean }>`
  flex-shrink: 0;
  position: sticky;
  top: 0;
  width: 100%;
  : ;
  margin-top: ${props => (props.isWidgetMode ? '0' : '1rem')};
  padding: 0.6rem 0 6px;
  background-color: ${props =>
    props.isWidgetMode ? 'transparent' : themeGet('colors.layout-background')};
  @media ${mq('*-md')} {
    padding: 0.6rem 0;
    overflow: hidden;
  }
`

export const StickyBox = styled(Box)`
  position: sticky;
  top: 0;
  z-index: 1;
`
