import { FormFieldGenericPropsFC } from '@revolut/rwa-core-components'

import { MaskInput, MaskInputProps } from 'components'

export const USCodeInput: FormFieldGenericPropsFC<MaskInputProps> = ({
  name,
  onChange,
}) => (
  <MaskInput
    label="SSN/ITIN"
    mask="###-##-####"
    onChange={onChange}
    inputProps={{
      autoFocus: true,
      name,
      maskPattern: '999-99-9999',
    }}
  />
)
