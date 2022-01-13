import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Popup, Header, Group } from '@revolut/ui-kit'

import { ConfigKey, Currency, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType } from '@revolut/rwa-core-types'
import { CurrencyItem } from '@revolut/rwa-core-components'

import { useCryptoTargetCurrency } from '../../../../hooks'

type Props = {
  isOpen: boolean
  onExit: VoidFunction
}

const getCurrenciesInfo = (currenciesList: Currency[]) => {
  const currenciesData = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  return currenciesList.map((currency) => currenciesData[currency])
}

export const CurrencySelectPopup: FC<Props> = ({ isOpen, onExit }) => {
  const { t } = useTranslation('components.CryptoHomeProductWidget')
  const { availableTargetCurrencies, setTargetCurrency, targetCurrency } =
    useCryptoTargetCurrency()

  const availableCurrenciesWithData = getCurrenciesInfo(availableTargetCurrencies)

  const onCurrencyItemClick = (newCurrency: Currency) => () => {
    setTargetCurrency(newCurrency)
    onExit()
  }

  return (
    <Popup variant="bottom-sheet" isOpen={isOpen} onExit={onExit}>
      <Header variant="bottom-sheet">
        <Header.Title>{t('CurrencySelectionPopup.title')}</Header.Title>
      </Header>
      <Group>
        {availableCurrenciesWithData.map((currencyData) => (
          <CurrencyItem
            key={currencyData.code}
            title={currencyData.currency}
            currency={currencyData.code}
            isSelected={currencyData.code === targetCurrency}
            onClick={onCurrencyItemClick(currencyData.code)}
          />
        ))}
      </Group>
    </Popup>
  )
}
