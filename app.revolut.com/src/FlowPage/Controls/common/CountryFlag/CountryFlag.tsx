import React from 'react'
import { Avatar } from '@revolut/ui-kit'

type Props = {
  countryCode: string
} & Omit<React.ComponentProps<typeof Avatar>, 'image'>

const CountryFlag = ({ countryCode, ...props }: Props) => (
  <Avatar
    data-testid={`country-flag-${countryCode}`}
    bg="white"
    progressColor="white"
    image={`https://assets.revolut.com/business/flags/${countryCode}.svg`}
    {...props}
  />
)

export default CountryFlag
