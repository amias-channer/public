import * as React from 'react'
import { FormattedMessage } from 'react-intl'

import { isImageType, isPDFType } from '../../helpers/utils'

interface Props {
  mediaType?: string
}

export const FailedText = ({ mediaType }: Props) => {
  if (isPDFType(mediaType)) {
    return (
      <FormattedMessage
        id='supportChat.message.pdfSendingFailed'
        defaultMessage='File failed to send'
      />
    )
  }

  if (isImageType(mediaType)) {
    return (
      <FormattedMessage
        id='supportChat.message.imageSendingFailed'
        defaultMessage='Image failed to send'
      />
    )
  }

  return (
    <FormattedMessage
      id='supportChat.message.messageSendingFailed'
      defaultMessage='Message failed to send'
    />
  )
}
