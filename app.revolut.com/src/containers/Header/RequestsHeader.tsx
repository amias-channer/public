import React, { useContext } from 'react'
import { TextBox, Flex } from '@revolut/ui-kit'
import { FormattedMessage } from 'react-intl'

import { ChatHeaderContext } from '../../providers'

export const RequestsHeader = () => {
  const { setIsChatHeaderMinimized } = useContext(ChatHeaderContext)
  setIsChatHeaderMinimized(true)

  return (
    <Flex width='100%' p={2} justifyContent='center'>
      <TextBox variant='secondary' fontWeight={500}>
        <FormattedMessage
          id='supportChat.tab.requests'
          defaultMessage='Requests'
        />
      </TextBox>
    </Flex>
  )
}
