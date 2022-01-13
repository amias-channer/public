import { FC } from 'react'
import { Trans } from 'react-i18next'
import { UiKitIconComponentType } from '@revolut/icons'
import { Media, TextBox } from '@revolut/ui-kit'

import { Link } from '@revolut/rwa-core-components'
import { getCardholderTermsUrl, getLegalFeesUrl } from '@revolut/rwa-core-utils'

import { useSignUpTranslation } from '../../hooks'
import { I18N_KEY } from '../constants'

type DisclosureContentItemProps = {
  Icon: UiKitIconComponentType
  sectionKey: string
  countryCode: string
}

export const DisclosureContentItem: FC<DisclosureContentItemProps> = ({
  Icon,
  sectionKey,
  countryCode,
}) => {
  const t = useSignUpTranslation()

  return (
    <Media py={{ _: 'px14', md: 'px16' }}>
      <Media.Side>
        <Icon />
      </Media.Side>
      <Media.Content ml="px16">
        <TextBox fontWeight="bolder">{t(`${I18N_KEY}.${sectionKey}.title`)}</TextBox>
        <TextBox mt="px16" fontSize="smaller" color="default">
          <Trans
            t={t}
            i18nKey={`${I18N_KEY}.${sectionKey}.${countryCode.toLowerCase()}.text`}
            components={{
              feeScheduleLink: <Link href={getLegalFeesUrl(countryCode)} isNewTab />,
              cardHolderLink: <Link href={getCardholderTermsUrl(countryCode)} isNewTab />,
            }}
          />
        </TextBox>
      </Media.Content>
    </Media>
  )
}
