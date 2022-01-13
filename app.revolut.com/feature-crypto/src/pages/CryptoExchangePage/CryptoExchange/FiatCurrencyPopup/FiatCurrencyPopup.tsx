import { useContext } from 'react'
import { Group, Popup } from '@revolut/ui-kit'

import { useQueryWallet } from '@revolut/rwa-core-api'
import { ModalComponent } from '@revolut/rwa-core-components'
import { PocketType } from '@revolut/rwa-core-types'

import { CryptoContext } from '../../../../providers'
import { FiatCurrencyPocket } from './FiatCurrencyPocket'

type FiatCurrencyPopupProps = {
  selectedCurrency: string
  onCurrencyChange: (currency: string) => void
}

export const FiatCurrencyPopup: ModalComponent<FiatCurrencyPopupProps> = ({
  isOpen,
  selectedCurrency,
  onCurrencyChange,
  onRequestClose,
}) => {
  const { data: wallet } = useQueryWallet()

  const { availableTargetCurrencies } = useContext(CryptoContext)

  if (!wallet) {
    return null
  }

  const { pockets } = wallet

  const availablePockets = pockets.filter(
    (pocket) =>
      pocket.type === PocketType.Current &&
      availableTargetCurrencies.includes(pocket.currency),
  )

  const handleCurrencyChange = (currency: string) => {
    onCurrencyChange(currency)
    onRequestClose()
  }

  return (
    <Popup isOpen={isOpen} variant="bottom-sheet" onExit={onRequestClose}>
      <Group>
        {availablePockets.map((pocket) => (
          <FiatCurrencyPocket
            key={pocket.currency}
            pocket={pocket}
            isSelected={selectedCurrency === pocket.currency}
            onCurrencyChange={handleCurrencyChange}
          />
        ))}
      </Group>
    </Popup>
  )
}
