import { FC } from 'react'
import { Subheader, Group, DetailsCell, Action } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useLocale } from '@revolut/rwa-core-i18n'
import {
  formatMoney,
  CryptoDetailsSourceOption,
  getCryptoStatsUrl,
} from '@revolut/rwa-core-utils'
import { CryptoGlobalStatsDto } from '@revolut/rwa-core-types'
import {
  Notation,
  SignDisplay,
  CurrencyDisplay,
  normalizeLocale,
} from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../../../constants'

type Props = {
  stats: CryptoGlobalStatsDto
  cryptoCode: string
  source: CryptoDetailsSourceOption
}

const formatNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(normalizeLocale(locale)).format(value)

const LARGE_MONEY_FORMATTER_OPTIONS = {
  withCurrency: true,
  useGrouping: true,
  noDecimal: false,
  signDisplay: SignDisplay.Auto,
  currencyDisplay: CurrencyDisplay.Symbol,
  notation: Notation.Compact,
}

export const CryptoStats: FC<Props> = ({ stats, cryptoCode, source }) => {
  const { locale } = useLocale()
  const { t } = useTranslation(I18N_NAMESPACE)
  const history = useHistory()

  const onStatsClick = () => {
    history.push(getCryptoStatsUrl(cryptoCode, source))
  }

  const marketCap = stats.marketCap
    ? formatMoney(
        stats.marketCap.amount,
        stats.marketCap.currency,
        locale,
        LARGE_MONEY_FORMATTER_OPTIONS,
      )
    : t('Stats.statUnavailable.text')

  const circulatingSupply = stats.circulatingSupply
    ? formatNumber(stats.circulatingSupply, locale)
    : t('Stats.statUnavailable.text')

  const maxSupply = stats.maxSupply
    ? formatNumber(stats.maxSupply, locale)
    : t('Stats.statUnavailable.text')

  const volume24Hour = stats.volume24Hour
    ? formatMoney(
        stats.volume24Hour.amount,
        stats.volume24Hour.currency,
        locale,
        LARGE_MONEY_FORMATTER_OPTIONS,
      )
    : t('Stats.statUnavailable.text')

  const popularity = stats.popularity ?? t('Stats.statUnavailable.text')

  return (
    <>
      <Subheader>
        <Subheader.Title>{t('Stats.groupTitle')}</Subheader.Title>
        <Subheader.Side>
          <Action onClick={onStatsClick}>{t('Stats.statsDescriptionLink.title')}</Action>
        </Subheader.Side>
      </Subheader>
      <Group>
        <DetailsCell>
          <DetailsCell.Title>{t('Stats.marketCap.title')}</DetailsCell.Title>
          <DetailsCell.Content>{marketCap}</DetailsCell.Content>
        </DetailsCell>
        <DetailsCell>
          <DetailsCell.Title>{t('Stats.circulatingSupply.title')}</DetailsCell.Title>
          <DetailsCell.Content>{circulatingSupply}</DetailsCell.Content>
        </DetailsCell>
        <DetailsCell>
          <DetailsCell.Title>{t('Stats.maxSupply.title')}</DetailsCell.Title>
          <DetailsCell.Content>{maxSupply}</DetailsCell.Content>
        </DetailsCell>
        <DetailsCell>
          <DetailsCell.Title>{t('Stats.volume24Hour.title')}</DetailsCell.Title>
          <DetailsCell.Content>{volume24Hour}</DetailsCell.Content>
        </DetailsCell>
        <DetailsCell>
          <DetailsCell.Title>{t('Stats.popularity.title')}</DetailsCell.Title>
          <DetailsCell.Content>{popularity}</DetailsCell.Content>
        </DetailsCell>
      </Group>
    </>
  )
}
