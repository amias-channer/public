import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { Item } from '@revolut/ui-kit'

export const NoTransactionsFound: VFC = () => {
  const { t } = useTranslation('pages.TransactionsList')
  return (
    <Item disabled inactive>
      <Item.Content>
        <Item.Title>{t('noTransactionsFound')}</Item.Title>
      </Item.Content>
    </Item>
  )
}
