import qs from 'qs'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { browser, Url } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

export const CardSecurityAction: FC = () => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const history = useHistory()

  const { cardId } = qs.parse(browser.getSearch()) as { cardId: string }

  return (
    <Item
      use="button"
      onClick={() => history.push(generatePath(Url.CardSettingsSecurity, { cardId }))}
    >
      <Item.Avatar>
        <Avatar useIcon={Icons.Shield} />
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{t('CardSettings.security.title')}</Item.Title>
        <Item.Description>{t('CardSettings.security.description')}</Item.Description>
      </Item.Content>
    </Item>
  )
}
