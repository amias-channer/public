import { VFC } from 'react'
import { Header } from '@revolut/ui-kit'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AssetsQuoteResponseDto } from '@revolut/rwa-core-types'

import { getCryptoExchangeMethodUrl } from '../../../../utils'
import { CryptoExchangeMethod } from '../../../../types'
import { CryptoAvatar } from '../../../../components'
import { I18N_NAMESPACE } from '../../constants'
import { useGetAssetsValuesFromAssetsQuote } from '../hooks'
import { CryptoExchangeConfirmationHeaderSkeleton } from './CryptoExchangeConfirmationHeaderSkeleton'

type Props = {
  assetsQuote?: AssetsQuoteResponseDto
  cryptoCode: string
  exchangeMethod: CryptoExchangeMethod
  fiatCurrencyCode: string
}

const FIAT_BUY_PREFIX = '+'
const FIAT_SELL_PREFIX = '-'

const addPrefixToFiatValue = (exchangeMethod: CryptoExchangeMethod, value: string) => {
  const isFiatBuyMethod = exchangeMethod === CryptoExchangeMethod.Sell

  const prefix = isFiatBuyMethod ? FIAT_BUY_PREFIX : FIAT_SELL_PREFIX

  return `${prefix}${value}`
}

export const CryptoExchangeConfirmationHeader: VFC<Props> = ({
  assetsQuote,
  cryptoCode,
  exchangeMethod,
  fiatCurrencyCode,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const history = useHistory()
  const { fiatValue, cryptoValue } = useGetAssetsValuesFromAssetsQuote({
    assetsQuote,
    cryptoCode,
    fiatCurrencyCode,
  })

  if (!assetsQuote) {
    return <CryptoExchangeConfirmationHeaderSkeleton />
  }

  const handleBackButtonClick = () => {
    history.push(getCryptoExchangeMethodUrl(cryptoCode, exchangeMethod))
  }

  return (
    <Header variant="item">
      <Header.BackButton aria-label="Back" onClick={handleBackButtonClick} />
      <Header.Title>{addPrefixToFiatValue(exchangeMethod, fiatValue)}</Header.Title>
      <Header.Subtitle>
        {t(`subtitle.${exchangeMethod}`, { amount: cryptoValue })}
      </Header.Subtitle>
      <Header.Avatar>
        <CryptoAvatar
          avatarProps={{
            size: 56,
          }}
          cryptoCode={cryptoCode}
        />
      </Header.Avatar>
    </Header>
  )
}
