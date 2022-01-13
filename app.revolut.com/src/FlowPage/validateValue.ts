import { isEmpty } from 'lodash'
import validator from 'validator'

import { FlowViewItemType } from '../appConstants'
import {
  FlowViewItemDymamic,
  FlowViewItem,
  MoneyValue,
  PhoneValue,
  FilesValue,
  SingleChoiceTextValue,
} from '../types'

export default function validateValue(item: FlowViewItem) {
  const value = (item as FlowViewItemDymamic).value

  // value.value property per API design
  const valueValue = (value as any)?.value
  const isNotRequired = !(item as FlowViewItemDymamic).required

  if (
    isNotRequired &&
    !valueValue &&
    item.type !== FlowViewItemType.SingleChoiceTextInput
  ) {
    return true
  }

  if (!value) {
    return false
  }

  switch (item.type) {
    case FlowViewItemType.CardInput:
      return validator.isCreditCard(valueValue)

    case FlowViewItemType.DateInput:
      return validator.isISO8601(valueValue)

    case FlowViewItemType.TimeInput:
      return /^([2][0-3]|[01]?[0-9]):([0-5][0-9])?$/.test(valueValue)

    case FlowViewItemType.CameraImage:
    case FlowViewItemType.FilesUpload:
      return !isEmpty((value as FilesValue).files)

    case FlowViewItemType.MoneyInput:
      return (
        Boolean((value as MoneyValue).currency) && !isNaN((value as MoneyValue).amount)
      )

    case FlowViewItemType.PhoneInput:
      return (
        Boolean((value as PhoneValue).code) &&
        /^[0-9]{5,11}$/.test((value as PhoneValue).number)
      )

    case FlowViewItemType.MultiChoice:
    case FlowViewItemType.SingleChoice:
      return valueValue !== undefined

    case FlowViewItemType.SingleChoiceTextInput:
      return Boolean((value as SingleChoiceTextValue).content)

    case FlowViewItemType.TextInput:
      return valueValue !== ''

    default:
      return Boolean(valueValue)
  }
}
