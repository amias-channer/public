import { ChangeEventHandler, useCallback, useMemo, useState } from 'react'
import { find } from 'lodash'
import { useBoolean } from 'react-hanger/array'
import { FlowViewItemType } from '../../../appConstants'

import { Props } from '.'

type Values = {
  customValue?: string
  defaultValue?: string
  showCustomInput: boolean
}

type Actions = {
  changeCustomValue: ChangeEventHandler<HTMLInputElement>
  changeRadioGroup: (id: string | null) => void
}

export const mapItemsToValues = (
  items: Props['items'],
  id: string,
  customValue?: string,
) =>
  items.reduce((values, item) => {
    const isItemActive = item.id === id
    const isItemSingleChoiceText = item.type === FlowViewItemType.SingleChoiceTextInput
    const singleChoiceTextValue = {
      selected: isItemActive,
      content: { value: customValue },
    }

    return {
      ...values,
      [item.id]: isItemSingleChoiceText ? singleChoiceTextValue : { value: isItemActive },
    }
  }, {})

export default function useSingleChoice({
  items,
  changeViewItemValues,
}: Pick<Props, 'items' | 'changeViewItemValues'>): [Values, Actions] {
  const [customValue, setCustomValue] = useState<string>()
  const [showCustomInput, showCustomInputActions] = useBoolean(false)

  const customItemId = useMemo(
    () => find(items, { type: FlowViewItemType.SingleChoiceTextInput })?.id,
    [items],
  )

  const defaultValue = useMemo(() => {
    for (const item of items) {
      if (item.type === FlowViewItemType.SingleChoiceTextInput && item.value?.selected) {
        setCustomValue(item.value?.content?.value)
        showCustomInputActions.setTrue()
        return item.id
      }

      if (item.type === FlowViewItemType.SingleChoice && item.value?.value) {
        return item.id
      }
    }

    return undefined
  }, [items, showCustomInputActions])

  const changeRadioGroup = useCallback<Actions['changeRadioGroup']>(
    (id: string | null) => {
      if (id === null) return
      if (id === customItemId) {
        showCustomInputActions.setTrue()
      } else {
        showCustomInputActions.setFalse()
      }
      changeViewItemValues(mapItemsToValues(items, id, customValue))
    },
    [changeViewItemValues, items, customValue, customItemId, showCustomInputActions],
  )

  const changeCustomValue = useCallback<Actions['changeCustomValue']>(
    event => {
      const newValue = event.target.value
      setCustomValue(newValue)

      if (customItemId) {
        changeViewItemValues({
          [customItemId]: {
            selected: true,
            content: {
              value: newValue,
            },
          },
        })
      }
    },
    [changeViewItemValues, customItemId],
  )

  return useMemo(
    () => [
      {
        customValue,
        showCustomInput,
        defaultValue,
      },
      {
        changeCustomValue,
        changeRadioGroup,
      },
    ],
    [changeCustomValue, changeRadioGroup, customValue, defaultValue, showCustomInput],
  )
}
