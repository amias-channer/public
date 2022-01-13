import pick from 'lodash/pick'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AuthLayout,
  H2,
  Illustration,
  IllustrationAssetId,
  Paragraph,
  TextBox,
} from '@revolut/rwa-core-components'
import { COUNTRIES } from '@revolut/rwa-core-utils'
import { SignOutCause, signOutWithRedirect } from '@revolut/rwa-core-auth'
import { useCountryTranslations } from '@revolut/rwa-core-i18n'

type UnsupportedCountryScreenProps = {
  countryCode: string
}

export const UnsupportedCountryScreen: FC<UnsupportedCountryScreenProps> = ({
  countryCode,
}) => {
  const { t } = useTranslation(['pages.SignUp', 'common'])
  const getCountryTranslation = useCountryTranslations()

  const country = pick(COUNTRIES, [countryCode])[countryCode]

  const countryName = getCountryTranslation({
    countryCode: country.id,
    countryName: country.name,
  })

  const handleSubmitButtonClick = () => {
    signOutWithRedirect(SignOutCause.User)
  }

  return (
    <AuthLayout
      centerContent
      illustration={<Illustration assetId={IllustrationAssetId.UnsupportedCountry} />}
      submitButtonText={t('common:logout')}
      submitButtonEnabled
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <H2>
        {t('HomeAddressScreen.UnsupportedCountryScreen.title', {
          country: countryName,
        })}
      </H2>
      <Paragraph>
        <TextBox>{t('HomeAddressScreen.UnsupportedCountryScreen.description')}</TextBox>
      </Paragraph>
    </AuthLayout>
  )
}
