import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Group, Popup, Header } from '@revolut/ui-kit'

import { openUrlInNewTab } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../../constants'
import { DisclosureItem } from '../DisclosureItem'
import { MultipleDocumentsPopupProps } from './types'

export const MultipleDocumentsPopup: FC<MultipleDocumentsPopupProps> = ({
  isOpen,
  title,
  items,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18_NAMESPACE)

  return (
    <Popup
      isOpen={isOpen}
      variant="modal-view"
      shouldKeepMaxHeight
      onExit={onRequestClose}
    >
      <Header variant="form">
        <Header.CloseButton aria-label="Close documents popup" />
        <Header.Title>{title}</Header.Title>
        <Header.Description>
          {t('PricingPlanInsuranceDetails.MultipleDocumentsPopup.description')}
        </Header.Description>
      </Header>
      <Group>
        {items.map((item) => (
          <DisclosureItem
            key={item.type}
            title={t(
              `PricingPlanInsuranceDetails.documents.${item.type.toLowerCase()}.title`,
            )}
            onClick={() => openUrlInNewTab(item.docUrl)}
          />
        ))}
      </Group>
    </Popup>
  )
}
