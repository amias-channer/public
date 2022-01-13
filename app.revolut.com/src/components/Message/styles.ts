import * as React from 'react'
import * as R from 'ramda'
import { Box, Text, Flex, TextBox, Button } from '@revolut/ui-kit'
import styled from 'styled-components'

export const MessageWrapper = styled<React.ElementType>(Flex).attrs({
  my: '0.125rem',
  maxWidth: '88%',
})`
  overflow: hidden;
  border-radius: 1.25rem;
  &&& {
    ${({ isRetry }) => (isRetry ? 'border-bottom-right-radius: 1.25rem;' : '')}
  }
  line-height: 1.25rem;
  word-break: break-word;
  -webkit-font-smoothing: antialiased;
  opacity: ${({ isRetry }) => (isRetry ? 0.3 : 1)};
  border: ${({ withImage, withFile, withAvatar, theme }) => {
    if (withImage) {
      return `2px solid ${R.path(['colors', 'grey-100'], theme)}`
    }
    if (withFile) {
      return `1px solid ${R.path(['colors', 'grey-90'], theme)}`
    }
    if (withAvatar) {
      return `1px solid ${R.path(['colors', 'grey-95'], theme)}`
    }
    return 'none'
  }};
`
MessageWrapper.displayName = 'MessageWrapper'

export const MessagesWrapper = styled<React.ElementType>(Flex).attrs({
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
})``
MessagesWrapper.displayName = 'MessagesWrapper'

export const ScrollWrapper = styled<React.ElementType>(Box).attrs({
  pb: '1rem',
  flex: '1',
})`
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: ${({ smoothScroll }) =>
    smoothScroll ? 'smooth' : 'initial'};
`
ScrollWrapper.displayName = 'ScrollWrapper'

/* This anchor prevents the scrolling window from jumping when uploading images */
export const Anchor = styled<React.ElementType>(Box)`
  height: 1px;
  overflow-anchor: auto;
`
Anchor.displayName = 'Anchor'

export const SubMessage = styled<React.ElementType>(Text).attrs({
  color: 'grey-50',
  whiteSpace: 'nowrap',
  variant: 'caption',
  px: '1rem',
  mt: '0.25rem',
  mb: '0.5rem',
})`
  vertical-align: baseline;
`
SubMessage.displayName = 'SubMessage'

export const SubMessageButtonsWrapper = styled<React.ElementType>(Flex).attrs({
  whiteSpace: 'nowrap',
  px: 2,
  mb: 1,
})`
  vertical-align: baseline;
  justify-content: flex-end;
`
SubMessageButtonsWrapper.displayName = 'SubMessageButtonsWrapper'

export const SubMessageButton = styled<React.ElementType>(Button).attrs({
  width: 'auto',
  p: 0,
  variant: 'text',
  size: 'sm',
})`
  height: auto;
`
SubMessageButton.displayName = 'SubMessageButton'

export const MessageGroup = styled<React.ElementType>(Flex).attrs({
  flexDirection: 'column',
  px: '1rem',
})`
  ${MessageWrapper} {
    margin-left: ${({ fromClient }) => (fromClient ? 'auto' : 'initial')};
    margin-right: ${({ fromClient }) => (fromClient ? 'initial' : 'auto')};
    border-radius: ${({ fromClient }) =>
      fromClient
        ? '1.25rem .25rem .25rem 1.25rem'
        : '.25rem 1.25rem 1.25rem .25rem'};
    &:first-child {
      border-top-left-radius: 1.25rem;
      border-top-right-radius: 1.25rem;
    }
    &:last-of-type {
      border-bottom-left-radius: 1.25rem;
      border-bottom-right-radius: 1.25rem;
    }
    &:only-child {
      border-radius: 1.25rem;
    }
  }
  ${SubMessage} {
    margin-left: ${({ fromClient }) => (fromClient ? 'auto' : 'initial')};
    margin-right: ${({ fromClient }) => (fromClient ? 'initial' : 'auto')};
  }
`
MessageGroup.displayName = 'MessageGroup'

export const ChatDateTitle = styled(TextBox).attrs({
  textAlign: 'center',
  color: 'grey-50',
  width: '100%',
  variant: 'caption',
  p: '1rem',
})``
ChatDateTitle.displayName = 'ChatDateTitle'

export const ImageBase = styled<React.ElementType>(Box).attrs({
  as: 'img',
  width: '100%',
  height: '100%',
})`
  cursor: pointer;
`
ImageBase.displayName = 'ImageBase'

export const FileLoad = styled<React.ElementType>(Box).attrs({
  as: 'a',
  px: '1rem',
  py: '0.75rem',
})`
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
`
FileLoad.displayName = 'FileLoad'

export const TextMessage = styled<React.ElementType>(Text).attrs({
  variant: 'secondary',
})``
