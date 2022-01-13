import styled from 'styled-components'
import { Input, mq, themeTextStyle } from '@revolut/ui-kit'

export const InputStyled = styled(Input)`
  @media ${mq('*-sm')} {
    ${themeTextStyle('small')}
  }
`
