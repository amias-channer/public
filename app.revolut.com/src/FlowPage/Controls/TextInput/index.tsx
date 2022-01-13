import React, { FC, useCallback } from 'react'
import { TextArea } from '@revolut/ui-kit'

import { StringValue } from '../../../types'
import useScrollToRef from '../../useScrollToRef'
import { useWidgetInputVariant } from '../../../providers'

type Props = {
  value?: Pick<StringValue, 'value'>
  disabled: boolean
  hint: string
  changeValue: (value: StringValue['value']) => void
}

export const TEXTAREA_TESTID = 'textarea-testid'

const TextInput: FC<Props> = ({ value, disabled, changeValue, hint }) => {
  const { ref, scroll } = useScrollToRef()
  const inputVariant = useWidgetInputVariant()
  const handleChange = useCallback(
    event => {
      changeValue(event.target.value)
    },
    [changeValue],
  )

  return (
    <TextArea
      data-testid={TEXTAREA_TESTID}
      variant={inputVariant}
      ref={ref}
      placeholder={hint || 'Type answer here'}
      value={value?.value || ''}
      onInput={handleChange}
      disabled={disabled}
      rows={1}
      autosize
      onFocus={() => scroll()}
      onClear={() => changeValue('')}
    />
  )
}

export default TextInput
