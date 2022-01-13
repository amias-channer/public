import { VFC } from 'react'
import { Item } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'

import { I18N_NAMESPACE } from '../../../constants'

export const NoOrdersItem: VFC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)
  return (
    <Item inactive disabled>
      <Item.Content>
        <Item.Title>{t('RecurringOrders.noOrders')}</Item.Title>
      </Item.Content>
    </Item>
  )
}
