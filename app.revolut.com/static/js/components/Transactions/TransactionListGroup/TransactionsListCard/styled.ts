import styled from 'styled-components'
import { mq, Chain } from '@revolut/ui-kit'

import { themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.TransactionsList.TransactionCard')

export const StatusText = styled.div`
  max-width: ${themeSize('statusText.desktop.maxWidth')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media ${mq('*-md')} {
    max-width: ${themeSize('statusText.mobile.maxWidth')};
  }
`

export const StyledChain = styled(Chain).attrs({
  alignItems: 'center',
  width: '100%',
})`
  overflow: hidden;
  flex-wrap: nowrap;
  @media ${mq('*-md')} {
    flex-wrap: wrap;
  }
`
