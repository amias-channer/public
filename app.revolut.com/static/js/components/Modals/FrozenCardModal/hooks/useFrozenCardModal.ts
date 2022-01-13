import { useEffect } from 'react'

import { useModal } from '@revolut/rwa-core-components'
import { useCardWithSuspiciousTransaction } from '@revolut/rwa-feature-transactions'

export const useFrozenCardModal = () => {
  const [showModal, generalModalProps] = useModal()
  const card = useCardWithSuspiciousTransaction()

  useEffect(() => {
    if (card) {
      showModal()
    }
  }, [card, showModal])

  return { ...generalModalProps, card }
}
