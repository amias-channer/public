import { FC, Fragment } from 'react'

import { FormField } from '../Form'
import { Spacer } from '../Spacer'
import { HiddenFormButton } from '../styled'

import { AddressFormProps } from './types'

export const AddressForm: FC<AddressFormProps> = ({
  formSchema,
  formValues,
  formFieldComponentProps,
  handleFieldChange,
  handleFormSubmit,
}) => (
  <form onSubmit={handleFormSubmit}>
    {formSchema.map(
      (field, index) =>
        field.isRendered && (
          <Fragment key={field.name}>
            {index !== 0 && <Spacer h="16px" />}
            <FormField
              name={field.name}
              Component={field.Component}
              value={formValues[field.name]}
              componentProps={formFieldComponentProps[field.name]}
              onChange={handleFieldChange}
            />
          </Fragment>
        ),
    )}
    <HiddenFormButton />
  </form>
)
