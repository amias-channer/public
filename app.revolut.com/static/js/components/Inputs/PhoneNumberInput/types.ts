import { PhoneNumberValue } from '@revolut/rwa-core-types'

import { CountryCodeSelectProps } from 'components/CountryCodeSelect/types'

export enum PhoneNumberInputTestId {
  NumberInputId = 'PhoneNumberInput.NumberInput',
}

export type PhoneNumberInputProps = {
  value?: PhoneNumberValue
  countryCodeSelectProps?: CountryCodeSelectProps
}
