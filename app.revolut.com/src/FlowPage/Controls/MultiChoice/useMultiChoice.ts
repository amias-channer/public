import { ChangeEventHandler, useCallback, useMemo, useState } from 'react'
import { find } from 'lodash'
import { FlowViewItemType } from '../../../appConstants'

import { Props } from '.'

type Values = {
  defaultValue: string[]
  customValue?: string
  showCustomInput: boolean
}

type Actions = {
  changeCustomValue: ChangeEventHandler<HTMLInputElement>
  changeCheckboxGroup: (ids: string[]) => void
}

export const mapItemsToValues = (
  items: Props['items'],
  id: string,
  customValue?: string,
) =>
  items.reduce((values, item) => {
    const isItemActive = item.id === id
    const isItemSingleChoiceText = item.type === FlowViewItemType.SingleChoiceTextInput
    const multiChoiceTextValue = {
      selected: isItemActive,
      content: { value: customValue },
    }

    return {
      ...values,
      [item.id]: {
        value: isItemSingleChoiceText ? multiChoiceTextValue : isItemActive,
      },
    }
  }, {})

export function useMultiChoice({
  items,
  changeViewItemValues,
}: Pick<Props, 'items' | 'changeViewItemValues'>): [Values, Actions] {
  const [customValue, setCustomValue] = useState<string>()
  const [showCustomInput, setShowCustomInput] = useState(false)

  const customItemId = useMemo(
    () => find(items, { type: FlowViewItemType.SingleChoiceTextInput })?.id,
    [items],
  )

  const defaultValue = useMemo(
    () =>
      items
        .filter(item =>
          item.type === FlowViewItemType.MultiChoice
            ? item.value?.value
            : item.value?.selected,
        )
        .map(item => {
          if (item.type === FlowViewItemType.MultiChoice) {
            return item.id
          }

          setCustomValue(item.value?.content.value)
          setShowCustomInput(true)

          return item.id
        }),
    [items],
  )

  const changeCheckboxGroup = useCallback(
    (ids: string[]) => {
      const isCustomValueVisible = Boolean(ids.includes(customItemId ?? ''))
      setShowCustomInput(isCustomValueVisible)

      changeViewItemValues(
        items.reduce(
          (values, item) => ({
            ...values,
            [item.id]:
              item.type === FlowViewItemType.SingleChoiceTextInput
                ? {
                    selected: isCustomValueVisible,
                    content: {
                      value: customValue,
                    },
                  }
                : {
                    value: ids.includes(item.id),
                  },
          }),
          {},
        ),
      )
    },
    [customItemId, changeViewItemValues, items, customValue],
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
        changeCheckboxGroup,
      },
    ],
    [changeCheckboxGroup, changeCustomValue, customValue, defaultValue, showCustomInput],
  )
}
