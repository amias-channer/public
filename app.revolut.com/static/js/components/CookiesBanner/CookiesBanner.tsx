import { isNull } from 'lodash'
import { FC, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextButton } from '@revolut/ui-kit'

import { Link, useModal } from '@revolut/rwa-core-components'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { defaultStorage, DefaultStorageKey } from '@revolut/rwa-core-utils'

import { CookiesManagementModal } from '../Modals'
import { CookiesBannerContext } from './CookiesBannerProvider'
import {
  CookieBannerOuter,
  CookieBannerInner,
  AcceptPolicyButton,
  PolicyTextWrapper,
  ButtonsWrapper,
} from './styled'

export const COOKIES_BANNER_TEST_ID = 'CookiesBannerTestId'

// In case if user closes Cookies Banner there is no possibility to open management popup again.
// It was decided to hide the popup at all until the decision where else a button to open
// the popup should be is not made.
// https://revolut.atlassian.net/browse/RWA-647
const TurnOnManagementModal = false

export const CookiesBanner: FC = () => {
  const { t } = useTranslation('components.CookiesBanner')
  const [showModal, generalModalProps] = useModal()

  const [isShowBanner, setIsShowBanner] = useState(
    isNull(defaultStorage.getItem(DefaultStorageKey.CookiesBannerIsClosed)),
  )

  const { isHidden } = useContext(CookiesBannerContext)

  const onManageCookiesClick = () => {
    showModal()
  }

  const onAcceptClick = () => {
    defaultStorage.setItem(DefaultStorageKey.CookiesBannerIsClosed, true)
    setIsShowBanner(false)
  }

  if (!isShowBanner) {
    return null
  }

  return (
    <>
      {!isHidden && (
        <CookieBannerOuter data-testid={COOKIES_BANNER_TEST_ID}>
          <CookieBannerInner>
            <PolicyTextWrapper>
              {t('policyText', {
                emoji: ' 🍪',
              })}{' '}
              <Link href={getConfigValue(ConfigKey.CookiesPolicyLink)}>
                {t('cookiesLinkTitle')}
              </Link>
            </PolicyTextWrapper>
            <ButtonsWrapper>
              {TurnOnManagementModal && (
                <TextButton
                  fontSize="cookiesBanner"
                  variant="grey-50"
                  onClick={onManageCookiesClick}
                >
                  {t('preferencesButton')}
                </TextButton>
              )}
              <AcceptPolicyButton onClick={onAcceptClick}>
                {t('acceptButton')}
              </AcceptPolicyButton>
            </ButtonsWrapper>
          </CookieBannerInner>
        </CookieBannerOuter>
      )}
      <CookiesManagementModal {...generalModalProps} />
    </>
  )
}
