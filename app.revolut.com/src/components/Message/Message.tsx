import * as React from 'react'
import { Flex, AvatarCircle } from '@revolut/ui-kit'
import { v4 as uuid } from 'uuid'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { decodeHtmlEntities, isPDFType } from '../../helpers/utils'
import { ACCEPTED_UPLOAD_TYPES } from '../../constants/upload'
import { MessageType } from '../../api/ticketTypes'
import { MessagePayloadType, ServiceType, PayloadType } from '../../api/types'
import { agentByIdSelector } from '../../redux/selectors/agents'

import { MessageMarkdown } from './MessageMarkdown'
import { StructuredMessage, ImageMessage, PdfMessage } from './MessageRenderers'
import { MessageWrapper, TextMessage } from './styles'
import { BOT_NAMES_TO_IGNORE } from '../../constants/agents'
import { useSettings } from '../../providers'

/* Label for text messages to know their size for animation */
export const MESSAGE_DOM_CLASS = `chatMessage_${uuid()}`

type Props = {
  fromClient: boolean
  isRetry: boolean
  message: MessageType
  onRequestFullImage: (props: MessageType) => void
}

type PreviewProps = {
  src: string
  onClose: () => void
}

export const Message = ({
  fromClient,
  message,
  isRetry,
  onRequestFullImage,
}: Props) => {
  const { payloadType, payload } = message
  const agent = useSelector(
    agentByIdSelector(payload?.assigned?.agentId || payload?.agentId)
  )
  const { transformContent } = useSettings()

  if (!payload) {
    return null
  }

  const isSrc =
    payload.mediaType && ACCEPTED_UPLOAD_TYPES.test(payload.mediaType)
  const src = payload.url
  const name = payload.name
  const isPDF = isPDFType(payload.mediaType)

  if (isSrc) {
    if (isPDF) {
      return (
        <PdfMessage className={MESSAGE_DOM_CLASS} fileName={name} src={src} />
      )
    }

    return (
      <ImageMessage
        className={MESSAGE_DOM_CLASS}
        fileName={name}
        src={src}
        isRetry={isRetry}
        onPreview={() => {
          if (onRequestFullImage) {
            onRequestFullImage(message)
          }
        }}
      />
    )
  }

  if (payloadType === MessagePayloadType.SERVICE) {
    switch (payload.type) {
      case ServiceType.ASSIGNED:
      case ServiceType.ESCALATED: {
        if (!agent || BOT_NAMES_TO_IGNORE.includes(agent.name)) {
          return null
        }

        return (
          <MessageWrapper
            withAvatar
            p='4px'
            pr={1}
            className={MESSAGE_DOM_CLASS}
          >
            <TextMessage color='black'>
              <Flex alignItems='center'>
                <AvatarCircle
                  size={32}
                  mr={1}
                  image={agent.src}
                  variant='filled'
                  bg='grey-80'
                >
                  {agent.src ? '' : agent.name.charAt(0)}
                </AvatarCircle>
                <FormattedMessage
                  id='supportChat.message.assigned'
                  defaultMessage='{name} is here to help you'
                  values={{ name: agent.name }}
                />
              </Flex>
            </TextMessage>
          </MessageWrapper>
        )
      }
      case ServiceType.RATED:
        return (
          <MessageWrapper
            bg='primary'
            px={2}
            py={1}
            className={MESSAGE_DOM_CLASS}
          >
            <TextMessage color='white'>
              <FormattedMessage
                id='supportChat.message.rated'
                defaultMessage='Rated {rating}'
                values={{ rating: payload.rating }}
              />
            </TextMessage>
          </MessageWrapper>
        )
      default:
        return null
    }
  }

  if (payload.type === PayloadType.STRUCTURE && payload.content) {
    return (
      <StructuredMessage
        className={MESSAGE_DOM_CLASS}
        content={payload.content}
      />
    )
  }

  if (!payload.text) {
    return null
  }

  const transformedContent = transformContent(payload.text, 'message')
  const decodedHtmlEntities = decodeHtmlEntities(transformedContent)
  const lines: React.ReactNode[] = decodedHtmlEntities.split(/\r\n|\n|\r/)

  return (
    <MessageWrapper
      bg={fromClient ? 'primary' : 'grey-100'}
      px={2}
      py={1}
      className={MESSAGE_DOM_CLASS}
      isRetry={isRetry}
    >
      <TextMessage color={fromClient ? 'white' : 'black'}>
        {lines.map((line, index) => (
          <MessageMarkdown
            key={index}
            linkColor={fromClient ? 'white' : 'primary'}
          >
            {line}
          </MessageMarkdown>
        ))}
      </TextMessage>
    </MessageWrapper>
  )
}
