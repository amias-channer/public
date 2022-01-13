import { FormFieldGenericPropsFC } from '../../Form'
import { TextInputProps } from '../../Inputs'

import { TextInputStyled } from './styled'

export const FormTextInput: FormFieldGenericPropsFC<TextInputProps> = ({
  error,
  isTouched,
  isErrorShown = true,
  ...rest
}) => (
  <TextInputStyled
    error={isTouched && isErrorShown ? error : ''}
    hasError={isErrorShown && Boolean(error)}
    {...rest}
  />
)
