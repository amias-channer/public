import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import {
  ExclamationMarkOutlinedIcon,
  ModalComponent,
  ModalLayout,
} from '@revolut/rwa-core-components'
import { CardItemDto } from '@revolut/rwa-core-types'
import { IconSize, Url } from '@revolut/rwa-core-utils'

type FrozenCardModalProps = { card?: CardItemDto }

export const FrozenCardModal: ModalComponent<FrozenCardModalProps> = ({
  isOpen,
  onRequestClose,
  card,
}) => {
  const { t } = useTranslation('components.Modals')
  const history = useHistory()

  const goToTransactions = () => {
    onRequestClose()
    history.push(Url.TransactionsList)
  }

  return (
    <ModalLayout
      Icon={<ExclamationMarkOutlinedIcon size={IconSize.ExtraLarge} color="warning" />}
      title={t('FrozenCardModal.title')}
      description={t('FrozenCardModal.description', { cardLast4: card?.lastFour })}
      primaryButtonText={t('FrozenCardModal.goToTransactionsButton')}
      primaryButtonProps={{
        onClick: goToTransactions,
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
