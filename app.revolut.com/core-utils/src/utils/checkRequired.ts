import { isNil } from 'lodash'

export function checkRequired<T>(value: T, message?: string) {
  if (isNil(value)) {
    throw new Error(message || 'Required value can not be empty')
  }

  return value as NonNullable<T>
}
