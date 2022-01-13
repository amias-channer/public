import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Collapsible, Group, Media, Text } from '@revolut/ui-kit'

import { PricingPlansFeatureGroupDto, PricingPlanDto } from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../../constants'
import { useGetFeatureResources } from '../../../hooks'
import { FeatureItem } from '../FeatureItem'
import { FeatureGroupName } from './styled'
import { filterFeatures, mapFeatureGroupFeaturesToState } from './utils'

type FeatureGroupProps = {
  pricingPlan: PricingPlanDto
  featureGroup: PricingPlansFeatureGroupDto
}

export const FeatureGroup: FC<FeatureGroupProps> = ({ featureGroup, pricingPlan }) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const mappedFeaturesWithState = mapFeatureGroupFeaturesToState(
    featureGroup,
    pricingPlan,
  )
  const filteredFeatures = filterFeatures(mappedFeaturesWithState)
  const getFeatureResources = useGetFeatureResources(pricingPlan)

  return (
    <Group>
      <Collapsible
        defaultIsOpen
        renderToggle={({ isOpen, toggle }) => (
          <FeatureGroupName onClick={() => toggle(!isOpen)}>
            <Media>
              <Media.Side>
                {isOpen ? (
                  <Icons.ArrowExpanded size={24} color="grey-tone-50" />
                ) : (
                  <Icons.ArrowCollapsed size={24} />
                )}
              </Media.Side>
              <Media.Content alignSelf="center" ml="s-16">
                <Text use="p" color={isOpen ? 'grey-tone-50' : 'black'}>
                  {t(`FeatureListGroup.${featureGroup.name}.title`)}
                </Text>
              </Media.Content>
            </Media>
          </FeatureGroupName>
        )}
      >
        {filteredFeatures.map((feature) => (
          <FeatureItem
            key={feature.name}
            feature={feature}
            featureResources={getFeatureResources(feature)}
          />
        ))}
      </Collapsible>
    </Group>
  )
}
