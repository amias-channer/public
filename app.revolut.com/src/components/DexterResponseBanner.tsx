import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Relative,
  Box,
  H3,
  TextBox,
  Absolute,
  Flex,
  TextButton,
} from '@revolut/ui-kit'
import { ShevronLeft } from '@revolut/icons'
import styled from 'styled-components'
import { ActionButton } from './ActionButton'
import { DexterSuggestion } from '../api/types'

const HEADER_BUTTONS_MARGIN = '200px'
const BUTTONS_MARGIN = '120px'

const ConfirmButton = styled(ActionButton)`
  height: 3.5rem;
`

const ScrollableWrapper = styled(Box)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
`

type Props = {
  suggestion: DexterSuggestion
  onContinue: () => void
  onFinish: () => void
  onBack: () => void
}

export const DexterResponseBanner = ({
  suggestion,
  onContinue,
  onFinish,
  onBack,
}: Props) => (
  <Relative height='100%'>
    <Flex
      width='100%'
      px={2}
      pt={2}
      pb='0.75rem'
      justifyContent='space-between'
    >
      <TextButton onClick={onBack} color='grey-50'>
        <ShevronLeft size={24} />
      </TextButton>
      <Box />
    </Flex>
    <ScrollableWrapper>
      <Box minHeight={`calc(100% - ${HEADER_BUTTONS_MARGIN})`}>
        <TextBox px={2} pb={2} variant='secondary' color='grey-50'>
          <FormattedMessage
            id='supportChat.dexter.header'
            defaultMessage='Based on your description'
          />
        </TextBox>
        {suggestion.title && <H3 px={2}>{suggestion.title}</H3>}
        <TextBox
          color='grey-35'
          px={2}
          pt={2}
          pb={1}
          dangerouslySetInnerHTML={{
            __html: suggestion.content,
          }}
        />
      </Box>

      <Box pb='1.5rem' px={2} mb={BUTTONS_MARGIN}>
        <ConfirmButton variant='secondary' onClick={onContinue}>
          <FormattedMessage
            id='supportChat.dexter.moreHelp'
            defaultMessage='Need more help? Talk to an agent'
          />
        </ConfirmButton>
      </Box>
    </ScrollableWrapper>
    <Absolute bottom={0} pb='1.5rem' px={2} zIndex={2} width='100%'>
      <ConfirmButton variant='primary' onClick={onFinish} px={2}>
        <FormattedMessage
          id='supportChat.dexter.gotIt'
          defaultMessage='Got it, thanks!'
        />
      </ConfirmButton>
    </Absolute>
  </Relative>
)
