import { useCallback, useState } from 'react'

import { defaultStorage, DefaultStorageKey } from '@revolut/rwa-core-utils'

import { ProductStoryName } from './constants'

const mapStoryNameToStorageKey = (name: ProductStoryName): DefaultStorageKey => {
  switch (name) {
    case ProductStoryName.Welcome:
      return DefaultStorageKey.WelcomeStoryIsClosed
    case ProductStoryName.Payments:
      return DefaultStorageKey.PaymentsStoryIsClosed
    default:
      throw new Error(`Unsupported story name: ${name}`)
  }
}

export const useProductStorySwitcher = (
  name: ProductStoryName,
  initialState?: boolean,
) => {
  const storageKey = mapStoryNameToStorageKey(name)
  const [isOpen, setOpen] = useState(initialState ?? !defaultStorage.getItem(storageKey))

  const showProductStory = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const closeProductStory = useCallback(() => {
    defaultStorage.setItem(storageKey, true)
    setOpen(false)
  }, [storageKey, setOpen])

  return { isProductStoryOpen: isOpen, showProductStory, closeProductStory }
}
