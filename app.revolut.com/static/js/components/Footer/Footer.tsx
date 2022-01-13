import { i18n as I18nInterface } from 'i18next'
import { Trans, useTranslation } from 'react-i18next'
import { TextBox } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import {
  I18nNamespace,
  getCardholderTermsUrl,
  getFinServGuideUrl,
  getPdsLinkUrl,
  getPrivacyPolicyUrl,
} from '@revolut/rwa-core-utils'

import {
  DEFAULT_COUNTRY_CODE,
  FOOTER_I18N_NAMESPACE,
  FORMAL_COMPLAINTS_EMAIL,
  SG_FOOTER_DPO_EMAIL,
  SG_STATUTORY_LINK,
} from './constants'
import { FooterLinkText, StyledFooter } from './styled'
import { WebsiteTermsLink } from './WebsiteTermsLink'

const getKeyForCountryCode = ({
  i18n,
  key,
  countryCodeLowerCased,
}: {
  i18n: I18nInterface
  key: string
  countryCodeLowerCased: string
}) => {
  const keyWithCountryCode = `${key}.${countryCodeLowerCased}`

  if (i18n.exists(`${FOOTER_I18N_NAMESPACE}:${keyWithCountryCode}`)) {
    return keyWithCountryCode
  }

  return `${key}.${DEFAULT_COUNTRY_CODE.toLowerCase()}`
}

export const Footer = () => {
  const { i18n, t } = useTranslation([FOOTER_I18N_NAMESPACE, I18nNamespace.Domain])
  const { user } = useAuthContext()

  const countryCode = user?.address?.country || DEFAULT_COUNTRY_CODE

  const privacyPolicyLink = getPrivacyPolicyUrl(countryCode)

  const countryCodeLowerCased = countryCode.toLowerCase()

  const copyrightKey = getKeyForCountryCode({
    i18n,
    key: 'copyright',
    countryCodeLowerCased,
  })

  const statutoryKey = getKeyForCountryCode({
    i18n,
    key: 'statutory',
    countryCodeLowerCased,
  })

  return (
    <StyledFooter>
      <TextBox mb="px16" variant="caption">
        {t(copyrightKey, {
          year: new Date().getFullYear(),
        })}{' '}
        | <WebsiteTermsLink countryCode={countryCode} /> |{' '}
        <FooterLinkText href={privacyPolicyLink} isNewTab>
          {t('privacyPolicy')}
        </FooterLinkText>
      </TextBox>
      <TextBox variant="caption">
        <Trans
          t={t}
          i18nKey={statutoryKey}
          values={{
            cardholderTermsLinkText: t('domain:footer-cardholderTerms'),
            sgExternalLinkText: t('domain:cta-here'),
            sgDpoEmailText: SG_FOOTER_DPO_EMAIL,
            formalComplaintsEmailText: FORMAL_COMPLAINTS_EMAIL,
            pdsText: 'Product Disclosure Statement',
            finServicesGuideText: 'Financial Services Guide',
          }}
          components={{
            cardholderTermsLink: (
              <FooterLinkText href={getCardholderTermsUrl(countryCode)} isNewTab />
            ),
            externalLink: <FooterLinkText href={SG_STATUTORY_LINK} isNewTab />,
            sgDpoEmail: <FooterLinkText href={`mailto:${SG_FOOTER_DPO_EMAIL}`} />,
            formalComplaintsEmail: (
              <FooterLinkText href={`mailto:${FORMAL_COMPLAINTS_EMAIL}`} />
            ),
            pdsLink: <FooterLinkText href={getPdsLinkUrl(countryCode)} isNewTab />,
            finServicesGuideLink: (
              <FooterLinkText href={getFinServGuideUrl(countryCode)} isNewTab />
            ),
          }}
        />
      </TextBox>
    </StyledFooter>
  )
}
