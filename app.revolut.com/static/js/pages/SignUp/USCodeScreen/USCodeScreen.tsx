import { useCallback } from 'react'
import { object as YupObject } from 'yup'

import { AuthLayout, useForm } from '@revolut/rwa-core-components'
import { usCodeValidationSchema } from '@revolut/rwa-core-utils'

import { useRunAuthFlowElements, useSignUpTranslation } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { formSchema } from './form'

const validationSchema = YupObject({
  usCode: usCodeValidationSchema,
})

const isITIN = (usCode: string) => usCode[0] === '9' && usCode[3] === '7'

export const USCodeScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const t = useSignUpTranslation()
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()

  const handleSubmit = useCallback(
    async (values) => {
      const formattedUSCode = values.usCode.replace(/-/g, '')

      await runAuthFlowElements(
        {
          identityDetails: {
            identificationNumbers: [
              {
                country: 'US',
                name: isITIN(formattedUSCode) ? 'itin' : 'ssn',
                value: formattedUSCode,
              },
            ],
          },
        },
        {
          onSuccess: ({ data }) => {
            goToNextScreen(getUserAuthFlowElement(data))
          },
        },
      )
    },
    [goToNextScreen, runAuthFlowElements],
  )

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const handleSubmitButtonClick = useCallback<VoidFunction>(() => {
    formik.handleSubmit()
  }, [formik])

  const isButtonEnabled = formik.values.usCode && !formik.errors.usCode

  return (
    <AuthLayout
      title={t('USCodeScreen.title')}
      description={t('USCodeScreen.description')}
      submitButtonEnabled={isButtonEnabled}
      submitButtonLoading={isLoading}
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <FormComponent {...formProps} />
    </AuthLayout>
  )
}
