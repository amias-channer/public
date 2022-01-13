import { FC, useEffect, useState } from 'react'

import {
  DateInputMaskContainer,
  DateInputMaskHidden,
  DateInputMaskVisible,
} from './styled'

type DateInputMaskProps = {
  currentDateValue: string
  mask: string
}

export const DATE_INPUT_MASK_TEST_ID = 'date-input-mask-test-id'

export const DateInputMask: FC<DateInputMaskProps> = ({ currentDateValue, mask }) => {
  const [visibleMask, setVisibleMask] = useState(mask.slice(currentDateValue.length))

  useEffect(() => {
    setVisibleMask(mask.slice(currentDateValue.length))
  }, [currentDateValue, mask])

  return (
    <DateInputMaskContainer data-testid={DATE_INPUT_MASK_TEST_ID}>
      <DateInputMaskHidden>{currentDateValue}</DateInputMaskHidden>
      <DateInputMaskVisible>{visibleMask}</DateInputMaskVisible>
    </DateInputMaskContainer>
  )
}
