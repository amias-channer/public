import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Flex, Media, TextBox, TextButton } from '@revolut/ui-kit'

import { browser, defaultStorage, DefaultStorageKey, Url } from '@revolut/rwa-core-utils'

import { RevolutAppIcon } from '../Icons'
import { ContainerStyled } from './styled'

export enum MobileAppBannerTestId {
  CloseIcon = 'MobileAppBannerTestId.CloseIcon',
}

export const MobileAppBanner: FC = () => {
  const { t } = useTranslation('components.MobileAppBanner')

  const [isShown, setIsShown] = useState(
    browser.isMobile() &&
      !defaultStorage.getItem(DefaultStorageKey.MobileAppBannerIsClosed),
  )

  const handleCloseBannerClick = () => {
    defaultStorage.setItem(DefaultStorageKey.MobileAppBannerIsClosed, true)

    setIsShown(false)
  }

  const handleAppLinkClick = () => {
    browser.navigateTo(Url.GetTheApp)
  }

  if (!isShown) {
    return null
  }

  return (
    <ContainerStyled>
      <TextButton
        data-testid={MobileAppBannerTestId.CloseIcon}
        ml="px8"
        mr="px8"
        onClick={handleCloseBannerClick}
      >
        <Media>
          <Icons.CrossSmall color="textInactive" />
        </Media>
      </TextButton>

      <RevolutAppIcon />

      <Flex ml="px16" flexDirection="column" flex="1">
        <TextBox fontWeight="bolder">{t('title')}</TextBox>
        <TextBox fontSize="smaller" color="textInactive">
          {t('description')}
        </TextBox>
      </Flex>

      <TextBox mr="px16" fontWeight="bolder">
        <TextButton onClick={handleAppLinkClick}>{t('appLinkTitle')}</TextButton>
      </TextBox>
    </ContainerStyled>
  )
}
