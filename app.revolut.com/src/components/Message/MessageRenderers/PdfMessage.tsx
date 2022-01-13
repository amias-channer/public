import React from 'react'
import { Media, Flex } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { MessageWrapper, FileLoad, TextMessage } from '../styles'
import { useSendChatEvent } from '../../../providers'
import { AnalyticsEvent } from '../../../constants/analytics'

type Props = {
  className: string
  fileName?: string
  src?: string
  isRetry?: boolean
}

export const PdfMessage = ({
  className,
  fileName,
  src,
  isRetry = false,
}: Props) => {
  const sendChatEvent = useSendChatEvent()

  return (
    <MessageWrapper bg='white' p={0} withFile isRetry={isRetry}>
      <FileLoad
        href={src}
        target='_blank'
        onClick={() => {
          sendChatEvent({
            type: AnalyticsEvent.FILE_DOWNLOAD,
            params: { type: 'pdf' },
          })
        }}
      >
        <Media>
          <Media.Side mr='0.75rem'>
            <Icons.Clip size='xl' color='grey-50' />
          </Media.Side>
          <Media.Side>
            <Flex alignItems='center' height='100%'>
              <TextMessage color='black'>{fileName}</TextMessage>
            </Flex>
          </Media.Side>
        </Media>
      </FileLoad>
    </MessageWrapper>
  )
}
