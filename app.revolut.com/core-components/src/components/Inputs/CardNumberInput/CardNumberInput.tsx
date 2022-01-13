import cardValidator from 'card-validator'
import { ChangeEvent, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { TextInput } from '../TextInput'
import { CardTypeIcon } from './CardTypeIcon'
import { CardNumberInputProps, CardType } from './types'
import { normalizeCardNumber, addSpacesToCardNumberGroups } from './utils'

export const CardNumberInput = forwardRef<HTMLInputElement, CardNumberInputProps>(
  ({ value, initialCardType, onChange, ...restProps }, ref) => {
    const { t } = useTranslation('components.CardNumberInput')

    const cardType =
      (cardValidator.number(value).card?.type as CardType | undefined) ?? initialCardType
    const cardNumber = addSpacesToCardNumberGroups(value)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const normalizedCardNumber = normalizeCardNumber(event.target.value, cardNumber)

      onChange(normalizedCardNumber)
    }

    return (
      <TextInput
        placeholder={t('placeholder')}
        autoComplete="cc-number"
        renderAction={() => cardType && <CardTypeIcon cardType={cardType} />}
        value={cardNumber}
        {...restProps}
        ref={ref}
        onChange={handleChange}
      />
    )
  },
)
