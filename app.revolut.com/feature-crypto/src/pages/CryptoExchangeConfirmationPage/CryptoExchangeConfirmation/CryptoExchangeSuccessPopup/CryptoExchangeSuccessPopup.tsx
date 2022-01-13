import { useTranslation } from 'react-i18next'
import { StatusPopup } from '@revolut/ui-kit'

import { ModalComponent } from '@revolut/rwa-core-components'

import { CryptoExchangeMethod } from '../../../../types'
import { I18N_NAMESPACE } from '../../constants'

type Props = {
  cryptoAmount: string
  exchangeMethod: CryptoExchangeMethod
  fiatAmount: string
}

export const CryptoExchangeSuccessPopup: ModalComponent<Props> = ({
  cryptoAmount,
  exchangeMethod,
  fiatAmount,
  isOpen,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const title = t(`CryptoExchangeSuccessPopup.${exchangeMethod}.title`, {
    cryptoAmount,
    fiatAmount,
  })

  return (
    <StatusPopup variant="success" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>{title}</StatusPopup.Title>
    </StatusPopup>
  )
}
