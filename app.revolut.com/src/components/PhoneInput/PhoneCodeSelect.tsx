import React from 'react'
import * as R from 'ramda'
import { InputSelect, Media } from '@revolut/ui-kit'

import countries from '../../helpers/countries'

const PHONE_CODES_OPTIONS = R.pipe(
  R.values,
  R.filter((value: any) => value.phoneCode.trim() !== ''),
  R.map((value: any) => ({
    value: value.countryCode,
    title: value.country,
    label: `+${value.phoneCode}`,
  })),
  // @ts-ignore
  R.sort(R.ascend(R.prop('name')))
)(countries)

const renderPhoneCodeOption = (select: any) =>
  select
    .matchOptions(PHONE_CODES_OPTIONS, { keys: ['title', 'label'] })
    .map((item: any) => (
      <InputSelect.Option
        key={item.title}
        {...select.getOptionProps(item)}
        style={{ padding: '1.5rem 1rem' }}
      >
        <Media>
          <Media.Content>{item.title}</Media.Content>
          <Media.Side ml={1} color='grey-50'>
            {item.label}
          </Media.Side>
        </Media>
      </InputSelect.Option>
    ))

export const PhoneCodeSelect = (props: any) => (
  <InputSelect
    options={PHONE_CODES_OPTIONS}
    dropdown={{
      fitInAnchor: false,
      maxWidth: '100%',
      width: '20rem',
      zIndex: 100,
      positionFixed: true,
    }}
    {...props}
  >
    {renderPhoneCodeOption}
  </InputSelect>
)

PhoneCodeSelect.defaultProps = {
  defaultValue: 'GB',
}
