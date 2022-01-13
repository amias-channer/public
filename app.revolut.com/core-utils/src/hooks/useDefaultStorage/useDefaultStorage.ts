import { isFunction } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import * as Sentry from '@sentry/react'

import {
  defaultStorage,
  DefaultStorageKey,
  buildSentryContext,
  SentryTag,
} from '../../utils'

export const useDefaultStorage = <T = string>(
  key: DefaultStorageKey,
  defaultValue: T,
): [T, (value: ((prevValue: T | null) => T | null) | T | null) => void] => {
  const [value, setValue] = useState<T | null>(
    defaultStorage.getItem<T>(key) ?? defaultValue,
  )

  useEffect(() => {
    const parsedValue = defaultStorage.getItem<T>(key)

    if (parsedValue !== null) {
      setValue(parsedValue)
    }
  }, [setValue, key])

  const updateValue = useCallback(
    (nextValue: ((prevValue: T | null) => T | null) | T | null) => {
      const prevValue = defaultStorage.getItem<T>(key) || defaultValue

      const newValue = isFunction(nextValue) ? nextValue(prevValue) : nextValue

      if (newValue === null) {
        defaultStorage.removeItem(key)
      } else {
        defaultStorage.setItem(key, newValue)
      }

      const event = new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(newValue),
      })

      event.initEvent('storage', true, true)

      window.dispatchEvent(event)
    },
    [key, defaultValue],
  )

  const onChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setValue(JSON.parse(event.newValue))
        } catch (e) {
          Sentry.captureException(e, {
            tags: {
              [SentryTag.Context]: buildSentryContext(['useDefaultStorage']),
            },
          })
        }
      }
    },
    [setValue, key],
  )

  useEffect(() => {
    window.addEventListener('storage', onChange)

    return () => {
      window.removeEventListener('storage', onChange)
    }
  }, [onChange])

  return [value as T, updateValue]
}
