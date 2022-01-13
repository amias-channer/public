import { FC, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { object as YupObject } from 'yup'

import {
  AuthLayout,
  Illustration,
  IllustrationAssetId,
  useForm,
} from '@revolut/rwa-core-components'
import {
  formatPhoneNumber,
  phoneValidationSchema,
  Url,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { PhoneNumberInput } from 'components'

import { DownloadTheAppScreen, I18N_NAMESPACE } from '../constants'
import { DownloadTheAppContext } from '../DownloadTheAppProvider'
import { useLinkPhoneToPromotion } from '../hooks'
import { DownloadTheAppScreenProps } from '../types'
import { MobileNumberScreenScheme, MobileNumberScreenValues } from './types'

const validationSchema = YupObject({
  phoneNumber: phoneValidationSchema,
})

export const MobileNumberScreen: FC<DownloadTheAppScreenProps> = ({ onScreenChange }) => {
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()
  const { t } = useTranslation(I18N_NAMESPACE)
  const { phoneNumber, setPhoneNumber } = useContext(DownloadTheAppContext)

  const { linkPhoneToPromotion, isLoading: isLinkPhoneLoading } =
    useLinkPhoneToPromotion()

  const formSchema: MobileNumberScreenScheme = [
    {
      name: 'phoneNumber',
      Component: PhoneNumberInput,
      initialValue: phoneNumber,
    },
  ]

  const handleSubmit = useCallback(
    async (values: MobileNumberScreenValues) => {
      setPhoneNumber(values.phoneNumber)

      const plainPhoneNumber = formatPhoneNumber(values.phoneNumber)

      await linkPhoneToPromotion(
        {
          phone: plainPhoneNumber,
        },
        {
          onSuccess: () => onScreenChange(DownloadTheAppScreen.Success),

          onError: () => navigateToErrorPage('Phone can not be linked to promotion'),
        },
      )
    },
    [navigateToErrorPage, setPhoneNumber, onScreenChange, linkPhoneToPromotion],
  )

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const handleSubmitButtonClick = useCallback<VoidFunction>(() => {
    formik.handleSubmit()
  }, [formik])

  const handleBackButtonClick = useCallback(() => {
    history.push(Url.Start)
  }, [history])

  const isSubmitButtonLoading = isLinkPhoneLoading || formik.isSubmitting
  const isSubmitButtonEnabled =
    !isLinkPhoneLoading && !formik.isSubmitting && !formik.errors.phoneNumber

  return (
    <AuthLayout
      title={t('MobileNumberScreen.title')}
      description={t('MobileNumberScreen.description')}
      illustration={<Illustration assetId={IllustrationAssetId.DownloadTheApp} />}
      submitButtonText={t('MobileNumberScreen.submitButtonText')}
      submitButtonLoading={isSubmitButtonLoading}
      submitButtonEnabled={isSubmitButtonEnabled}
      handleSubmitButtonClick={handleSubmitButtonClick}
      handleBackButtonClick={handleBackButtonClick}
    >
      <FormComponent {...formProps} />
    </AuthLayout>
  )
}
