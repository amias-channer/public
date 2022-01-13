import { FormFieldScheme } from '@revolut/rwa-core-components'

import { PurposeRadioGroup } from './PurposeRadioGroup'

export const formSchema: FormFieldScheme[] = [
  {
    name: 'purpose',
    Component: PurposeRadioGroup,
    initialValue: '',
  },
]
