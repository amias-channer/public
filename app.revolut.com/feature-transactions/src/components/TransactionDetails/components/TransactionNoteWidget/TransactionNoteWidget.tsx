import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { Action, DetailsCell } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { useModal } from '@revolut/rwa-core-components'
import { TransactionDto } from '@revolut/rwa-core-types'

import { I18N_NAMESPACE } from '../../constants'
import { TransactionNotePopup } from './TransactionNotePopup'

type Props = {
  transaction: TransactionDto
  onNoteChanged: VoidFunction
}

export const TransactionNoteWidget: VFC<Props> = ({ transaction, onNoteChanged }) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const [showAddTransactionNotePopup, addTransactionNotePopupProps] = useModal()

  return (
    <>
      <DetailsCell>
        <DetailsCell.Title>{t('TransactionNoteWidget.cell.title')}</DetailsCell.Title>
        <DetailsCell.Content>
          <Action useIcon={Icons.Pencil} onClick={showAddTransactionNotePopup}>
            {transaction.comment
              ? t('TransactionNoteWidget.cell.content.edit')
              : t('TransactionNoteWidget.cell.content.add')}
          </Action>
        </DetailsCell.Content>
        {transaction.comment && (
          <DetailsCell.Note>{transaction.comment}</DetailsCell.Note>
        )}
      </DetailsCell>
      <TransactionNotePopup
        transaction={transaction}
        onNoteChanged={onNoteChanged}
        {...addTransactionNotePopupProps}
      />
    </>
  )
}
