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
import { ACCESS_RECOVERY_CDN_ALERT_IMAGE } from '../../constants/accessRecovery'
import { ActionButton } from '../ActionButton'
import { cdnLink } from '../../helpers/assets'
import { isRetailCodesApp } from '../../helpers/retail'

const RETAIL_DOMAINS = {
  domainCodes: 'app.revolut.codes',
  domain: 'app.revolut.com',
}

const BUSINESS_DOMAINS = {
  domainCodes: 'business.revolut.codes',
  domain: 'business.revolut.com',
}

const ConfirmButton = styled(ActionButton)`
  height: 3.5rem;
`

const Image = styled.img`
  max-height: 260px;
`

type Props = {
  onBack: () => void
}

export const AccessRecoveryForbidden = ({ onBack }: Props) => {
  const intlDomainValues = isRetailCodesApp()
    ? RETAIL_DOMAINS
    : BUSINESS_DOMAINS

  return (
    <Relative height='100%'>
      <Flex
        width='100%'
        px='s-16'
        pt='s-16'
        pb='s-8'
        justifyContent='space-between'
        alignItems='center'
      >
        <TextButton onClick={onBack} color='grey-50'>
          <ShevronLeft size={24} />
        </TextButton>
        <Box />
      </Flex>
      <Flex flexDirection='column' alignItems='center'>
        <H3 px='s-16'>
          <FormattedMessage
            id='supportChat.accessRecovery.forbidden.title'
            defaultMessage='This is our sandbox environment for tests'
          />
        </H3>
        <Text color='grey-50' px='s-16' pt='s-16' pb='s-8'>
          <FormattedMessage
            id='supportChat.accessRecovery.forbidden.noAccess'
            defaultMessage="You'll not be able to login or recover your account in {domainCodes}."
            values={{
              domainCodes: intlDomainValues.domainCodes,
            }}
          />
        </Text>
        <Text color='grey-50' px='s-16'>
          <FormattedMessage
            id='supportChat.accessRecovery.forbidden.whereToGo'
            defaultMessage='Please go to {domain} to login to your account.'
            values={{
              domain: intlDomainValues.domain,
            }}
          />
        </Text>
        <Box px='s-8'>
          <Image src={cdnLink(ACCESS_RECOVERY_CDN_ALERT_IMAGE)} />
        </Box>
      </Flex>
      <Absolute bottom={0} pb='s-16' px='s-16' zIndex={2} width='100%'>
        <ConfirmButton variant='primary' onClick={onBack}>
          <FormattedMessage
            id='supportChat.accessRecovery.continue'
            defaultMessage='Continue'
          />
        </ConfirmButton>
      </Absolute>
    </Relative>
  )
}
