import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { Text } from '@revolut/ui-kit'

type StyledTextProps = {
  isStrikethru: boolean
}

export const StyledText = styled(Text)<StyledTextProps>`
  text-decoration: ${ifProp('isStrikethru', 'line-through', 'none')};
  white-space: nowrap;
`
