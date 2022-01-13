import { ChangeEvent, useState, VFC } from 'react'
import { Button, Header, TextArea, Popup, PopupProps } from '@revolut/ui-kit'

import { ErrorPopup, useModal } from '@revolut/rwa-core-components'
import { TransactionDto } from '@revolut/rwa-core-types'

import { useTranslation } from 'react-i18next'
import { usePatchTransaction } from '../../../../hooks'
import { I18N_NAMESPACE } from '../../constants'

type Props = {
  transaction: TransactionDto
  onNoteChanged: VoidFunction
} & Pick<PopupProps, 'isOpen' | 'onExit'>

export const TransactionNotePopup: VFC<Props> = ({
  isOpen,
  transaction,
  onExit,
  onNoteChanged,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const [showErrorPopup, errorPopupProps] = useModal()

  const { patchTransaction, isPatching } = usePatchTransaction()

  const [noteValue, setNoteValue] = useState(transaction.comment ?? '')

  const handleAddNote = () => {
    patchTransaction(
      {
        id: transaction.id,
        requestData: {
          comment: noteValue,
        },
      },
      {
        onSuccess: () => {
          onExit?.()
          onNoteChanged()
        },
        onError: showErrorPopup,
      },
    )
  }

  return (
    <>
      <Popup variant="modal-view" isOpen={isOpen} onExit={onExit}>
        <Header variant="form">
          <Header.CloseButton aria-label="Close" />
          <Header.Title>
            {transaction.comment
              ? t('TransactionNoteWidget.TransactionNotePopup.title.edit')
              : t('TransactionNoteWidget.TransactionNotePopup.title.add')}
          </Header.Title>
        </Header>
        <TextArea
          variant="grey"
          label={t('TransactionNoteWidget.TransactionNotePopup.input.label')}
          autosize={false}
          rows={2}
          value={noteValue}
          onClear={() => setNoteValue('')}
          onChange={({ target }: ChangeEvent<HTMLTextAreaElement>) =>
            setNoteValue(target.value)
          }
        />
        <Popup.Actions>
          <Button
            elevated
            pending={isPatching}
            disabled={isPatching}
            onClick={handleAddNote}
          >
            {t('TransactionNoteWidget.TransactionNotePopup.button')}
          </Button>
        </Popup.Actions>
      </Popup>
      <ErrorPopup {...errorPopupProps} />
    </>
  )
}
