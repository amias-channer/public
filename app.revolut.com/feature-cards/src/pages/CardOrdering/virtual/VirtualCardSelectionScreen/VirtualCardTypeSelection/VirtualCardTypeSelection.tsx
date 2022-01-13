import { FC, useState } from 'react'
import { Layout } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'

import { CardDesignSelectionImage } from '../../../components'
import { VirtualCardTypeSelectionProps } from './types'
import { VirtualCardTypeSelectionAction } from './VirtualCardTypeSelectionAction'
import { VirtualCardTypeSelectionHeader } from './VirtualCardTypeSelectionHeader'
import { VirtualCardTypeSelectionTabs } from './VirtualCardTypeSelectionTabs'

export const VirtualCardTypeSelection: FC<VirtualCardTypeSelectionProps> = ({
  cardTypesOptions,
  children,
  renderContent,
  isCardOrderProcessing,
  isCardLimitChecking,
  onSubmit,
}) => {
  const [selectedCardTypeOptions, setSelectedCardTypeOptions] = useState(
    cardTypesOptions[0],
  )

  const handleSubmit = () => {
    onSubmit(selectedCardTypeOptions)
  }

  const isLoading = isCardOrderProcessing || isCardLimitChecking

  return (
    <Layout>
      <Layout.Main>
        <VirtualCardTypeSelectionHeader />
        <Spacer h="24px" />
        <CardDesignSelectionImage imgSrc={selectedCardTypeOptions.imgSrc} />
        <Spacer h="24px" />
        <VirtualCardTypeSelectionTabs
          cardTypesOptions={cardTypesOptions}
          selectedCardTypeOptions={selectedCardTypeOptions}
          onCardTypeTabClick={setSelectedCardTypeOptions}
        />
        <Spacer h="16px" />
        {renderContent ? renderContent(selectedCardTypeOptions.type) : children}
      </Layout.Main>
      <Layout.Actions>
        <VirtualCardTypeSelectionAction
          selectedCardTypeOptions={selectedCardTypeOptions}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </Layout.Actions>
    </Layout>
  )
}
