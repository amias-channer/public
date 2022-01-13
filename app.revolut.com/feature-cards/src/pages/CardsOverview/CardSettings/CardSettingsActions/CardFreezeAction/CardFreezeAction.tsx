import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

type CardFreezeActionProps = {
  onClick: VoidFunction
}

export const CardFreezeAction: FC<CardFreezeActionProps> = ({ onClick }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)

  return (
    <Item use="button" onClick={onClick}>
      <Item.Avatar>
        <Avatar useIcon={Icons.Snowflake} />
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{t('CardSettings.actions.freeze.title')}</Item.Title>
        <Item.Description>
          {t('CardSettings.actions.freeze.description')}
        </Item.Description>
      </Item.Content>
    </Item>
  )
}
