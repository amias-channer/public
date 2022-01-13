import styled from 'styled-components'
import * as Icons from '@revolut/icons'

import { TextInput } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

export const ActionInput = styled(TextInput)`
  *,
  input:disabled {
    opacity: 1;
  }
`

export const EditableIcon = styled(Icons.Pencil).attrs({
  size: IconSize.Medium,
  color: 'userDetailsEditableFieldIcon',
})`
  cursor: pointer;
`
