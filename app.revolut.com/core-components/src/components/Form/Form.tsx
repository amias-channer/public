import { FC } from 'react'

import { FormField } from './FormField'
import { HiddenFormButton } from './styled'
import { FormProps } from './types'
import { filterFormSchema } from './useForm/utils'

export const Form: FC<FormProps> = ({ children, formik, formSchema }) => {
  const { handleSubmit, values, handleChange, handleBlur, touched, errors } = formik

  return (
    <form onSubmit={handleSubmit}>
      {filterFormSchema(formSchema).map(({ Component, props, name }) => {
        return (
          <FormField
            Component={Component}
            key={name}
            name={name}
            value={values[name]}
            isTouched={touched[name]}
            error={errors[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            componentProps={props}
          />
        )
      })}
      {children}
      <HiddenFormButton type="submit" />
    </form>
  )
}
