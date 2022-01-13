import React from 'react'
import { Input, Media } from '@revolut/ui-kit'
import { useIntl } from 'react-intl'

import { PhoneCodeSelect } from './PhoneCodeSelect'

type Props = {
  value: {
    countryCode: string
    number: string
  }
  countryCodeError: string
  variant: any
  onChange: (value: any) => void
}

export function PhoneInput({
  value,
  variant,
  onChange,
  countryCodeError,
  ...rest
}: Props) {
  const intl = useIntl()

  return (
    <Media>
      <Media.Side width={{ all: '6rem', lg: '6.5rem' }}>
        <PhoneCodeSelect
          value={value.countryCode}
          variant={variant}
          placeholder={intl.formatMessage({
            id: 'labels.code',
            defaultMessage: 'Code',
          })}
          error={countryCodeError}
          onChange={(countryCode: string) =>
            onChange({ ...value, countryCode })
          }
        />
      </Media.Side>
      <Media.Content ml={{ all: 2, lg: '1.5rem' }}>
        <Input
          value={value.number}
          variant={variant}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...value, number: event?.target?.value })
          }
          {...rest}
        />
      </Media.Content>
    </Media>
  )
}
