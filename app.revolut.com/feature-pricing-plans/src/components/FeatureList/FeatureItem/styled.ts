import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { Text, themeColor } from '@revolut/ui-kit'

export const FeatureItemTitle = styled(Text)<{ inactive: boolean }>`
  color: ${ifProp('inactive', themeColor('grey-tone-50'), themeColor('black'))};
`
