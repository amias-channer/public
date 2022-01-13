import { FC } from 'react'
import { Trans } from 'react-i18next'
import { Box, TextBox } from '@revolut/ui-kit'

import { Link, Spacer } from '@revolut/rwa-core-components'
import {
  getCardholderTermsUrl,
  getPrivacyPolicyUrl,
  isCountryCA,
} from '@revolut/rwa-core-utils'

import { useSignUpTranslation } from '../../hooks'
import { DisclosureContentItem } from './DisclosureContentItem'
import { countryDisclosureItems } from './disclosureItems'

type DisclosureScreenContentProps = {
  countryCode: string
}

export const DisclosureScreenContent: FC<DisclosureScreenContentProps> = ({
  countryCode,
}) => {
  const t = useSignUpTranslation()

  return (
    <Box>
      {countryDisclosureItems[countryCode]?.map((disclosureItem) => (
        <DisclosureContentItem
          key={disclosureItem.sectionKey}
          {...disclosureItem}
          countryCode={countryCode}
        />
      ))}
      {isCountryCA(countryCode) && (
        <>
          <Spacer h={{ md: 'px16' }} />
          <TextBox fontSize="note" color="trademark">
            {t('DisclosureScreen.ca.trademark')}
          </TextBox>
        </>
      )}
      <Spacer h={{ _: 'px32', md: 'px48' }} />
      <TextBox fontSize="note" color="default">
        <Trans
          t={t}
          i18nKey="DisclosureScreen.note"
          components={{
            privacyPolicyLink: <Link href={getPrivacyPolicyUrl(countryCode)} isNewTab />,
            cardHolderLink: <Link href={getCardholderTermsUrl(countryCode)} isNewTab />,
          }}
        />
      </TextBox>
      <Spacer h={{ _: 'px16', md: 'px32' }} />
    </Box>
  )
}
