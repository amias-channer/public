import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Subheader, TextWidget, List } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { I18N_NAMESPACE } from '../../../constants'

type Props = {
  cryptoCode: string
}

export const CryptoImportantNote: FC<Props> = ({ cryptoCode }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  return (
    <>
      <Subheader>
        <Subheader.Title>{t('CryptoImportantNote.title')}</Subheader.Title>
      </Subheader>
      <TextWidget>
        <TextWidget.Content>
          <List>
            <List.Item useIcon={Icons.Lightbulb}>
              {t('CryptoImportantNote.note1')}
            </List.Item>
            <List.Item useIcon={Icons.Coins}>{t('CryptoImportantNote.note2')}</List.Item>
            <List.Item useIcon={Icons.Cash}>
              {t('CryptoImportantNote.note3', { cryptoCode })}
            </List.Item>
          </List>
        </TextWidget.Content>
      </TextWidget>
    </>
  )
}
