import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { useHistory, Link } from 'react-router-dom'
import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'
import {
  Box,
  ProductWidget,
  MoreBar,
  Subheader,
  Action,
  ProductWidgetSkeleton,
} from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import {
  Balance,
  ProductWidgetAvatar,
  RatePerformance,
} from '@revolut/rwa-core-components'
import { getCryptoDetailsUrl, Url } from '@revolut/rwa-core-utils'

import { useCryptoHoldings, useCryptoTargetCurrency } from '../../../hooks'
import { CryptoHoldingsList } from '../../../components'

import { CurrencySelectPopup } from './CurrencySelectPopup'

export const CRYPTO_PRODUCT_WIDGET_SKELETON_TESTID =
  'crypto-product-widget-skeleton-testid'

const CRYPTO_PRODUCT_WIDGET_TESTID = 'crypto-product-widget-testid'

const HOLDINGS_MAX_AMOUNT = 3

export const CryptoHomeProductWidget: FC = () => {
  const { t } = useTranslation('components.CryptoHomeProductWidget')

  const history = useHistory()

  const [isCurrencySelectPopupOpen, setIsCurrencySelectPopupOpen] = useState(false)
  const { targetCurrency } = useCryptoTargetCurrency()
  const { getAllHoldings } = useCryptoHoldings(targetCurrency)

  const {
    totalInCurrency,
    totalPerformance,
    totalPnl,
    items: cryptoItems,
    isLoading,
  } = getAllHoldings()

  const onCurrencySelectPopupExit = () => {
    setIsCurrencySelectPopupOpen(false)
  }

  const onSelectCurrencyClick = () => {
    setIsCurrencySelectPopupOpen(true)
  }

  const onCryptoItemClick = (cryptoCode: string) => {
    trackEvent(CryptoTrackingEvent.assetHoldingsEntryPointClicked, {
      TICKER: cryptoCode,
    })
    history.push(
      getCryptoDetailsUrl(cryptoCode, { tab: 'overview', source: 'holdingsWidget' }),
    )
  }

  const onInvestButtonClick = () => {
    trackEvent(CryptoTrackingEvent.investEntryPointClicked)
    history.push(Url.CryptoInvest)
  }

  useEffect(() => {
    trackEvent(CryptoTrackingEvent.cryptoTabOpened)
  }, [])

  return isLoading ? (
    <Box data-testid={CRYPTO_PRODUCT_WIDGET_SKELETON_TESTID}>
      <ProductWidgetSkeleton />
    </Box>
  ) : (
    <>
      <ProductWidget data-testid={CRYPTO_PRODUCT_WIDGET_TESTID}>
        <ProductWidget.Header>
          <ProductWidgetAvatar category="wealth" iconName="Crypto.png" />
          <ProductWidget.Title onClick={onSelectCurrencyClick}>
            <Balance amount={totalInCurrency} currency={targetCurrency} />
          </ProductWidget.Title>
          <ProductWidget.Description>
            <RatePerformance
              pnl={totalPnl}
              currency={targetCurrency}
              performance={totalPerformance}
              maximumFractionDigits={2}
            />
          </ProductWidget.Description>
          <ProductWidget.Bar>
            <MoreBar>
              <MoreBar.Action useIcon={Icons.Coins} onClick={onInvestButtonClick}>
                {t('InvestButton.title')}
              </MoreBar.Action>
            </MoreBar>
          </ProductWidget.Bar>
        </ProductWidget.Header>
        {!isEmpty(cryptoItems) && (
          <>
            <Subheader>
              <Subheader.Title>{t('Investments.title')}</Subheader.Title>
              {cryptoItems.length > HOLDINGS_MAX_AMOUNT ? (
                <Subheader.Side>
                  <Action use={Link} to={Url.CryptoHoldings}>
                    {t('seeAll.button')}
                  </Action>
                </Subheader.Side>
              ) : null}
            </Subheader>
            <CryptoHoldingsList
              maxAmount={HOLDINGS_MAX_AMOUNT}
              onItemClick={onCryptoItemClick}
            />
          </>
        )}
      </ProductWidget>
      <CurrencySelectPopup
        isOpen={isCurrencySelectPopupOpen}
        onExit={onCurrencySelectPopupExit}
      />
    </>
  )
}
