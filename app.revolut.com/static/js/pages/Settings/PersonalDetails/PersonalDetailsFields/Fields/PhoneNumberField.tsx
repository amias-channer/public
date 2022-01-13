import { parsePhoneNumber } from 'libphonenumber-js/min'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { SETTINGS_I18N_NAMESPACE } from '../../../constants'
import { EditableIcon, ActionInput } from './styled'

type PhoneNumberFieldProps = {
  phone: string
  onEdit: VoidFunction
}

export const PhoneNumberField: FC<PhoneNumberFieldProps> = ({ phone, onEdit }) => {
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)

  const formattedPhoneNumber = parsePhoneNumber(phone).formatInternational()

  return (
    <ActionInput
      placeholder={t('PersonalDetails.PhoneNumberField.placeholder')}
      value={formattedPhoneNumber}
      disabled
      renderAction={() => (
        <EditableIcon data-testid="phone-change-icon" onClick={onEdit} />
      )}
    />
  )
}
