import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Tile, IconButton } from '@revolut/ui-kit'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { trackEvent, RewardTrackingEvent } from '@revolut/rwa-core-analytics'
import { getAsset, openUrlInNewTab } from '@revolut/rwa-core-utils'
import styled from 'styled-components'

type Props = {
  onClose(): void
}

const StyledTile = styled(Tile)`
  cursor: pointer;
`

export const ShopperTile = ({ onClose }: Props) => {
  const { t } = useTranslation('pages.Accounts')

  const addToChrome = () => {
    trackEvent(RewardTrackingEvent.shopperBannerAddToChromeButtonClicked)
    openUrlInNewTab(getConfigValue(ConfigKey.ShopperStoreUrl))
  }

  return (
    <StyledTile
      onClick={addToChrome}
      variant="small"
      bg="deep-purple"
      video={[
        {
          type: 'video/mp4',
          src: getAsset('home/tiles/shopper.mp4'),
        },
      ]}
    >
      <Tile.Action>
        <IconButton
          aria-label="Close shopper suggestion"
          useIcon={Icons.Cross}
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
        />
      </Tile.Action>
      <Tile.Title>{t('Suggestions.shopper')}</Tile.Title>
    </StyledTile>
  )
}
