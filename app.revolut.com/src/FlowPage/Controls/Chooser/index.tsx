import React, { FC, useEffect } from 'react'

import { StringValue, ChooserOption } from '../../../types'
import { AdaptiveSelect } from '../common'

type Props = {
  disabled: boolean
  options: ChooserOption[]
  hint: string
  value?: Pick<StringValue, 'value'>
  changeValue: (value: StringValue['value']) => void
}

const Chooser: FC<Props> = ({ value, options, disabled, changeValue, hint }) => {
  useEffect(
    function setDefaultOption() {
      if (value === undefined) {
        changeValue(options[0].id)
      }
    },
    [changeValue, options, value],
  )
  return (
    <AdaptiveSelect
      placeholder={hint || 'Select...'}
      options={options.map(({ text, id }) => ({ label: text, value: id }))}
      value={value?.value}
      disabled={disabled}
      onChange={changeValue}
    />
  )
}

export default Chooser
