import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Details } from '@revolut/ui-kit'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { useModal } from '@revolut/rwa-core-components'
import { formatMoney as formatMoneyUtil, getCurrentLocale } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../constants'
import { OtherAmountPopup } from '../OtherAmountPopup'
import { BarStyled } from './styled'
import { SuggestionButton } from './SuggestionButton'

type AmountSuggestionsProps = {
  title?: string
  currency: string
  currentValue?: number
  availableValues: ReadonlyArray<number>
  allowOther?: boolean
  onSelect: (value: number) => void
}

export const AmountSuggestions: FC<AmountSuggestionsProps> = ({
  title,
  currency,
  currentValue,
  availableValues,
  allowOther,
  onSelect,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const [showOtherAmountPopup, otherAmountPopupProps] = useModal()

  const locale = getCurrentLocale()

  const formatMoney = (value: number) =>
    formatMoneyUtil(value, currency, locale, {
      withCurrency: true,
      useGrouping: true,
      noDecimal: true,
    })

  const isOtherSelected = Boolean(
    currentValue && availableValues.indexOf(currentValue) === -1,
  )

  useEffect(() => {
    trackEvent(TopUpTrackingEvent.topUpSuggestedAmountSelected, {
      amount: currentValue,
    })
  }, [currentValue])

  return (
    <>
      {title && (
        <Details>
          <Details.Title>{title}</Details.Title>
        </Details>
      )}

      <BarStyled variant="suggestions">
        {availableValues.map((value) => (
          <SuggestionButton
            key={value}
            isActive={value === currentValue}
            onClick={() => onSelect(value)}
          >
            {formatMoney(value)}
          </SuggestionButton>
        ))}

        {allowOther && (
          <>
            <SuggestionButton isActive={isOtherSelected} onClick={showOtherAmountPopup}>
              {isOtherSelected
                ? formatMoney(currentValue!)
                : t('facelift.AmountSuggestions.items.other')}
            </SuggestionButton>

            <OtherAmountPopup
              currency={currency}
              onSubmit={onSelect}
              {...otherAmountPopupProps}
            />
          </>
        )}
      </BarStyled>
    </>
  )
}
