import { Avatar, Group, Item, Popup } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { useTranslation } from 'react-i18next'

import { ModalComponent } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

type MoreSettingsPopupProps = {
  onAccountDetailsClick: VoidFunction
  onStatementClick: VoidFunction
  shouldDisplayDetails: boolean
}

export const MoreSettingsPopup: ModalComponent<MoreSettingsPopupProps> = ({
  isOpen,
  shouldDisplayDetails,
  onAccountDetailsClick,
  onStatementClick,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  return (
    <Popup variant="bottom-sheet" isOpen={isOpen} onExit={onRequestClose}>
      <Group>
        <Item use="button" onClick={onStatementClick}>
          <Item.Avatar>
            <Avatar useIcon={Icons.Statement} />
          </Item.Avatar>
          <Item.Content color="primary">{t('statement')}</Item.Content>
        </Item>
        {shouldDisplayDetails && (
          <Item use="button" onClick={onAccountDetailsClick}>
            <Item.Avatar>
              <Avatar useIcon={Icons.InfoOutline} />
            </Item.Avatar>
            <Item.Content color="primary">{t('details')}</Item.Content>
          </Item>
        )}
      </Group>
    </Popup>
  )
}
