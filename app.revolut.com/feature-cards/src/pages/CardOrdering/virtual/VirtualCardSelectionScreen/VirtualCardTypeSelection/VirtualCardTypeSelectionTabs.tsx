import capitalize from 'lodash/capitalize'
import { FC } from 'react'
import { TabBar } from '@revolut/ui-kit'

import { VirtualCardTypeSelectionTabsProps } from './types'

export const VirtualCardTypeSelectionTabs: FC<VirtualCardTypeSelectionTabsProps> = ({
  cardTypesOptions,
  selectedCardTypeOptions,
  onCardTypeTabClick,
}) => (
  <TabBar variant="navigation" mx="auto">
    {cardTypesOptions.map((cardTypeOptions) => (
      <TabBar.Item
        style={{ margin: '4px' }}
        key={cardTypeOptions.name}
        aria-selected={selectedCardTypeOptions.name === cardTypeOptions.name}
        name={cardTypeOptions.name}
        use="button"
        onClick={() => onCardTypeTabClick(cardTypeOptions)}
      >
        {capitalize(cardTypeOptions.name)}
      </TabBar.Item>
    ))}
  </TabBar>
)
