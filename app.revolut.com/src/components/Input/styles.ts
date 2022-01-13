import styled from 'styled-components'
import { themeGet } from 'styled-system'
import * as Icons from '@revolut/icons'
import { Flex, TextArea } from '@revolut/ui-kit'

import { fadeIn } from '../keyframes'
import { transition } from '../../constants/timings'

export const SendButtonWrapper: any = styled('button')`
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  padding: 0;
`
SendButtonWrapper.displayName = 'SendButtonWrapper'

export const SendIcon = styled<any>(Icons.SendMessage)`
  transition: color ${transition(transition.INTERVALS.SM)};
`
SendIcon.displayName = 'SendIcon'

export const ClipIcon = styled<any>(Icons.Link)`
  transition: color ${transition(transition.INTERVALS.SM)};
`
ClipIcon.displayName = 'ClipIcon'

export const ChatInputWrapper = styled(Flex).attrs({
  pt: '5px',
  px: 2,
  pb: 2,
  alignItems: 'flex-end',
})`
  animation: ${fadeIn} ${transition(transition.INTERVALS.SM)};
  animation-fill-mode: both;
  border-top: 1px solid ${themeGet('colors.grey-95')};

  & label > div {
    transition: none;
  }
`
ChatInputWrapper.displayName = 'ChatInputWrapper'

export const TextAreaInput = styled<React.ElementType>(TextArea)`
  max-height: 13.5rem;
  min-height: 1.25rem;
  border: none;
  background: none;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
TextAreaInput.displayName = 'TextAreaInput'
