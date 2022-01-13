import styled from 'styled-components'
import { Card, Text } from '@revolut/ui-kit'

export const PageSectionTitle = styled(Text).attrs({
  fontSize: 'smaller',
  lineHeight: 'smallText',
  color: 'cardSettingsSectionTitle',
})``

export const PageSectionContent = styled(Card).attrs({
  p: 'px24',
  mt: 'px16',
  width: '100%',
  maxWidth: { md: 'components.PageSectionContent.maxWidth.md' },
  variant: 'plain',
})``
