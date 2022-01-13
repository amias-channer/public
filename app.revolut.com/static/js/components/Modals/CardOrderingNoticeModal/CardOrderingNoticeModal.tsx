import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Warning } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize, Url } from '@revolut/rwa-core-utils'

export const CardOrderingNoticeModal: ModalComponent = ({ isOpen, onRequestClose }) => {
  const { t } = useTranslation(['pages.Cards', 'common'])
  const history = useHistory()

  const handleConfirm = () => {
    onRequestClose()
    history.push(Url.CardOrdering)
  }

  return (
    <ModalLayout
      Icon={<Warning size={IconSize.Large} color="warning" />}
      title={t('CardOrderingNoticeModal.title')}
      description={t('CardOrderingNoticeModal.text')}
      primaryButtonText={t('CardOrderingNoticeModal.submitButton')}
      primaryButtonProps={{
        onClick: handleConfirm,
      }}
      secondaryButtonText={t('common:cancel')}
      secondaryButtonProps={{ onClick: onRequestClose }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
