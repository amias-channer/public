import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { useModal } from '@revolut/rwa-core-components'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'
import { CardReportPopup } from './CardReportPopup'

type CardReportActionProps = {
  onReport: VoidFunction
}

export const CardReportAction: FC<CardReportActionProps> = ({ onReport }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const [showCardReportPopup, cardReportPopupProps] = useModal()

  return (
    <>
      <Item use="button" onClick={showCardReportPopup}>
        <Item.Avatar>
          <Avatar color="error">
            {/* hack to fix icon size mismatch */}
            <Icons.Warning variant="24" size={20} />
          </Avatar>
        </Item.Avatar>
        <Item.Content>
          <Item.Title>{t('CardSettings.actions.report.title')}</Item.Title>
          <Item.Description>
            {t('CardSettings.actions.report.description')}
          </Item.Description>
        </Item.Content>
      </Item>
      <CardReportPopup {...cardReportPopupProps} onReportClick={onReport} />
    </>
  )
}
