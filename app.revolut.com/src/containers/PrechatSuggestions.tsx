import React from 'react'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { Box, TransitionSlide, Link } from '@revolut/ui-kit'
import { FormattedMessage } from 'react-intl'

import { MessageGroup, MessageWrapper, SubMessage } from '../components/Message'

const SUGGESTION_LIMIT = 5
const QUERY_SUGGESTION_KEY = 'prechat-suggestions'

const StyledLink = styled(Link)`
  cursor: pointer;
`

type Props = {
  fetchTroubleshootSuggestions: () => Promise<string[]>
  visible: boolean
  sendMessage: (_: string) => void
}

export const PrechatSuggestions = ({
  visible,
  fetchTroubleshootSuggestions,
  sendMessage,
}: Props) => {
  const { data: entries = [], isLoading } = useQuery(QUERY_SUGGESTION_KEY, () =>
    fetchTroubleshootSuggestions()
  )

  return (
    <TransitionSlide in={!isLoading && visible} offsetX={0} offsetY={14}>
      <Box>
        {entries.slice(0, SUGGESTION_LIMIT).map((content) => (
          <MessageGroup fromClient key={content}>
            <MessageWrapper bg='action-background' px='s-16' py='s-8'>
              <StyledLink
                color='primary'
                variant='caption'
                onClick={() => sendMessage(content)}
              >
                {content}
              </StyledLink>
            </MessageWrapper>
          </MessageGroup>
        ))}
        {entries.length > 0 && (
          <MessageGroup fromClient>
            <SubMessage>
              <FormattedMessage
                id='supportChat.message.suggestions'
                defaultMessage='Select a suggestion'
              />
            </SubMessage>
          </MessageGroup>
        )}
      </Box>
    </TransitionSlide>
  )
}
