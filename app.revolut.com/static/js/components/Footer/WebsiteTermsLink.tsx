import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { getWebsiteTermsUrl } from '@revolut/rwa-core-utils'

import { FOOTER_I18N_NAMESPACE } from './constants'
import { FooterLinkText } from './styled'

type WebsiteTermsLinkProps = {
  countryCode: string
}

const getWebsiteTermsKeyForCountryCode = (countryCode: string) => {
  if (countryCode === 'US') {
    return 'terms'
  }

  return 'websiteTerms'
}

export const WebsiteTermsLink: FC<WebsiteTermsLinkProps> = ({ countryCode }) => {
  const { t } = useTranslation(FOOTER_I18N_NAMESPACE)

  const websiteTermsLink = getWebsiteTermsUrl(countryCode)

  return (
    <FooterLinkText href={websiteTermsLink} isNewTab>
      {t(getWebsiteTermsKeyForCountryCode(countryCode))}
    </FooterLinkText>
  )
}
