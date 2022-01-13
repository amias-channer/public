import { useTranslation } from 'react-i18next'
import { Button, StatusPopup } from '@revolut/ui-kit'

import { ModalComponent } from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../constants'

type AvoidBankFeesPopupProps = {
  pocketCurrency?: string
  cardCurrency?: string
  onContinue: VoidFunction
}

export const AvoidBankFeesPopup: ModalComponent<AvoidBankFeesPopupProps> = ({
  pocketCurrency = '',
  cardCurrency = '',
  isOpen,
  onContinue,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const handleContinueClick = () => {
    onRequestClose()
    onContinue()
  }

  return (
    <StatusPopup variant="warning" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>{t('facelift.AvoidBankFeesPopup.title')}</StatusPopup.Title>
      <StatusPopup.Description>
        {t('facelift.AvoidBankFeesPopup.description', {
          pocketCurrency,
          cardCurrency,
        })}
      </StatusPopup.Description>
      <StatusPopup.Actions>
        <Button elevated onClick={handleContinueClick}>
          {t('facelift.AvoidBankFeesPopup.continueButtonText')}
        </Button>
        <Button variant="secondary" onClick={onRequestClose}>
          {t('common:cancel')}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  )
}
