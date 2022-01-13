import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Tile, Box, Text, Button, IconButton } from '@revolut/ui-kit'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { trackEvent, RewardTrackingEvent } from '@revolut/rwa-core-analytics'
import {
  defaultStorage,
  openUrlInNewTab,
  DefaultStorageKey,
} from '@revolut/rwa-core-utils'

export const SHOPPER_BANNER_TEST_ID = 'ShopperBannerTestId'

type ShopperBannerProps = {
  onAddToChrome(): void
  onClose(): void
}

const ShopperBanner: FC<ShopperBannerProps> = ({
  onAddToChrome,
  onClose,
}: ShopperBannerProps) => {
  const { t } = useTranslation('pages.Accounts')

  return (
    <Box mt="s-32" mb="s-8">
      <Tile bg="blue" image="/assets/banners/shopper.png" onClick={onAddToChrome}>
        <Tile.Action>
          <IconButton
            useIcon={Icons.Cross}
            onClick={(event) => {
              event.stopPropagation()
              onClose()
            }}
          />
        </Tile.Action>
        <Tile.Title fontSize="36px">{t('ShopperBanner.title')}</Tile.Title>
        <Tile.Footer
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Text fontSize="12px">{t('ShopperBanner.subTitle')}</Text>
          <Button size="sm" variant="white" onClick={onAddToChrome}>
            {t('ShopperBanner.action')}
          </Button>
        </Tile.Footer>
      </Tile>
    </Box>
  )
}

export const ShopperBannerContainer: FC = () => {
  const [isOpen, setIsOpen] = useState(
    !defaultStorage.getItem(DefaultStorageKey.ShopperBannerIsClosed),
  )

  const close = () => {
    setIsOpen(false)
    defaultStorage.setItem(DefaultStorageKey.ShopperBannerIsClosed, true)
  }

  const addToChrome = () => {
    trackEvent(RewardTrackingEvent.shopperBannerAddToChromeButtonClicked)
    // shopperBannerCloseButtonClicked
    openUrlInNewTab(getConfigValue(ConfigKey.ShopperStoreUrl))
  }

  return (
    <>
      {isOpen && (
        <ShopperBanner
          data-testid={SHOPPER_BANNER_TEST_ID}
          onAddToChrome={addToChrome}
          onClose={close}
        />
      )}
    </>
  )
}
