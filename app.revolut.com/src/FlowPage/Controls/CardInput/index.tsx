import React, { FC, useCallback, useState } from 'react'
import { Input } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import formatStringByPattern from 'format-string-by-pattern'
import { useRifm } from 'rifm'

import { CardNumberValue } from '../../../types'
import useScrollToRef from '../../useScrollToRef'
import { useWidgetInputVariant } from '../../../providers'

type Props = {
  value?: Pick<CardNumberValue, 'value'>
  disabled: boolean
  hint?: string
  changeValue: (value: CardNumberValue['value']) => void
}

export const INPUT_CARD_TESTID = 'input-card-testid'
export const CARD_MASK = '#### #### #### ####'
const cardPattern = '9999 9999 9999 9999'
const addMask = (value: string) => (value ? value + CARD_MASK.slice(value.length) : '')

const CardInput: FC<Props> = ({ value, disabled, changeValue, hint }) => {
  const inputVariant = useWidgetInputVariant()
  const { ref, scroll } = useScrollToRef()

  const handleChange = useCallback(
    (val: string) => {
      changeValue(val.replace(/[^0-9]/g, ''))
    },
    [changeValue],
  )

  const [nativePlaceholder, setNativePlaceholder] = useState('')

  const rifm = useRifm({
    value: value?.value || '',
    mask: true,
    replace: addMask,
    format: formatStringByPattern(cardPattern),
    onChange: handleChange,
  })

  return (
    <Input
      data-testid={INPUT_CARD_TESTID}
      variant={inputVariant}
      ref={ref}
      placeholder={hint || 'Card number'}
      nativePlaceholder={nativePlaceholder}
      disabled={disabled}
      renderAction={() => <Icons.Card size={24} color="grey-50" hoverColor="grey-50" />}
      onFocus={() => {
        setNativePlaceholder(CARD_MASK)
        scroll()
      }}
      onBlur={() => setNativePlaceholder('')}
      onClear={() => changeValue('')}
      {...rifm}
    />
  )
}

export default CardInput
