import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { TextInput } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

import { SETTINGS_I18N_NAMESPACE } from '../../../constants'
import { ActionInput } from './styled'

type EmailFieldProps = {
  email: string
  isVerified: boolean
}

export const EmailField: FC<EmailFieldProps> = ({ email, isVerified }) => {
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)

  const defaultProps = {
    placeholder: t('PersonalDetails.EmailField.placeholder'),
    value: email,
    disabled: true,
  }

  if (isVerified) {
    return <TextInput {...defaultProps} />
  }

  return (
    <ActionInput
      {...defaultProps}
      hasError={!isVerified}
      message={t('PersonalDetails.EmailField.errorMessage')}
      renderAction={() => (
        <Icons.InfoOutline size={IconSize.Medium} color="userDetailsWarningIcon" />
      )}
    />
  )
}
