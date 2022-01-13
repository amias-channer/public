import { FC } from 'react'
import { Redirect } from 'react-router'

import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { Url } from '@revolut/rwa-core-utils'

import { CardDeliveryUpdate } from '../CardDeliveryUpdate'

export const CardDeliveryUpdateRoute: FC = () => {
  const { isFeatureActive } = useFeaturesConfig()
  const isCardUpdateAvailable = isFeatureActive(FeatureKey.AllowCardDeliveryUpdate)

  if (isCardUpdateAvailable) {
    return <CardDeliveryUpdate />
  }

  return <Redirect to={Url.CardsOverview} />
}
