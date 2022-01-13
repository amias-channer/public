import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TabBar } from '@revolut/ui-kit'
import { FeatureKey } from '@revolut/rwa-core-config'

import { useFeaturesConfig } from 'hooks'

import { I18N_NAMESPACE } from '../constants'

export enum HomeTab {
  Accounts = 'accounts',
  Cards = 'cards',
  Crypto = 'crypto',
  Stocks = 'stocks',
  Vaults = 'vaults',
}

type TabsProps = {
  activeTab: HomeTab
  onChange: (tab: HomeTab) => void
}

export const Tabs = ({ activeTab, onChange }: TabsProps) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { isFeatureActive } = useFeaturesConfig()

  const tabs = useMemo(
    () =>
      [
        { id: HomeTab.Accounts, title: t('accounts'), isAvailable: true },
        {
          id: HomeTab.Cards,
          title: t('cards'),
          isAvailable: true,
        },
        {
          id: HomeTab.Stocks,
          title: t('stocks'),
          isAvailable: isFeatureActive(FeatureKey.Stocks),
        },
        {
          id: HomeTab.Crypto,
          title: t('crypto'),
          isAvailable: isFeatureActive(FeatureKey.Crypto),
        },
        {
          id: HomeTab.Vaults,
          title: t('vaults'),
          isAvailable: isFeatureActive(FeatureKey.Vaults),
        },
      ].filter((tab) => tab.isAvailable),
    [isFeatureActive, t],
  )

  if (tabs.length < 2) {
    return null
  }

  return (
    <TabBar variant="navigation">
      {tabs.map(({ id, title }) => (
        <TabBar.Item
          key={id}
          use="button"
          onClick={() => onChange(id)}
          aria-selected={id === activeTab}
        >
          {title}
        </TabBar.Item>
      ))}
    </TabBar>
  )
}
