import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Media, Text } from '@revolut/ui-kit'

import {
  PricingPlanFeatureInfo,
  PricingPlansFeatureToggleState,
} from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { FeatureResources } from '../../../hooks/featureResources/types'
import { FeatureItemSkeleton } from './FeatureItemSkeleton'
import { FeatureItemTitle } from './styled'

type FeatureItemProps = {
  feature: PricingPlanFeatureInfo
  featureResources: FeatureResources
}

const checkIsFeatureInactive = (feature: PricingPlanFeatureInfo) =>
  feature.state === PricingPlansFeatureToggleState.Inactive

export const FeatureItem: FC<FeatureItemProps> = ({ feature, featureResources }) => {
  const { t } = useTranslation([I18nNamespace.Common])

  if (!featureResources) {
    return null
  }

  if (featureResources.isLoading) {
    return <FeatureItemSkeleton />
  }

  const isFeatureInactive = checkIsFeatureInactive(feature)

  const FeatureIcon = featureResources.icon

  return (
    <Cell key={featureResources.id}>
      <Media>
        <Media.Side>
          <FeatureIcon size={24} />
        </Media.Side>
        <Media.Content alignSelf="center" ml="s-16">
          <FeatureItemTitle inactive={isFeatureInactive} use="p">
            {featureResources.title}
          </FeatureItemTitle>
          <Text use="p" color="grey-tone-50">
            {isFeatureInactive
              ? t(`${I18nNamespace.Common}:comingSoon`)
              : featureResources.description}
          </Text>
        </Media.Content>
      </Media>
    </Cell>
  )
}
