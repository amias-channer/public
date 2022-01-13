import React, { FC } from 'react'
import { Flex, Box, Button, Input } from '@revolut/ui-kit'
import { useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

import { signIn } from '../redux/reducers/auth'
import { PhoneInput } from '../components/PhoneInput'
import countries from '../helpers/countries'

export const TEST_ID_SIGNIN_FORM = 'TEST_ID_SIGNIN_FORM'
export const TEST_ID_SIGNIN_FORM_NAME = 'TEST_ID_SIGNIN_FORM_NAME'
export const TEST_ID_SIGNIN_FORM_COMPANY = 'TEST_ID_SIGNIN_FORM_COMPANY'
export const TEST_ID_SIGNIN_FORM_PHONE = 'TEST_ID_SIGNIN_FORM_PHONE'
export const TEST_ID_SIGNIN_FORM_SUBMIT = 'TEST_ID_SIGNIN_FORM_SUBMIT'

export const Signin: FC = () => {
  const [name, setName] = React.useState<string>('')
  const [businessName, setBusinessName] = React.useState<string>('')
  const [countryCode, setCountryCode] = React.useState<string>('')
  const [phone, setPhone] = React.useState<string>('')
  const [triedSignin, setTriedSignin] = React.useState<boolean>(false)

  const dispatch = useDispatch()
  const { formatMessage } = useIntl()

  const handleSignin = () => {
    setTriedSignin(true)

    if (name === '' || phone === '' || countryCode === '') {
      return null
    }

    const countryNumber =
      countryCode in countries ? countries[countryCode].phoneCode : ''

    dispatch(
      signIn({
        businessName,
        name,
        phone: `+${countryNumber}${phone}`,
        anonymous: true,
      })
    )

    return null
  }

  const namePlaceholder = formatMessage({
    id: 'supportChat.signin.namePlaceholder',
    defaultMessage: 'Please enter your name',
  })
  const phonePlaceholder = formatMessage({
    id: 'supportChat.signin.phonePlaceholder',
    defaultMessage: 'Phone number',
  })
  const companyPlaceholder = formatMessage({
    id: 'supportChat.signin.companyPlaceholder',
    defaultMessage: 'Company name (optional)',
  })
  const requiredFieldLabel = formatMessage({
    id: 'supportChat.signin.requiredField',
    defaultMessage: 'Required field',
  })

  return (
    <Flex
      data-testid={TEST_ID_SIGNIN_FORM}
      flexDirection='column'
      justifyContent='space-between'
      px='1.5rem'
      py='1rem'
      height='100%'
      as='form'
      onSubmit={(e: React.KeyboardEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        // TODO: Temporary fix till Component `Slide` listen event on window
        e.stopPropagation()
      }}
    >
      <Box />
      <Box>
        <Box mb={2}>
          <Input
            variant='filled'
            data-testid={TEST_ID_SIGNIN_FORM_NAME}
            placeholder={namePlaceholder}
            error={triedSignin && name === '' ? requiredFieldLabel : ''}
            onChange={(e: React.KeyboardEvent<HTMLInputElement>) =>
              setName(e.currentTarget.value)
            }
          />
        </Box>
        <Box mb={2}>
          <PhoneInput
            variant='filled'
            data-testid={TEST_ID_SIGNIN_FORM_PHONE}
            error={triedSignin && phone === '' ? requiredFieldLabel : ''}
            countryCodeError={
              triedSignin && countryCode === '' ? requiredFieldLabel : ''
            }
            placeholder={phonePlaceholder}
            value={{
              countryCode,
              number: phone,
            }}
            onChange={({
              countryCode: code,
              number,
            }: {
              countryCode: string
              number: string
            }) => {
              setCountryCode(code)
              setPhone(number)
            }}
          />
        </Box>
        <Box>
          <Input
            data-testid={TEST_ID_SIGNIN_FORM_COMPANY}
            variant='filled'
            placeholder={companyPlaceholder}
            onChange={(e: React.KeyboardEvent<HTMLInputElement>) =>
              setBusinessName(e.currentTarget.value)
            }
          />
        </Box>
      </Box>
      <Box>
        <Button
          data-testid={TEST_ID_SIGNIN_FORM_SUBMIT}
          onClick={handleSignin}
          type='submit'
        >
          <FormattedMessage
            id='supportChat.signin.startChatButton'
            defaultMessage='Start chat'
          />
        </Button>
      </Box>
    </Flex>
  )
}
