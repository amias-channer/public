import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Absolute, TextBox } from '@revolut/ui-kit'

import { Link, Spacer } from '@revolut/rwa-core-components'
import { getPrivacyPolicyUrl, getWebsiteTermsUrl } from '@revolut/rwa-core-utils'

type StatutoryProps = {
  countryCode: string
}

export const SignUpStatutory: FC<StatutoryProps> = ({ countryCode }) => {
  const { t } = useTranslation('pages.SignUp')

  return (
    <>
      <Spacer h={{ _: 'px40', md: 'px84' }} />
      <Absolute
        bottom={{
          _: 'px88',
          md: 'px120',
        }}
      >
        <TextBox
          fontSize="note"
          color="default"
          maxWidth={{
            _: '100%',
            md: 'pages.SignUp.HomeAddressScreen.Statutory.maxWidth.md',
          }}
        >
          <Trans
            t={t}
            i18nKey="HomeAddressScreen.statutory"
            components={{
              privacyPolicyLink: (
                <Link href={getPrivacyPolicyUrl(countryCode)} isNewTab />
              ),
              termsLink: <Link href={getWebsiteTermsUrl(countryCode)} isNewTab />,
            }}
          />
        </TextBox>
      </Absolute>
    </>
  )
}
