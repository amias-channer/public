import React, { useCallback, useMemo, createElement } from 'react'
import { partition, groupBy, isPlainObject } from 'lodash'
import { Property } from 'csstype'
import { isMobile } from 'react-device-detect'

import {
  combinedItemTypes,
  FlowViewItemType,
  fullWidthItemType,
  mapItemTypeToElement,
  staticItemTypes,
} from '../../appConstants'
import { FlowViewItem, FlowViewItemDymamic, FlowViewItemValue } from '../../types'
import { useIsWidgetMode } from '../../providers'

import { ControlItemStyled } from './styled'
import { Props } from '.'

type HookProps = Pick<Props, 'changeViewItemValues' | 'isTransition'> & {
  items: FlowViewItem[]
  setDataFetching: (state: boolean) => void
}

export default function useControlItem({
  changeViewItemValues,
  isTransition,
  items,
  setDataFetching,
}: HookProps) {
  const isWidgetMode = useIsWidgetMode()

  // Split items on combined (SingleChoice, MultiChoice) and single items
  const [combinedItems] = useMemo(
    () => partition(items, ({ type }: FlowViewItem) => combinedItemTypes.includes(type)),
    [items],
  )

  const [imageItems, regularItems] = useMemo(
    () => partition(items, { type: FlowViewItemType.Image }),
    [items],
  )

  // Group of combined elements by "group" property to display as different controls
  const combinedItemsGrouped = useMemo(
    () =>
      groupBy(
        combinedItems.map(item => {
          if (item.type === FlowViewItemType.MultiChoice) {
            item.group = 1
          }

          return item
        }),
        'group',
      ),
    [combinedItems],
  )

  // Create an item consisting of a single control
  const createFormItem = useCallback(
    (
      item: FlowViewItem,
      itemIndex,
      options?: {
        align: Property.TextAlign
      },
    ) => {
      if (!mapItemTypeToElement[item.type]) {
        return null
      }

      const prepareValue = (value: any) => {
        if (value === '') {
          return undefined
        }
        return {
          ...(isPlainObject(value) ? value : { value }),
        }
      }

      const elementProps = {
        ...item,
        value: (item as FlowViewItemDymamic)?.value,
        disabled: isTransition,
        setDataFetching,
      } as {
        value: FlowViewItemValue
        disabled: boolean
        hint?: string
        yesTitle?: string
        notTitle?: string
        buttonTitle?: string
        captureHint?: string
        takePhotoHint?: string
        confirmPhotoHint?: string
        retakePhotoHint?: string
        switchCameraHint?: string
        changeValue?: (value: any) => void
        setDataFetching: (state: boolean) => void
      }

      if (!staticItemTypes.includes(item.type)) {
        elementProps.changeValue = (value: any) =>
          changeViewItemValues({
            [(item as FlowViewItemDymamic).id]: prepareValue(value),
          })
      }

      const element = createElement(mapItemTypeToElement[item.type], elementProps)

      return (
        <ControlItemStyled
          // Static items don't have ID so we use type + index as a key
          key={(item as FlowViewItemDymamic).id || `${item.type}-${itemIndex}`}
          fullWidth={fullWidthItemType.includes(item.type) || isMobile || isWidgetMode}
          style={{
            textAlign: options?.align || 'left',
          }}
        >
          {element}
        </ControlItemStyled>
      )
    },
    [changeViewItemValues, isTransition, setDataFetching, isWidgetMode],
  )

  // Create an item consisting of multiple controls (SingleChoice, MultiChoice)
  const createCombinedItem = useCallback(
    group => {
      const { type } = combinedItemsGrouped?.[group]?.[0] as FlowViewItem

      return type ? (
        <ControlItemStyled key={group}>
          {createElement(mapItemTypeToElement[type], {
            items: combinedItemsGrouped[group],
            disabled: isTransition,
            changeViewItemValues,
          })}
        </ControlItemStyled>
      ) : null
    },
    [combinedItemsGrouped, isTransition, changeViewItemValues],
  )

  return {
    imageItems: imageItems.map((item, index) =>
      createFormItem(item, index, { align: 'left' }),
    ),
    items: (
      <>
        {Object.keys(combinedItemsGrouped).map(createCombinedItem)}
        {!Object.keys(combinedItemsGrouped).length &&
          regularItems.map((item, index) => createFormItem(item, index))}
      </>
    ),
  }
}
