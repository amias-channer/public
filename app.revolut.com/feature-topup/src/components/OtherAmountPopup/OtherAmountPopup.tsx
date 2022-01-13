import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Amount, Button, Popup } from '@revolut/ui-kit'

import { ModalComponent, MoneyInput, MoneyInputValue } from '@revolut/rwa-core-components'

import { I18N_NAMESPACE, EMPTY_AMOUNT_VALUE } from '../constants'

type OtherAmountPopupProps = {
  currency: string
  onSubmit: (value: number) => void
}

export const OtherAmountPopup: ModalComponent<OtherAmountPopupProps> = ({
  currency,
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const [value, setValue] = useState<MoneyInputValue>()

  const handleExit = () => {
    onRequestClose()

    setValue(undefined)
  }

  const handleSubmit = () => {
    onSubmit((value ?? EMPTY_AMOUNT_VALUE) as number)

    handleExit()
  }

  return (
    <Popup variant="modal-view" isOpen={isOpen} onExit={handleExit}>
      <Popup.Header>
        <Popup.CloseButton />
        <Popup.Title>{t('facelift.OtherAmountPopup.title')}</Popup.Title>
      </Popup.Header>

      <Amount>
        <Amount.Currency value={currency} />
        <Amount.Input
          use={MoneyInput}
          autoFocus
          border={false}
          placeholder="0"
          variant="underlined"
          size="compact"
          currency={currency}
          withCurrencySymbol={false}
          value={value}
          onChange={setValue}
        />
      </Amount>

      <Popup.Actions>
        <Button elevated disabled={!value} onClick={handleSubmit}>
          {t('facelift.OtherAmountPopup.addMoneyButtonText')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
