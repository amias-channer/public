import { FC } from 'react'
import {
  TextAreaProps as UiKitTextAreaProps,
  TextArea as UiKitTextArea,
} from '@revolut/ui-kit'

import { FormFieldGenericProps } from '@revolut/rwa-core-components'

type TextAreaProps = FormFieldGenericProps & UiKitTextAreaProps

export const TextArea: FC<TextAreaProps> = ({
  error,
  isTouched,
  isErrorShown = true,
  ...rest
}) => (
  <UiKitTextArea
    message={isTouched && isErrorShown ? error : ''}
    hasError={isErrorShown && Boolean(error)}
    {...rest}
  />
)
