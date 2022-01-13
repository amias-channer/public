import parse from 'date-fns/parse'
import { useTranslation } from 'react-i18next'

import { FormFieldGenericPropsFC } from '@revolut/rwa-core-components'
import { DateFormat } from '@revolut/rwa-core-utils'

import { MaskInput } from 'components'

export const INPUT_MASK = DateFormat.InputMask

export const BirthDateInput: FormFieldGenericPropsFC = ({ name, onChange }) => {
  const { t } = useTranslation('pages.SignUp')

  const handleMaskInputChange = (inputValue: string) => {
    onChange(parse(inputValue, INPUT_MASK, new Date()))
  }

  return (
    <MaskInput
      label={t('BirthDateScreen.title')}
      mask={INPUT_MASK.toUpperCase()}
      onChange={handleMaskInputChange}
      inputProps={{
        autoFocus: true,
        name,
        maskPattern: '99/99/9999',
      }}
    />
  )
}
