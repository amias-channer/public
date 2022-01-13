import { FormikHelpers } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { object as YupObject } from 'yup'

import { useAuthContext, VerificationSteps } from '@revolut/rwa-core-auth'
import {
  AuthLayout,
  Illustration,
  IllustrationAssetId,
  useForm,
} from '@revolut/rwa-core-components'
import {
  formatPhoneNumber,
  I18nNamespace,
  phoneValidationSchema,
} from '@revolut/rwa-core-utils'

import { PhoneNumberInput } from 'components'

import { SETTINGS_I18N_NAMESPACE } from '../../constants'
import { ChangePhoneNumberContext } from '../ChangePhoneNumberProvider'
import { useInitiatePhoneChange } from '../hooks'
import { ChangePhoneNumberScreenComponent } from '../types'
import { FieldName } from './constants'
import { NewPhoneNumberScreenScheme, NewPhoneNumberScreenValues } from './types'

const validationSchema = YupObject({
  [FieldName.PhoneNumber]: phoneValidationSchema,
})

const formSchema: NewPhoneNumberScreenScheme = [
  {
    name: FieldName.PhoneNumber,
    Component: PhoneNumberInput,
    initialValue: { code: '', number: '' },
  },
]

export const NewPhoneNumberScreen: ChangePhoneNumberScreenComponent = ({
  onBackButtonClick,
  onConfirm,
}) => {
  const { t } = useTranslation([SETTINGS_I18N_NAMESPACE, I18nNamespace.Common])
  const { user } = useAuthContext()
  const [phone, setPhone] = useState('')
  const { setNewPhone } = useContext(ChangePhoneNumberContext)

  const handleFlowInitiatedSuccessfully = () => {
    setNewPhone(phone)
    onConfirm()
  }

  const { isLoading, verificationStepsProps, initiatePhoneChange } =
    useInitiatePhoneChange(phone, handleFlowInitiatedSuccessfully)

  const handlePhoneNumberSubmit = (
    values: NewPhoneNumberScreenValues,
    formikHelpers: FormikHelpers<any>,
  ) => {
    const formattedPhoneNumber = formatPhoneNumber(values[FieldName.PhoneNumber])

    setPhone(formattedPhoneNumber)
    initiatePhoneChange(formattedPhoneNumber)
    formikHelpers.setSubmitting(false)
  }

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit: handlePhoneNumberSubmit,
  })

  useEffect(() => {
    if (user) {
      formik.setFieldValue(FieldName.PhoneNumber, {
        code: user.address.country,
        number: '',
      })
    }
  }, [formik, user])

  const isSubmitButtonLoading = formik.isSubmitting || isLoading
  const isSubmitButtonEnabled =
    !formik.isSubmitting &&
    !formik.errors[FieldName.PhoneNumber] &&
    !isLoading &&
    formik.values[FieldName.PhoneNumber].code &&
    formik.values[FieldName.PhoneNumber].number

  return (
    <>
      <AuthLayout
        title={t('ChangePhoneNumber.NewPhoneNumberScreen.title')}
        illustration={<Illustration assetId={IllustrationAssetId.Phone} />}
        handleBackButtonClick={onBackButtonClick}
        submitButtonText={t('common:continue')}
        submitButtonLoading={isSubmitButtonLoading}
        submitButtonEnabled={isSubmitButtonEnabled}
        handleSubmitButtonClick={formik.handleSubmit}
      >
        <FormComponent {...formProps} />
      </AuthLayout>
      <VerificationSteps {...verificationStepsProps} />
    </>
  )
}
