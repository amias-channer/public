import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TextArea } from '@revolut/ui-kit'

import { AddressDto } from '@revolut/rwa-core-types'
import { useCountryTranslations } from '@revolut/rwa-core-i18n'

import { SETTINGS_I18N_NAMESPACE } from '../../../constants'
import { getUserFullAddress } from '../utils'

type AddressFieldProps = {
  address: AddressDto
}

export const AddressField: FC<AddressFieldProps> = ({ address }) => {
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)

  const getCountryTranslation = useCountryTranslations()

  const fullAddress = getUserFullAddress(address, getCountryTranslation)

  return (
    <TextArea
      placeholder={t('PersonalDetails.AddressField.placeholder')}
      value={fullAddress}
      disabled
    />
  )
}
