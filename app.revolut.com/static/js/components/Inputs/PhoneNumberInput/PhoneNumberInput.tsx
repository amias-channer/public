import { formatIncompletePhoneNumber } from 'libphonenumber-js/min'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRifm } from 'rifm'
import { Box, Flex } from '@revolut/ui-kit'

import { FormFieldGenericPropsFC, TextInput } from '@revolut/rwa-core-components'
import { formatPhoneNumber } from '@revolut/rwa-core-utils'

import { CountryCodeSelect } from 'components/CountryCodeSelect'

import { PhoneNumberInputProps, PhoneNumberInputTestId } from './types'

const removeCountryCode = (formattedPhoneNumber: string) =>
  formattedPhoneNumber.split(' ').slice(1).join(' ')

const getFormattedNumberWithoutCountryCode = (code: string, number: string) => {
  const parsedNumberInputValue = formatIncompletePhoneNumber(
    formatPhoneNumber({ code, number }),
  )

  return code ? removeCountryCode(parsedNumberInputValue) : parsedNumberInputValue
}

export const PhoneNumberInput: FormFieldGenericPropsFC<PhoneNumberInputProps> = ({
  name,
  value = { code: '', number: '' },
  onChange,
  countryCodeSelectProps,
}) => {
  const { t } = useTranslation('components.PhoneNumberInput')
  const [code, setCode] = useState<string>(value.code)
  const [number, setNumber] = useState<string>(
    getFormattedNumberWithoutCountryCode(value.code, value.number),
  )
  const numberInputRef = useRef<HTMLInputElement>(null)

  const rifm = useRifm({
    value: number,
    onChange: setNumber,
    format: (rifmValue: string) => getFormattedNumberWithoutCountryCode(code, rifmValue),
  })

  useEffect(() => {
    onChange({
      code,
      number: number.replace(/\D/g, ''),
    })
  }, [code, number, onChange])

  useEffect(() => {
    setCode(value.code)
  }, [value.code])

  useEffect(() => {
    if (code) {
      numberInputRef.current?.focus()
    }
  }, [code])

  return (
    <Flex>
      <Box mr={{ _: 'px16', tablet: 'px24' }}>
        <CountryCodeSelect
          inputSelectProps={{ value: code }}
          onChange={setCode}
          {...countryCodeSelectProps}
        />
      </Box>

      <TextInput
        data-testid={PhoneNumberInputTestId.NumberInputId}
        ref={numberInputRef}
        name={name}
        pattern="(\d*\s*)*"
        value={rifm.value}
        placeholder={t('placeholder')}
        onChange={rifm.onChange}
      />
    </Flex>
  )
}
