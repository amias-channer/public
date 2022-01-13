import { useCallback, Ref } from 'react'

import { FormFieldGenericPropsFC } from './useForm'

type FormFieldProps = {
  innerRef?: Ref<any>
  Component: FormFieldGenericPropsFC<any>
  componentProps?: any
}

export const FormField: FormFieldGenericPropsFC<FormFieldProps> = ({
  innerRef,
  name,
  Component,
  componentProps,
  onChange,
  ...rest
}) => {
  const handleChange = useCallback(
    (e: any) => {
      onChange({ target: { value: e.target ? e.target.value : e, name } })
    },
    [name, onChange],
  )

  return (
    <Component
      {...componentProps}
      {...rest}
      ref={innerRef}
      name={name}
      onChange={handleChange}
    />
  )
}
