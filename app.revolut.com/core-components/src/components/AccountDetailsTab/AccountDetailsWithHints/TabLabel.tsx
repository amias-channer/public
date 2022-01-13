import { FC } from 'react'

import { FormattedMessage } from '../../FormattedMessage'
import { AccountDetailsType } from '../types'

type TabLabelProps = {
  type: AccountDetailsType
}

export const TabLabel: FC<TabLabelProps> = ({ type }) => {
  if (type === AccountDetailsType.Swift) {
    return (
      <FormattedMessage
        namespace="components.AccountDetails"
        id="label.swift"
        defaultMessage="Swift"
      />
    )
  }

  return (
    <FormattedMessage
      namespace="components.AccountDetails"
      id="label.local"
      defaultMessage="Local"
    />
  )
}
