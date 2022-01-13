import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CardSelectIcon,
  CardSelectOption,
  ChatIcon,
  EmailIcon,
} from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../constants'
import { AuthenticationMethod } from './constants'

export const useOptions = () => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return useMemo(
    (): ReadonlyArray<CardSelectOption> => [
      {
        label: t('AuthenticationMethodScreen.options.sms'),
        value: AuthenticationMethod.Sms,
        icon: <CardSelectIcon Icon={ChatIcon} />,
      },
      {
        label: t('AuthenticationMethodScreen.options.email'),
        value: AuthenticationMethod.Email,
        icon: <CardSelectIcon Icon={EmailIcon} />,
      },
    ],
    [t],
  )
}
