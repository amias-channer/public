import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Group, Item, Popup } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'

import { I18_NAMESPACE } from '../../../constants'
import { StatementsContainer } from './styled'

type SuitabilityStatementPopupProps = {
  items: string[]
} & BaseModalProps

export const SuitabilityStatementPopup: FC<SuitabilityStatementPopupProps> = ({
  items,
  isOpen,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18_NAMESPACE)

  return (
    <Popup isOpen={isOpen} variant="modal-view" onExit={onRequestClose}>
      <Popup.Header>
        <Popup.CloseButton aria-label="Close suitability statement popup" />
        <Popup.Title>
          {t('PricingPlanInsuranceDetails.suitability_statement')}
        </Popup.Title>
      </Popup.Header>
      <Group>
        {items.map((item) => (
          <Item key={item} useIcon={Icons.Info} iconColor="grey-tone-50">
            <Item.Content>
              <Item.Description color="black">
                <StatementsContainer>{item}</StatementsContainer>
              </Item.Description>
            </Item.Content>
          </Item>
        ))}
      </Group>
    </Popup>
  )
}
