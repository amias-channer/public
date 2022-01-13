import {
  Flex,
  Box,
  Card,
  Text,
  TextBox,
  AvatarCircle as RawAvatar,
} from '@revolut/ui-kit'
import { ellipsis } from 'polished'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

import { MAX_CHAT_WINDOW_HEIGHT } from '../constants/utils'

import { slideTopAppearance } from './keyframes'

export const SupportChatWrapper = styled<any>(Flex).attrs({
  flexDirection: 'column',
  bg: 'white',
  height: 'calc(100vh - 3.5rem)',
  width: 'calc(100vw - 0.75rem)',
  maxWidth: '26rem',
  radius: '1rem',
})`
  max-height: 37.5rem;
  @media (max-height: ${MAX_CHAT_WINDOW_HEIGHT}px) {
    max-height: calc(100vh - 7rem);
  }
`
SupportChatWrapper.displayName = 'SupportChatWrapper'

export const Ellipsis = styled<React.ElementType>(Box)`
  ${ellipsis()};
`
Ellipsis.displayName = 'Ellipsis'

export const EllipsisText = styled<React.ElementType>(Text)`
  ${ellipsis()};
`
EllipsisText.displayName = 'EllipsisText'

export const ContentWrapper = styled<React.ElementType>(Flex).attrs({
  flex: 1,
  flexDirection: 'column',
  maxHeight: '100%',
})``

export const StyledTextArea: any = styled.textarea`
  border: 0;
  overflow: auto;
  resize: none;
  outline: none;
  vertical-align: bottom;
  width: 100%;
  height: 1.5rem;
  font-size: 0.875rem;
  max-height: 8.5rem;
  line-height: 1.25rem;
`
StyledTextArea.displayName = 'StyledTextArea'

export const HeaderWrapper = styled(Flex).attrs({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'flex-end',
  bg: 'white',
})`
  z-index: 1;
  position: relative;
  box-sizing: content-box;
  transition: box-shadow 0.2s ease-in-out;
`
HeaderWrapper.displayName = 'HeaderWrapper'

export const TicketsWrapper = styled(Box).attrs({
  py: '1rem',
  maxHeight: '100%',
})`
  overflow: auto;
`
TicketsWrapper.displayName = 'TicketsWrapper'

export const ChatWrapper = styled<React.ElementType>(Flex).attrs({
  flexDirection: 'column',
  justifyContent: 'flex-end',
  flex: '1',
  height: '100%',
})`
  position: relative;
`
ChatWrapper.displayName = 'ChatWrapper'

export const Content = styled(Flex).attrs({
  flexDirection: 'column',
  flex: '1',
  height: 'calc(100% - 4rem)',
})`
  position: relative;
  overflow: hidden;
`
Content.displayName = 'Content'

export const Iframe: React.ElementType = styled(Box).attrs({
  as: 'iframe',
})`
  border: none;
  animation: ${slideTopAppearance} 0.2s linear;
  width: 100%;
`
Iframe.displayName = 'Iframe'

export const InlineButton = styled<React.ElementType>(TextBox)`
  background-color: transparent;
  height: auto;
  width: auto;
`

export const MessagePreviewsCardWrapper = styled<React.ElementType>(Card).attrs(
  {
    elevation: 600,
    width: '23rem',
    bg: 'white',
    radius: '0.25rem',
  }
)`
  cursor: pointer;
`

export const Link: React.ElementType = styled(Text).attrs({
  as: 'a',
  color: 'primary',
})`
  text-decoration: none;
`

export const Avatar = styled<React.ElementType>(RawAvatar)`
  min-height: 2.5rem;
  min-width: 2.5rem;
  height: 2.5rem;
  width: 2.5rem;
  padding-top: 2px;
`

export const ChatHint = styled(TextBox)`
  border-top: 1px solid ${themeGet('colors.grey-95')};
`

export const CloseButtonWrapper = styled<React.ElementType>(Box)`
  margin: 1.5rem 0.25rem;
`
