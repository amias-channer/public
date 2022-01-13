import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Relative,
  Box,
  H3,
  Text,
  Absolute,
  Flex,
  TextButton,
} from '@revolut/ui-kit'
import { ShevronLeft } from '@revolut/icons'
import styled from 'styled-components'
import { ACCESS_RECOVERY_CDN_IMAGE } from '../../constants/accessRecovery'
import { ActionButton } from '../ActionButton'
import { cdnLink } from '../../helpers/assets'

const ConfirmButton = styled(ActionButton)`
  height: 3.5rem;
`

const Image = styled.img`
  max-height: 260px;
`

type Props = {
  onContinue: () => void
  onBack: () => void
}

export const AccessRecoveryInitialBanner = ({ onContinue, onBack }: Props) => (
  <Relative height='100%'>
    <Flex
      width='100%'
      px={2}
      pt={2}
      pb='0.75rem'
      justifyContent='space-between'
      alignItems='center'
    >
      <TextButton onClick={onBack} color='grey-50'>
        <ShevronLeft size={24} />
      </TextButton>
      <Box />
    </Flex>
    <Flex flexDirection='column' alignItems='center'>
      <H3 px='1rem'>
        <FormattedMessage
          id='supportChat.accessRecovery.initialMessage.title'
          defaultMessage='Regain access to your account'
        />
      </H3>
      <Text color='grey-50' px={2} pt={2} pb={1}>
        <FormattedMessage
          id='supportChat.accessRecovery.initialMessage.securityInfo'
          defaultMessage='In order to proceed securely we need you to answer a few simple security questions.'
        />
      </Text>
      <Text color='grey-50' px={2}>
        <FormattedMessage
          id='supportChat.accessRecovery.initialMessage.ifAccess'
          defaultMessage='If you have access to your account, login to contact us from our in-app Help Centre.'
        />
      </Text>
      <Box px='2.5rem'>
        <Image src={cdnLink(ACCESS_RECOVERY_CDN_IMAGE)} />
      </Box>
    </Flex>
    <Absolute bottom={0} pb='1.5rem' px={2} zIndex={2} width='100%'>
      <ConfirmButton variant='primary' onClick={onContinue}>
        <FormattedMessage
          id='supportChat.accessRecovery.continue'
          defaultMessage='Continue'
        />
      </ConfirmButton>
    </Absolute>
  </Relative>
)
