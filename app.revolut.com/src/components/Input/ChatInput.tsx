/* eslint-disable react-hooks/exhaustive-deps */
import * as R from 'ramda'
import { Box, Flex, FileInput } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { useIntl } from 'react-intl'
import * as React from 'react'

import { KEYCODES } from '../../constants/keycodes'

import {
  SendButtonWrapper,
  SendIcon,
  ChatInputWrapper,
  TextAreaInput,
} from './styles'

export const TEST_ID_CHAT_INPUT = 'TEST_ID_CHAT_INPUT'

type Props = {
  sendMessage: (value: string | FormData) => void
  preFillMessage: string
  prefillInput: (value?: string) => void
}

export const ChatInput: React.FC<Props> = ({
  sendMessage,
  preFillMessage = '',
  prefillInput,
}) => {
  const [value, setValue] = React.useState<string>(preFillMessage)
  const [isPlaceholderVisible, setPlaceholderVisibility] = React.useState<
    boolean
  >(true)
  const { formatMessage } = useIntl()

  React.useEffect(() => {
    preFillMessage && prefillInput('')
  }, [])

  const onInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }

  const onSendMessageClick = () => {
    const trimmedValue = value.trim()

    if (trimmedValue) {
      sendMessage(trimmedValue)
      setValue('')
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.persist()
    e.stopPropagation()

    const key = e.keyCode || e.which
    const isEnter = key === KEYCODES.ENTER

    const text = e.currentTarget.value.trim()
    const isSendEvent = !e.shiftKey && isEnter

    if (isSendEvent && text.length > 0) {
      onSendMessageClick()
      setValue('')
      e.preventDefault()
    }
  }

  const showPlaceholder = () => {
    setPlaceholderVisibility(true)
  }

  const hidePlaceholder = () => {
    setPlaceholderVisibility(false)
  }

  const onFocus = () => {
    hidePlaceholder()
  }

  const onBlur = () => {
    showPlaceholder()
  }

  const onSendFileClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = R.head([...e.currentTarget.files])

      if (file) {
        const formDataToUpload = new FormData()
        formDataToUpload.append('file', file, file.name)

        sendMessage(formDataToUpload)
      }
    }
  }

  const localisedPlaceholder = formatMessage({
    id: 'supportChat.input.placeholder',
    defaultMessage: 'Type a message',
  })
  const placeholder =
    isPlaceholderVisible && !(preFillMessage || value)
      ? localisedPlaceholder
      : ' '

  return (
    <ChatInputWrapper data-testid={TEST_ID_CHAT_INPUT}>
      <Box flex='1' mr='1.5rem' mt='-4px'>
        <TextAreaInput
          autosize
          autoFocus
          textStyle='secondary'
          border={false}
          onFocus={onFocus}
          onBlur={onBlur}
          size='compact'
          variant='underlined'
          placeholder={placeholder}
          value={preFillMessage || value}
          onKeyDown={onKeyDown}
          onChange={onInputChange}
        />
      </Box>
      <Flex alignItems='flex-end' height='2rem'>
        {value ? (
          <SendButtonWrapper onClick={onSendMessageClick}>
            <SendIcon color='lightGrey' hoverColor='primary' bg='transparent' />
          </SendButtonWrapper>
        ) : (
          <FileInput onChange={onSendFileClick}>
            <Icons.Clip color='lightGrey' hoverColor='primary' />
          </FileInput>
        )}
      </Flex>
    </ChatInputWrapper>
  )
}
