import * as React from 'react'
import * as R from 'ramda'
import { Text } from '@revolut/ui-kit'
import { FormattedMessage, FormattedTime } from 'react-intl'

import { MessageType } from '../../api/ticketTypes'
import { HandleFailedMessagePropType } from '../../containers/Chat/Chat'
import { getMessageUniqKey } from '../../helpers/utils'

import {
  MessageGroup,
  SubMessageButtonsWrapper,
  SubMessageButton,
  SubMessage,
} from './styles'
import { Message } from './Message'
import { FailedText } from './FailedText'
import { MessagePayloadType, ServiceType } from '../../api/types'

type Props = {
  messagesGroup: MessageType[]
  onDeleteMessage: (props: HandleFailedMessagePropType) => void
  onRetryMessage: (props: HandleFailedMessagePropType) => void
  onRequestFullImage: (props: MessageType) => void
}
export const MessagesBlockGroup = ({
  messagesGroup = [],
  onDeleteMessage,
  onRetryMessage,
  onRequestFullImage,
}: Props) => {
  if (R.isEmpty(messagesGroup)) {
    return null
  }

  const first = R.head(messagesGroup) as MessageType
  const last = R.last(messagesGroup) as MessageType

  const key = getMessageUniqKey(first)
  const showTime = !last.isFailed && !last.isSending
  const groupFromClient =
    first.payloadType === MessagePayloadType.SERVICE &&
    [ServiceType.ASSIGNED, ServiceType.ESCALATED].includes(first.payload.type)
      ? false
      : first.fromClient

  return (
    <MessageGroup fromClient={groupFromClient}>
      {messagesGroup.map((message) => {
        const {
          isFailed,
          isSending,
          payload,
          correlationId,
          ticketId,
          fromClient,
          isRetry,
        } = message
        const uniqueKey = getMessageUniqKey(message)

        return (
          <React.Fragment key={key}>
            <Message
              key={uniqueKey}
              fromClient={fromClient}
              message={message}
              onRequestFullImage={onRequestFullImage}
              isRetry={isRetry}
            />
            {!isFailed && isSending && (
              <SubMessage key={`${uniqueKey}_time`}>
                <FormattedMessage
                  id='supportChat.message.sending'
                  defaultMessage='Sending...'
                />
              </SubMessage>
            )}
            {isFailed && (
              <SubMessage key={`${uniqueKey}_time`}>
                <FailedText mediaType={payload && payload.mediaType} />
              </SubMessage>
            )}
            {isFailed && (
              <SubMessageButtonsWrapper key={`${uniqueKey}_buttons`}>
                <SubMessageButton
                  color='error'
                  mr='1rem'
                  onClick={() => onDeleteMessage({ correlationId, ticketId })}
                >
                  <Text variant='caption'>
                    <FormattedMessage
                      id='supportChat.message.deleteFailed'
                      defaultMessage='Delete'
                    />
                  </Text>
                </SubMessageButton>
                <SubMessageButton
                  color='primary'
                  onClick={() => onRetryMessage({ correlationId, ticketId })}
                >
                  <Text variant='caption'>
                    <FormattedMessage
                      id='supportChat.message.resendFailed'
                      defaultMessage='Resend'
                    />
                  </Text>
                </SubMessageButton>
              </SubMessageButtonsWrapper>
            )}
          </React.Fragment>
        )
      })}
      {showTime && (
        <SubMessage>
          <FormattedTime value={last.createdAt} />
        </SubMessage>
      )}
    </MessageGroup>
  )
}
