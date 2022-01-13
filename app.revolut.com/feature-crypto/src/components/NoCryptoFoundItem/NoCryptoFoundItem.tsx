import { VFC } from 'react'
import { Item } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'

export const NoCryptoFoundItem: VFC = () => {
  const { t } = useTranslation('components.NoCryptoFoundItem')
  return (
    <Item inactive disabled>
      <Item.Content>
        <Item.Title>{t('text')}</Item.Title>
      </Item.Content>
    </Item>
  )
}
