import { VFC, useContext, useMemo } from 'react'
import { isEmpty, isUndefined, sortBy } from 'lodash'
import { Group, ItemSkeleton, Item } from '@revolut/ui-kit'

import { Percents } from '@revolut/rwa-core-components'
import { getConfigValue, ConfigKey, CurrenciesType } from '@revolut/rwa-core-config'
import { formatMoney } from '@revolut/rwa-core-utils'
import { useLocale } from '@revolut/rwa-core-i18n'

import { CryptoAvatar, NoCryptoFoundItem } from '../../../components'
import { useCryptoRateAndVolatility, useCryptoCurrenciesConfig } from '../../../hooks'
import { CryptoContext } from '../../../providers'

type Props = {
  onItemClick: (code: string) => VoidFunction
  filterValue?: string
}

export const CRYPTO_INFO_LOADING_TEST_ID = 'crypto-info-loading-testid'

export const AvailableCryptos: VFC<Props> = ({ onItemClick, filterValue }) => {
  const { locale } = useLocale()
  const { targetCurrency } = useContext(CryptoContext)
  const { data: cryptoConfigData, status: configQueryStatus } =
    useCryptoCurrenciesConfig()

  const cryptoCurrenciesInfo = getConfigValue<CurrenciesType>(ConfigKey.CryptoCurrencies)

  const availableCryptos = useMemo(
    () =>
      cryptoConfigData?.crypto.filter((code) => Boolean(cryptoCurrenciesInfo[code])) ||
      [],
    [cryptoConfigData?.crypto, cryptoCurrenciesInfo],
  )

  const ratesVolatilityRequest = availableCryptos.map((cryptoCode) =>
    [cryptoCode, targetCurrency].join('/'),
  )

  const { isLoading: isRatesLoading, data: cryptoRates } =
    useCryptoRateAndVolatility(ratesVolatilityRequest)

  const isLoading = isRatesLoading || configQueryStatus === 'loading'

  const cryptoInfoAndRates = useMemo(
    () =>
      availableCryptos.map((cryptoCode) => {
        const cryptoInfo = cryptoCurrenciesInfo[cryptoCode]

        const noInfo = {
          code: cryptoCode,
          name: cryptoInfo.currency,
          rate: undefined,
          volatility: undefined,
        }

        if (isLoading) {
          return noInfo
        }

        const foundRate = cryptoRates.find((rate) => rate && rate.from === cryptoCode)

        if (!foundRate) {
          return noInfo
        }

        return {
          code: cryptoCode,
          name: cryptoInfo.currency,
          rate: formatMoney(foundRate.rate * 100, targetCurrency, locale),
          volatility: foundRate.volatility / 100,
        }
      }),
    [
      availableCryptos,
      cryptoCurrenciesInfo,
      cryptoRates,
      isLoading,
      locale,
      targetCurrency,
    ],
  )

  const sortedCryptoInfoAndRates = useMemo(
    () =>
      sortBy(
        cryptoInfoAndRates.filter((crypto) => {
          if (filterValue) {
            return (
              cryptoCurrenciesInfo[crypto.code].currency
                .toLowerCase()
                .includes(filterValue.toLowerCase()) ||
              crypto.code.toUpperCase().includes(filterValue.toUpperCase())
            )
          }
          return true
        }),
        'code',
      ),
    [cryptoCurrenciesInfo, cryptoInfoAndRates, filterValue],
  )

  if (isLoading) {
    return (
      <Group data-testid={CRYPTO_INFO_LOADING_TEST_ID}>
        <ItemSkeleton />
        <ItemSkeleton />
        <ItemSkeleton />
      </Group>
    )
  }

  if (isEmpty(sortedCryptoInfoAndRates)) {
    return <NoCryptoFoundItem />
  }
  return (
    <Group>
      {sortedCryptoInfoAndRates.map((cryptoInfo) => (
        <Item key={cryptoInfo.code} use="button" onClick={onItemClick(cryptoInfo.code)}>
          <Item.Avatar>
            <CryptoAvatar cryptoCode={cryptoInfo.code} />
          </Item.Avatar>
          <Item.Content>
            <Item.Title>{cryptoInfo.name}</Item.Title>
            <Item.Description>{cryptoInfo.code}</Item.Description>
          </Item.Content>
          <Item.Side>
            <Item.Value>
              {isUndefined(cryptoInfo.rate) ? '-' : cryptoInfo.rate}
            </Item.Value>
            <Item.Value variant="secondary">
              {isUndefined(cryptoInfo.volatility) ? (
                '-'
              ) : (
                <Percents value={cryptoInfo.volatility} />
              )}
            </Item.Value>
          </Item.Side>
        </Item>
      ))}
    </Group>
  )
}
