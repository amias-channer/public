import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { TextInput } from '@revolut/rwa-core-components'
import {
  getCurrentLocale,
  getLocaleMonthFromNumber,
  normalizeLocale,
} from '@revolut/rwa-core-utils'

import { SETTINGS_I18N_NAMESPACE } from '../../../constants'

type BirthDateFieldProps = {
  birthDate: number[]
}

export const BirthDateField: FC<BirthDateFieldProps> = ({ birthDate }) => {
  const { t, i18n } = useTranslation(SETTINGS_I18N_NAMESPACE)

  const [birthYear, birthMonth, birthDay] = birthDate

  const currentLocale = normalizeLocale(i18n.language) || getCurrentLocale()

  const formattedBirthDate = `${birthDay} ${getLocaleMonthFromNumber(
    birthMonth,
    currentLocale,
  )} ${birthYear}`

  return (
    <TextInput
      placeholder={t('PersonalDetails.BirthDateField.placeholder')}
      value={formattedBirthDate}
      disabled
    />
  )
}
