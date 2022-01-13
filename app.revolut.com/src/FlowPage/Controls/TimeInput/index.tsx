import React, { FC, useCallback } from 'react'
import { Box, Input } from '@revolut/ui-kit'
import formatStringByPattern from 'format-string-by-pattern'
import { useRifm } from 'rifm'

import { TimeInputItem, TimeValue } from '../../../types'
import useScrollToRef from '../../useScrollToRef'
import { useWidgetInputVariant } from '../../../providers'

type Props = {
  value?: TimeInputItem['value']
  disabled: boolean
  hint?: string
  changeValue: (value: TimeValue['value']) => void
}

export const INPUT_TIME_TESTID = 'input-time-testid'
const TIME_REGEXP = /[^0-9:]/g

const TimeInput: FC<Props> = ({ value, disabled, changeValue, hint }) => {
  const { ref, scroll } = useScrollToRef()
  const inputVariant = useWidgetInputVariant()

  const handleChange = useCallback(
    (val: string) => {
      changeValue(val.replace(TIME_REGEXP, ''))
    },
    [changeValue],
  )

  const rifm = useRifm({
    value: value?.value || '',
    mask: true,
    format: formatStringByPattern('24:59'),
    onChange: handleChange,
  })

  return (
    <Box width="100%" mx={{ sm: 'auto', md: 0 }} ref={ref}>
      <Input
        data-testid={INPUT_TIME_TESTID}
        variant={inputVariant}
        placeholder={hint || 'Time'}
        disabled={disabled}
        onFocus={() => scroll()}
        onClear={() => changeValue('')}
        {...rifm}
      />
    </Box>
  )
}

export default TimeInput
