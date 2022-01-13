import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { TextInput } from '@revolut/rwa-core-components'
import { User } from '@revolut/rwa-core-types'

import { getFullName } from 'utils'

import { SETTINGS_I18N_NAMESPACE } from '../../../constants'

type UserNameFieldProps = {
  userData: User
}

export const UserNameField: FC<UserNameFieldProps> = ({ userData }) => {
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)

  const userFullName = getFullName(userData)

  return (
    <TextInput
      placeholder={t('PersonalDetails.UserNameField.placeholder')}
      value={userFullName}
      disabled
    />
  )
}
