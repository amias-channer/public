import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { FeatureKey } from '@revolut/rwa-core-config'
import { Url } from '@revolut/rwa-core-utils'

import { useFeaturesConfig } from '../../hooks'
import { TRANSLATION_NAMESPACE } from '../Sidebar/constants'

type MenuItem = {
  id: string
  icon: Icons.IconComponentType
  text: string
  route: { pathname: Url }
  shown?: Boolean
}

const checkIfItemShouldBeShown = (item: MenuItem) => item.shown !== false

export const useMainMenuItems = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE)
  const { isFeatureActive } = useFeaturesConfig()

  return useMemo<MenuItem[]>(
    () =>
      [
        {
          id: 'home',
          icon: Icons.Coins,
          text: t('menuItems.home'),
          route: { pathname: Url.Home },
        },
        {
          id: 'payments',
          icon: Icons.ArrowsPayments,
          text: t('menuItems.payments'),
          route: { pathname: Url.Payments },
          shown: isFeatureActive(FeatureKey.AllowPayments),
        },
        {
          id: 'rewards',
          icon: Icons.Present,
          text: t('menuItems.rewards'),
          route: { pathname: Url.RewardsHome },
          shown: isFeatureActive(FeatureKey.Rewards),
        },
        {
          id: 'travel',
          icon: Icons.Resort,
          text: t('menuItems.travel'),
          route: { pathname: Url.TravelHome },
          shown: isFeatureActive(FeatureKey.TravelBooking),
        },
        {
          id: 'help',
          icon: Icons.HelpChatOutline,
          text: t('menuItems.getHelp'),
          route: { pathname: Url.Help },
        },
      ].filter(checkIfItemShouldBeShown),

    [isFeatureActive, t],
  )
}
