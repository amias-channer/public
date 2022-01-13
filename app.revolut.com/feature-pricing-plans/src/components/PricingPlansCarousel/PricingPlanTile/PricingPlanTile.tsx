import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { H1, Status, Tile } from '@revolut/ui-kit'

import { PricingPlanCode } from '@revolut/rwa-core-types'
import { getAsset, I18nNamespace } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../../constants'
import { TileAssetOverlay, TileTitle } from './styled'

type PricingPlanTileProps = {
  pricingPlanCode: PricingPlanCode
}

export const PricingPlanTile: FC<PricingPlanTileProps> = ({ pricingPlanCode }) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])

  const planCodeLowerCased = pricingPlanCode.toLowerCase()

  return (
    <Tile
      image={getAsset(`pricing_plans/covers/${planCodeLowerCased}.png`)}
      video={[
        {
          type: 'video/mp4',
          src: getAsset(`pricing_plans/videos/${planCodeLowerCased}.mp4`),
        },
        {
          type: 'video/webm',
          src: getAsset(`pricing_plans/videos/${planCodeLowerCased}.webm`),
        },
      ]}
    >
      {/* TODO: remove when video will have dark overflow in ui-kit */}
      <TileAssetOverlay />
      <TileTitle>{t(`tiles.${planCodeLowerCased}.title`)}</TileTitle>
      <Tile.Footer color="foreground">
        <H1>{t(`common:plans.${planCodeLowerCased}.name`)}</H1>
        {pricingPlanCode === PricingPlanCode.Premium && (
          <Status color="pink" useIcon={Icons.Lightning}>
            {t('common:label.popular')}
          </Status>
        )}
      </Tile.Footer>
    </Tile>
  )
}
